from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from transformers import pipeline

app = FastAPI(title="Sentiment Analysis Service")

vader_analyzer = SentimentIntensityAnalyzer()
transformers_analyzer = None  # 👈 important

class TextInput(BaseModel):
    text: str


@app.on_event("startup")
def load_models():
    global transformers_analyzer
    transformers_analyzer = pipeline("sentiment-analysis")
    print("✅ Transformers model loaded")


@app.get("/")
async def root():
    return {"message": "Sentiment Analysis Service is running."}


@app.post("/analyze")
async def analyze_sentiment(input: TextInput, library: str = "vader"):
    text = input.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text input is required")

    if library.lower() == "vader":
        scores = vader_analyzer.polarity_scores(text)
        compound = scores["compound"]

        if compound >= 0.05:
            category = "positive"
        elif compound <= -0.05:
            category = "negative"
        else:
            category = "neutral"

        return {
            "library": "vader",
            "score": compound,
            "category": category,
            "details": scores
        }

    elif library.lower() == "textblob":
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity

        return {
            "library": "textblob",
            "score": polarity,
            "category": "positive" if polarity > 0 else "negative" if polarity < 0 else "neutral",
            "details": {
                "polarity": polarity,
                "subjectivity": blob.sentiment.subjectivity
            }
        }

    elif library.lower() == "transformers":
        result = transformers_analyzer(text)[0]

        label = result["label"].lower()
        score = result["score"]

        return {
            "library": "transformers",
            "score": score if label == "positive" else -score,
            "category": label,
            "details": result
        }

    else:
        raise HTTPException(
            status_code=400,
            detail="Invalid library. Use vader, textblob, or transformers."
        )
