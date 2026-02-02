# ============================
# main.py (Improved + Clean Version)
# ============================

import os
import uuid
from datetime import datetime
from typing import Optional
import io

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from groq import Groq
from dotenv import load_dotenv
import pdfplumber
import bcrypt

# ============================
# LOAD ENV
# ============================

from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

if not MONGO_URL:
    raise Exception("❌ MONGO_URL missing in .env")

print("MongoDB:", "✅ configured")
print("Groq:", "✅ configured" if GROQ_API_KEY else "❌ missing")


# ============================
# FASTAPI SETUP
# ============================

app = FastAPI(title="RAG Chatbot Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================
# DATABASE CONNECTION
# ============================

try:
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000, tls=True)
    client.server_info()
    db = client["rag_chatbot_db"]
    print("✅ MongoDB connected")
except Exception as e:
    print("❌ MongoDB failed:", e)
    db = None


users_collection = db["users"] if db is not None else []
documents_collection = db["documents"] if db is not None else []
responses_collection = db["responses"] if db is not None else []



# ============================
# GROQ CLIENT
# ============================

groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None


# ============================
# MODELS
# ============================

class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class ChatRequest(BaseModel):
    user_id: str
    document_id: Optional[str] = None
    message: str


# ============================
# UTILS
# ============================

def hash_password(password: str):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode(), hashed.encode())


def serialize(doc):
    if not doc:
        return doc
    doc["_id"] = str(doc["_id"])
    for k, v in doc.items():
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


# ============================
# PDF EXTRACTION (better than PyPDF2)
# ============================

def extract_text_from_pdf(file: UploadFile):
    text = ""
    with pdfplumber.open(file.file) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text[:10000]


# ============================
# GROQ CALL
# ============================

def ask_groq(prompt: str, context: str = ""):
    if not groq_client:
        return "Groq API not configured."

    full_prompt = f"Context:\n{context[:3000]}\n\nQuestion: {prompt}"

    res = groq_client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": full_prompt}],
        temperature=0.3,
        max_tokens=500
    )

    return res.choices[0].message.content


# ============================
# ROUTES
# ============================

@app.get("/")
def root():
    return {"status": "running"}


@app.get("/health")
def health():
    return {
        "mongodb": "connected" if db else "fallback",
        "groq": "ready" if groq_client else "missing"
    }


# ============================
# REGISTER
# ============================

@app.post("/register")
def register(user: UserRegister):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(400, "User exists")

    user_id = str(uuid.uuid4())

    users_collection.insert_one({
        "_id": user_id,
        "username": user.username,
        "email": user.email,
        "password": hash_password(user.password),
        "created_at": datetime.now()
    })

    return {"user_id": user_id}


# ============================
# LOGIN
# ============================

@app.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one({"email": user.email})

    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(401, "Invalid credentials")

    return {
        "user_id": str(db_user["_id"]),
        "username": db_user["username"]
    }


# ============================
# UPLOAD PDF
# ============================

@app.post("/upload/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    document_name: str = Form("Untitled")
):

    text = extract_text_from_pdf(file)

    doc_id = str(uuid.uuid4())

    documents_collection.insert_one({
        "_id": doc_id,
        "user_id": user_id,
        "name": document_name,
        "content": text,
        "uploaded_at": datetime.now()
    })

    summary = ask_groq("Summarize this document briefly", text)

    return {
        "document_id": doc_id,
        "summary": summary[:200]
    }


# ============================
# CHAT
# ============================

@app.post("/chat/ai")
def chat(chat: ChatRequest):

    context = ""

    # If document_id provided → fetch document
    if chat.document_id:
        doc = documents_collection.find_one({
            "_id": chat.document_id,
            "user_id": chat.user_id
        })

        if not doc:
            raise HTTPException(404, "Document not found")

        context = doc.get("content", "")

    # Ask Groq (with or without context)
    answer = ask_groq(chat.message, context)

    responses_collection.insert_one({
        "_id": str(uuid.uuid4()),
        "user_id": chat.user_id,
        "document_id": chat.document_id,  # can be None
        "question": chat.message,
        "answer": answer,
        "timestamp": datetime.now()
    })

    return {"answer": answer}

# ============================
# ⭐ CHAT HISTORY (REQUIRED for React)
# ============================

@app.get("/chat/history/{user_id}")
def get_chat_history(user_id: str):

    chats = list(responses_collection.find({"user_id": user_id}))

    for chat in chats:
        chat["_id"] = str(chat["_id"])

    return {"chats": chats}



# ============================
# RUN
# ============================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
