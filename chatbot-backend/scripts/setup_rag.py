"""
One-time RAG setup + verification.

Run from chatbot-backend with the venv active:
    python scripts/setup_rag.py

Steps:
  1. Verify the Jina API key works and returns the expected vector size.
  2. Ensure the 'chunks' collection exists.
  3. Create the Atlas Vector Search index 'vector_index' (idempotent).
  4. Report the index status.
"""

import os
import sys
import time
from pathlib import Path

import httpx
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.operations import SearchIndexModel

# Load .env from chatbot-backend/ (parent of this scripts/ folder)
ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

MONGO_URL = os.getenv("MONGO_URL")
JINA_API_KEY = os.getenv("JINA_API_KEY")

EMBED_MODEL = "jina-embeddings-v3"
EMBED_DIM = 1024
INDEX_NAME = "vector_index"
DB_NAME = "rag_chatbot_db"
COLL_NAME = "chunks"


def step(msg):
    print(f"\n=== {msg} ===")


def fail(msg):
    print(f"❌ {msg}")
    sys.exit(1)


# ----------------------------------------------------------------------
# 1) Verify Jina embeddings
# ----------------------------------------------------------------------
step("1) Verifying Jina API key + embedding size")
if not JINA_API_KEY:
    fail("JINA_API_KEY missing in .env")

try:
    resp = httpx.post(
        "https://api.jina.ai/v1/embeddings",
        headers={"Authorization": f"Bearer {JINA_API_KEY}", "Content-Type": "application/json"},
        json={
            "model": EMBED_MODEL,
            "task": "retrieval.passage",
            "dimensions": EMBED_DIM,
            "input": [{"text": "hello world, this is a RAG connectivity test"}],
        },
        timeout=60,
    )
    resp.raise_for_status()
except httpx.HTTPStatusError as e:
    fail(f"Jina returned {e.response.status_code}: {e.response.text[:300]}")
except httpx.HTTPError as e:
    fail(f"Could not reach Jina: {e}")

vec = resp.json()["data"][0]["embedding"]
print(f"✅ Jina key works. Vector length = {len(vec)} (expected {EMBED_DIM})")
if len(vec) != EMBED_DIM:
    fail(f"Dimension mismatch — update EMBED_DIM in main.py and the index to {len(vec)}")


# ----------------------------------------------------------------------
# 2) Connect to Atlas + ensure collection
# ----------------------------------------------------------------------
step("2) Connecting to MongoDB Atlas")
if not MONGO_URL:
    fail("MONGO_URL missing in .env")

client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=10000, tls=True)
client.server_info()
db = client[DB_NAME]
print(f"✅ Connected to '{DB_NAME}'")

if COLL_NAME not in db.list_collection_names():
    db.create_collection(COLL_NAME)
    print(f"✅ Created collection '{COLL_NAME}'")
else:
    print(f"✅ Collection '{COLL_NAME}' already exists")

coll = db[COLL_NAME]


# ----------------------------------------------------------------------
# 3) Create the vector search index (idempotent)
# ----------------------------------------------------------------------
step("3) Creating Atlas Vector Search index 'vector_index'")

existing = {ix["name"] for ix in coll.list_search_indexes()}
if INDEX_NAME in existing:
    print(f"✅ Index '{INDEX_NAME}' already exists — skipping creation")
else:
    model = SearchIndexModel(
        name=INDEX_NAME,
        type="vectorSearch",
        definition={
            "fields": [
                {"type": "vector", "path": "embedding",
                 "numDimensions": EMBED_DIM, "similarity": "cosine"},
                {"type": "filter", "path": "document_id"},
                {"type": "filter", "path": "user_id"},
            ]
        },
    )
    coll.create_search_index(model)
    print(f"✅ Index '{INDEX_NAME}' creation requested")


# ----------------------------------------------------------------------
# 4) Poll until the index is queryable
# ----------------------------------------------------------------------
step("4) Waiting for index to become queryable (can take ~1-2 min)")
for attempt in range(40):
    info = next((ix for ix in coll.list_search_indexes() if ix["name"] == INDEX_NAME), None)
    status = info.get("status") if info else "MISSING"
    queryable = info.get("queryable") if info else False
    print(f"  status={status} queryable={queryable}")
    if queryable:
        print(f"\n✅ DONE — index '{INDEX_NAME}' is ACTIVE and queryable. RAG is ready.")
        break
    time.sleep(6)
else:
    print("\n⚠️ Index created but not queryable yet. Re-run this script in a minute to confirm.")
