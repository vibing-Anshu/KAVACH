import sqlite3
import json

DB_NAME = "kavach.db"

def init_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS checks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            check_type TEXT NOT NULL,
            input_data TEXT NOT NULL,
            result TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_feedback TEXT
        )
    """)
    conn.commit()
    conn.close()

def log_check(check_type: str, input_data: str, result: str) -> int:
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO checks (check_type, input_data, result) VALUES (?, ?, ?)",
        (check_type, input_data, result)
    )
    conn.commit()
    check_id = cursor.lastrowid
    conn.close()
    return check_id

def save_feedback(check_id: int, actual_label: str):
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE checks SET user_feedback = ? WHERE id = ?",
        (actual_label, check_id)
    )
    conn.commit()
    conn.close()

def get_accuracy():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute("SELECT result, user_feedback FROM checks WHERE user_feedback IS NOT NULL")
    rows = cursor.fetchall()
    conn.close()

    if not rows:
        return {"total_rated": 0, "correct": 0, "accuracy_percent": None}

    correct = 0
    for result_json, feedback in rows:
        result = json.loads(result_json)
        predicted_suspicious = result.get("suspicious", result.get("spam", False))
        actual_suspicious = feedback == "scam"

        if predicted_suspicious == actual_suspicious:
            correct += 1

    total = len(rows)
    accuracy = round((correct / total) * 100, 1)

    return {"total_rated": total, "correct": correct, "accuracy_percent": accuracy}