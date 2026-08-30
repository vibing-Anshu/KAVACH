from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from url_checker import check_url
from sms_checker import check_sms
from assistant import explain_result
from database import init_db, log_check, save_feedback, get_accuracy
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

class URLRequest(BaseModel):
    url: str

class SMSRequest(BaseModel):
    message: str

class ExplainRequest(BaseModel):
    result: dict = None
    question: str = None

class FeedbackRequest(BaseModel):
    check_id: int
    actual_label: str  # "scam" or "safe"

@app.post("/check-url")
def check_url_endpoint(request: URLRequest):
    result = check_url(request.url)
    check_id = log_check("url", request.url, json.dumps(result))
    result["check_id"] = check_id
    return result

@app.post("/check-sms")
def check_sms_endpoint(request: SMSRequest):
    result = check_sms(request.message)
    check_id = log_check("sms", request.message, json.dumps(result))
    result["check_id"] = check_id
    return result

@app.post("/ask-assistant")
def ask_assistant_endpoint(request: ExplainRequest):
    explanation = explain_result(request.result, request.question)
    return {"explanation": explanation}

@app.post("/feedback")
def feedback_endpoint(request: FeedbackRequest):
    save_feedback(request.check_id, request.actual_label)
    return {"message": "Feedback recorded"}

@app.get("/accuracy")
def accuracy_endpoint():
    return get_accuracy()
