import db from './../models/index.js';
import { analyzeSentiment } from '../utils/sentimentAnalyzer.js';

export const submitFeedback = async (req, res) => {
  try {
    const { content, portal = 'alumni' } = req.body;
    const { id: userId } = req.user;
    const { score, category } = await analyzeSentiment(content, 'vader');
    const feedback = await db.Feedback.create({
      userId,
      content,
      sentiment: category,
      score,
      portal
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const feedbacks = await db.Feedback.findAll({
      where: { userId, portal: 'alumni' },
      include: [
        { model: db.FeedbackResponse, include: [{ model: db.User, as: 'responder' }] },
        { model: db.User }
      ]
    });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};