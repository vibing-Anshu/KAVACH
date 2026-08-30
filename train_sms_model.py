import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle

# 1. Load the dataset — no header row, tab-separated
data = pd.read_csv("spam.csv", sep="\t", header=None, names=["label", "message"], encoding="latin-1")

# 2. Convert text messages into numbers the model can understand
vectorizer = CountVectorizer()
X = vectorizer.fit_transform(data["message"])
y = data["label"]

# 3. Train the model
model = MultinomialNB()
model.fit(X, y)

# 4. Save the trained model AND the vectorizer for later use
with open("sms_model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)

print("Training complete! Model saved.")