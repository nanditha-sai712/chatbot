"""
Full HTTP integration test against a locally running backend.
Exercises the exact endpoints the frontend uses, then cleans up test data.

Backend must be running on http://localhost:8000 first.
    python scripts/test_api.py
"""

import sys
import time
from pathlib import Path

import httpx

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

BASE = "http://localhost:8000"
TEST_EMAIL = "rag_test_delete_me@example.com"

SAMPLE_DOC = (
    "ACME Corp Employee Handbook\n\n"
    "Vacation Policy\n\n"
    "Full-time employees receive 20 paid vacation days per year. "
    "Vacation days must be approved by your manager at least two weeks in advance. "
    "Unused vacation days can be carried over, up to a maximum of 5 days.\n\n"
    "Remote Work\n\n"
    "Employees may work remotely up to 3 days per week. "
    "All remote workers must be available on Slack between 10am and 4pm.\n\n"
    "Health Benefits\n\n"
    "The company covers 80 percent of medical insurance premiums for employees "
    "and 50 percent for dependents."
)

c = httpx.Client(base_url=BASE, timeout=120)

print("=== 0) Health check ===")
print(c.get("/").json())

print("\n=== 1) Register test user ===")
r = c.post("/register", json={"username": "Rag Tester", "email": TEST_EMAIL, "password": "test1234"})
if r.status_code == 400:  # already exists from a previous run -> login
    print("  user exists, logging in")
    r = c.post("/login", json={"email": TEST_EMAIL, "password": "test1234"})
r.raise_for_status()
user_id = r.json()["user_id"]
print(f"✅ user_id = {user_id}")

print("\n=== 2) Upload a document ===")
files = {"file": ("handbook.txt", SAMPLE_DOC.encode(), "text/plain")}
data = {"user_id": user_id, "document_name": "handbook.txt"}
r = c.post("/upload/document", files=files, data=data)
r.raise_for_status()
up = r.json()
doc_id = up["document_id"]
print(f"✅ uploaded, {up.get('num_chunks')} chunks, doc_id = {doc_id}")
print(f"   summary: {up.get('summary')}")

# give Atlas a moment to index the new chunks
time.sleep(6)

print("\n=== 3) Ask questions (real RAG) ===")
questions = [
    "How many vacation days do full-time employees get?",
    "How many days per week can I work remotely?",
    "What percentage of medical premiums does the company cover for dependents?",
]
for q in questions:
    r = c.post("/chat/ai", json={"user_id": user_id, "document_id": doc_id, "message": q})
    r.raise_for_status()
    ans = r.json()["answer"]
    print(f"\nQ: {q}\nA: {ans}")

# ----------------------------------------------------------------------
# Cleanup — remove all test data from Atlas
# ----------------------------------------------------------------------
print("\n=== 4) Cleanup ===")
from app.main import (  # noqa: E402
    users_collection, documents_collection, chunks_collection, responses_collection,
)
u = users_collection.delete_many({"email": TEST_EMAIL}).deleted_count
d = documents_collection.delete_many({"user_id": user_id}).deleted_count
ch = chunks_collection.delete_many({"user_id": user_id}).deleted_count
rs = responses_collection.delete_many({"user_id": user_id}).deleted_count
print(f"🧹 removed user={u} docs={d} chunks={ch} responses={rs}")
print("\n✅ FULL API FLOW PASSED — RAG works over HTTP exactly like the frontend uses it.")
