# DocuChat AI — RAG Document Assistant

A full-stack document question-answering chatbot. Upload a PDF, DOCX, PPTX, or TXT file, and ask natural-language questions about it. Responses are grounded in your document content using Groq LLM inference, and can be turned into a visual mind map with one click.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React%2019-blue)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688)
![LLM](https://img.shields.io/badge/LLM-Groq-orange)

---

## Features

- **Multi-format document upload** — PDF, DOCX, PPTX, and TXT (up to 10 MB).
- **Conversational Q&A** — Ask questions in plain language; answers are drawn from the uploaded document.
- **Clean plain-text responses** — No markdown tables, LaTeX, or noisy syntax. Just readable paragraphs and bullet lists.
- **One-click Mind Map** — Generate a radial mind map of any response to visualize structure at a glance.
- **Copy to clipboard** — Every response has a copy button that outputs clean text.
- **User auth** — Register, log in, and per-user document storage via MongoDB.
- **Profile & settings** — Editable username, email, and avatar (stored locally). Toggle timestamps, auto-scroll, and compact mode.
- **Backend status indicator** — Live online/offline badge with simulated-mode fallback.

---

## Tech Stack

| Layer       | Stack                                                                 |
|-------------|----------------------------------------------------------------------|
| Frontend    | React 19, Vite, Tailwind CSS 4, React Router, Lucide icons            |
| Backend     | FastAPI, Uvicorn, Pydantic                                            |
| LLM         | Groq (`openai/gpt-oss-120b` via `groq` Python SDK)                    |
| Database    | MongoDB (users, documents, chat history)                              |
| File parsing| `pdfplumber` (PDF), `python-docx` (DOCX), `python-pptx` (PPTX)        |
| Auth        | `bcrypt` password hashing                                             |

---

## Project Structure

```
chatbot/
├── chatbot-backend/
│   ├── app/
│   │   └── main.py           # FastAPI app — routes, extractors, Groq client
│   ├── requirements.txt
│   └── venv/                 # local virtualenv (git-ignored)
│
├── chatbot-frontend/
│   ├── src/
│   │   └── components/
│   │       └── ChatPage.jsx  # main chat UI, mind map, profile/settings modals
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11 or 3.12 (3.13 also works)
- **MongoDB** connection string (MongoDB Atlas free tier is enough)
- **Groq API key** — sign up at [console.groq.com](https://console.groq.com) and generate one

---

## Backend Setup

```bash
cd chatbot-backend

# Create and activate virtualenv
python -m venv venv
.\venv\Scripts\Activate.ps1      # Windows PowerShell
# source venv/bin/activate       # macOS / Linux

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file inside `chatbot-backend/`:

```env
MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
GROQ_API_KEY=gsk_your_groq_key_here
```

Run the server:

```bash
uvicorn app.main:app --reload --port 8000
```

The API is now at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

---

## Frontend Setup

```bash
cd chatbot-frontend
npm install
npm run dev
```

The app opens at `http://localhost:5173`.

> **Note:** The frontend currently points to a deployed Render backend URL (`https://chatbot-eo65.onrender.com`) inside `ChatPage.jsx`. To run fully locally, search-and-replace that URL with `http://localhost:8000`.

---

## API Endpoints

| Method | Route                       | Description                                              |
|--------|-----------------------------|----------------------------------------------------------|
| GET    | `/`                         | Health ping — returns `{status: running}`                |
| GET    | `/health`                   | MongoDB and Groq status                                  |
| POST   | `/register`                 | `{username, email, password}` — create account          |
| POST   | `/login`                    | `{email, password}` — returns `user_id` + username      |
| POST   | `/upload/pdf`               | Legacy alias — accepts any supported format             |
| POST   | `/upload/document`          | Upload file (`file`, `user_id`, `document_name`)        |
| POST   | `/chat/ai`                  | `{user_id, document_id, message}` — ask a question      |
| GET    | `/chat/history/{user_id}`   | Fetch all past Q&A for a user                           |

Supported upload formats: `.pdf`, `.docx`, `.pptx`, `.txt` (max 10 MB).

---

## How It Works

1. **Upload** — The file is streamed to the backend, parsed by the matching extractor (`pdfplumber` / `python-docx` / `python-pptx` / text decoder), truncated to 10 000 characters, and stored in MongoDB with the owner's `user_id`.
2. **Summarize** — On upload, the backend asks Groq for a brief summary, which is returned to the frontend.
3. **Ask** — When you send a message, the backend fetches the document content, builds a plain-text-only prompt, and sends it to Groq. The answer is stored in `responses` collection and returned.
4. **Clean** — The frontend runs a defensive pass to strip any stray markdown tables, LaTeX, or emphasis syntax so the chat stays readable.
5. **Mind Map** — Clicking the Mind Map icon runs a client-side parser over the cleaned response (headings → branches, bullets → children) and renders an SVG radial tree.

---

## Common Issues

**`ModuleNotFoundError: No module named 'pptx'`**
Your shell is using a different Python than the venv. Always launch with:
```bash
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```
or activate the venv first.

**`PowerShell cannot run Activate.ps1`**
Run once per session:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

**Legacy `.doc` / `.ppt` files rejected**
These binary formats need LibreOffice to parse. Save as `.docx` / `.pptx` in Word/PowerPoint and retry.

**"Backend Offline" badge**
The frontend polls a few endpoints every 15 seconds. If your backend is running locally, either update the URL in `ChatPage.jsx` to `http://localhost:8000` or ensure the Render deploy is awake.

---

## Scripts

### Frontend
```bash
npm run dev       # start Vite dev server
npm run build     # production build
npm run preview   # preview the production build
npm run lint      # eslint check
```

### Backend
```bash
uvicorn app.main:app --reload --port 8000
```

---

## License

Private / educational project. Adapt freely for learning.
