import axios from 'axios';

export const analyzeSentiment = async (text, library = 'vader') => {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8001/analyze?library=${library}`,
      { text },
      { timeout: 5000 }
    );
    const { score, category } = response.data;
    return { score, category };
  } catch (err) {
    console.error('Sentiment analysis error:', err.message);
    // Fallback to neutral if service fails
    return { score: 0, category: 'neutral' };
  }
};