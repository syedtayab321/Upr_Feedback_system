from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from transformers import pipeline
import torch  # For transformers compatibility

app = FastAPI(title="Sentiment Analysis Service")

# Initialize analyzers
vader_analyzer = SentimentIntensityAnalyzer()
textblob_analyzer = None 
transformers_analyzer = pipeline("sentiment-analysis")

class TextInput(BaseModel):
    text: str

@app.post("/analyze")
async def analyze_sentiment(input: TextInput, library: str = "vader"):
    text = input.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Text input is required")

    if library.lower() == "vader":
        scores = vader_analyzer.polarity_scores(text)
        compound = scores['compound']
        if compound >= 0.05:
            category = 'positive'
        elif compound <= -0.05:
            category = 'negative'
        else:
            category = 'neutral'
        return {"score": compound, "category": category, "details": scores}

    elif library.lower() == "textblob":
        blob = TextBlob(text)
        polarity = blob.sentiment.polarity
        if polarity > 0:
            category = 'positive'
        elif polarity < 0:
            category = 'negative'
        else:
            category = 'neutral'
        return {"score": polarity, "category": category, "details": {"subjectivity": blob.sentiment.subjectivity}}

    elif library.lower() == "transformers":
        result = transformers_analyzer(text)[0]
        category = result['label'].lower()
        score = result['score'] if category == 'positive' else -result['score']
        return {"score": score, "category": category, "details": result}

    else:
        raise HTTPException(status_code=400, detail="Invalid library. Choose 'vader', 'textblob', or 'transformers'.")

# Run with: uvicorn main:app --reload