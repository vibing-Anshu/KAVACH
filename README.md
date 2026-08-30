# 🛡️ KAVACH — Digital Safety & Scam Prevention Assistant

**Kavach** (meaning "shield" or "armor") is an AI-powered personal digital safety assistant built for **Smart India Hackathon 2026**, designed to detect scam URLs, spam/fraudulent SMS messages, and explain risks to everyday users in plain, non-technical language — while continuously grading its own accuracy through real user feedback.

🔗 **Live Demo:** [https://bespoke-meringue-65a7b8.netlify.app](https://bespoke-meringue-65a7b8.netlify.app)
🔗 **Live Backend API Docs:** [https://kavach-fooy.onrender.com/docs](https://kavach-fooy.onrender.com/docs)

---

## 🎯 Problem Statement

**Personal Digital Safety & Scam Prevention Assistant**

Scams involving fraudulent links, fake KYC/OTP requests, and phishing SMS messages are a growing threat, especially to users unfamiliar with the technical warning signs. Kavach helps bridge that gap by:
- Detecting suspicious URLs and SMS messages automatically
- Explaining *why* something is risky in simple language
- Learning from user feedback to track and improve its own accuracy over time

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔗 **URL Scanner** | Detects phishing links using rule-based checks — missing HTTPS, IP-based domains, suspicious TLDs, unusually long domains |
| 💬 **SMS/Message Scanner** | Combines a trained ML model (Naive Bayes) with a keyword safety net to catch scam patterns (KYC fraud, OTP scams, lottery scams, urgency tactics) |
| 🤖 **AI Safety Assistant** | Explains scan results in plain language, or answers general digital-safety questions, powered by an LLM (Groq) |
| 📊 **Self-Grading System** | Users confirm whether a result was correct; the system tracks and reports its own live accuracy |
| 🌐 **Full-Stack Deployment** | FastAPI backend deployed on Render, frontend deployed on Netlify |

---

## 🏗️ Architecture

```
┌─────────────────┐      HTTPS       ┌──────────────────────┐
│   Frontend       │ ───────────────▶ │   FastAPI Backend     │
│  (HTML/CSS/JS)   │ ◀─────────────── │   (Render)             │
│  Netlify          │      JSON        │                        │
└─────────────────┘                  │  ├─ URL Checker         │
                                      │  ├─ SMS Checker (ML)    │
                                      │  ├─ AI Assistant (Groq) │
                                      │  ├─ SQLite Database     │
                                      │  └─ Feedback/Accuracy   │
                                      └──────────────────────┘
```

---

## 🛠️ Tech Stack

**Backend**
- Python, FastAPI, Uvicorn
- scikit-learn (Naive Bayes classifier for SMS spam detection)
- SQLite (check logging + feedback storage)
- Groq API (`openai/gpt-oss-120b`) for AI explanations
- Deployed on Render

**Frontend**
- HTML, CSS, Vanilla JavaScript
- Deployed on Netlify

---

## 📁 Project Structure

```
KAVACH/
├── main.py                 # FastAPI app & all API routes
├── url_checker.py          # Rule-based URL scam detection
├── sms_checker.py          # ML model + keyword-based SMS scam detection
├── assistant.py            # AI assistant (Groq integration)
├── database.py             # SQLite logging, feedback, accuracy calculation
├── train_sms_model.py      # One-time script to train the SMS spam model
├── requirements.txt        # Python dependencies
├── sms_model.pkl           # Trained ML model
├── vectorizer.pkl          # Text vectorizer for the ML model
├── spam.csv                # Training dataset (SMS Spam Collection)
└── frontend/
    ├── index.html
    ├── styles.css
    └── app.js
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/check-url` | Analyze a URL for scam/phishing indicators |
| `POST` | `/check-sms` | Analyze an SMS/message for scam indicators |
| `POST` | `/ask-assistant` | Get an AI explanation of a result, or ask a general safety question |
| `POST` | `/feedback` | Submit whether a prediction was correct (`"scam"` or `"safe"`) |
| `GET` | `/accuracy` | Get the system's live self-graded accuracy stats |

Full interactive API documentation available at `/docs` (Swagger UI).

---

## 🚀 Running Locally

### Backend
```bash
cd Project_backend
pip install -r requirements.txt
```
Create a `.env` file with:
```
GROQ_API_KEY=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
```
Then run:
```bash
uvicorn main:app --reload
```
Visit `http://127.0.0.1:8000/docs` to test the API.

### Frontend
Open `frontend/index.html` directly in a browser. Update the backend URL in `app.js` if testing against a local backend instead of the deployed one.

---

## 🧠 Known Limitations & Design Notes

- The SMS classifier is trained on the public **SMS Spam Collection** dataset (UK-based, ~2011), which doesn't fully cover India-specific scam patterns (KYC fraud, UPI scams). To address this, a **keyword-based safety net** runs alongside the ML model to catch common Indian scam phrasing the model alone misses.
- The self-grading system relies on user-submitted feedback, so accuracy reporting reflects confirmed cases only, not every prediction made.

---

## 👤 Team Phoenix

Built for Inner screening round Smart India Hackathon 2026.

---

## 📄 License

This project was built for educational and hackathon purposes.