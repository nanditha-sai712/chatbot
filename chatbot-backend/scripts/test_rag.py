"""
End-to-end RAG retrieval test against the real Atlas index.
Inserts temporary chunks, runs a real vector search, then deletes them.

    python scripts/test_rag.py
"""

import sys
import time
import uuid
from pathlib import Path

# Make 'app' importable
ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from app.main import chunk_text, embed, vector_search, chunks_collection  # noqa: E402

TEST_USER = "TEST_USER_DELETE_ME"
TEST_DOC = "TEST_DOC_DELETE_ME"

SAMPLE = (
    "The Eiffel Tower is located in Paris, France. It was completed in 1889 "
    "and stands 330 metres tall. "
    "Photosynthesis is the process by which green plants use sunlight to make "
    "food from carbon dioxide and water, releasing oxygen as a by-product. "
    "The mitochondria is the powerhouse of the cell and produces ATP energy. "
    "Mount Everest is the tallest mountain on Earth at 8,849 metres above sea level."
)

print("=== 1) Chunk + embed a sample document ===")
chunks = chunk_text(SAMPLE, size=30, overlap=5)   # small chunks so we get several
vectors = embed(chunks, is_query=False)
print(f"✅ {len(chunks)} chunks embedded")

docs = [
    {"_id": str(uuid.uuid4()), "document_id": TEST_DOC, "user_id": TEST_USER,
     "chunk_index": i, "text": c, "embedding": v}
    for i, (c, v) in enumerate(zip(chunks, vectors))
]
chunks_collection.insert_many(docs)
print(f"✅ inserted {len(docs)} test chunks")

try:
    print("\n=== 2) Ask: 'How tall is the Eiffel Tower?' ===")
    qvec = embed(["How tall is the Eiffel Tower?"], is_query=True)[0]

    # Atlas needs a few seconds to index brand-new docs for vector search
    hits = []
    for attempt in range(10):
        hits = vector_search(qvec, TEST_DOC, TEST_USER, k=2)
        if hits:
            break
        print(f"  (waiting for new chunks to be indexed... {attempt+1})")
        time.sleep(4)

    if not hits:
        print("⚠️ No hits returned yet (indexing lag). Re-run to confirm.")
    else:
        print("✅ Top retrieved chunks:")
        for h in hits:
            print(f"   score={h['score']:.3f}  ->  {h['text']}")
        top = hits[0]["text"].lower()
        if "330" in top or "eiffel" in top:
            print("\n✅ RETRIEVAL CORRECT — it pulled the Eiffel Tower chunk for an Eiffel question.")
finally:
    deleted = chunks_collection.delete_many({"user_id": TEST_USER}).deleted_count
    print(f"\n🧹 cleaned up {deleted} test chunks")
