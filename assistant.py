import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def explain_result(result: dict = None, question: str = None) -> str:
    if result:
        prompt = f"""A safety-check tool produced this result for a user:
{result}

Explain in 2-3 simple, non-technical sentences whether this looks risky and why,
so a regular person (not a programmer) can understand it."""
    else:
        prompt = f"""You are a helpful digital safety assistant for a scam-prevention app called Kavach.
Answer this user's question clearly and simply, in a few sentences:

{question}"""

    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content