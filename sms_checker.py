import pickle

with open("sms_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)

SUSPICIOUS_KEYWORDS = [
    "kyc", "otp", "account will be", "account has been", "blocked", "suspended",
    "verify your account", "click the link", "urgent action", "24 hours",
    "update your details", "bank account", "will be closed", "will be seized"
]

def check_sms(message: str) -> dict:
    message_vector = vectorizer.transform([message])
    prediction = str(model.predict(message_vector)[0])
    ml_says_spam = prediction == "spam"

    lower_message = message.lower()
    matched_keywords = [kw for kw in SUSPICIOUS_KEYWORDS if kw in lower_message]
    keyword_flag = len(matched_keywords) > 0

    is_spam = ml_says_spam or keyword_flag

    return {
        "message": message,
        "spam": bool(is_spam),
        "label": "spam" if is_spam else "ham",
        "ml_prediction": prediction,
        "matched_keywords": matched_keywords
    }