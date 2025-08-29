import  db  from './../models/index.js';
import  { analyzeSentiment } from './../utils/sentimentAnalyzer.js';
import { Op } from 'sequelize';

export const submitFeedback = async (req, res) => {
  try {
    const { questionnaireId, content, portal = 'student' } = req.body;
    const { id: userId } = req.user;
    const { score, category } = await analyzeSentiment(content, 'vader');
    const feedback = await db.Feedback.create({
      userId,
      questionnaireId,
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
      where: { userId },
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

export const getQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await db.Questionnaire.findAll({
      where: { portal: 'student' }
    });
    res.json(questionnaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChatUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: {
        role: { [Op.in]: ['academic_staff', 'non_academic_staff'] }
      },
      attributes: ['id', 'firstName', 'lastName', 'role']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const chats = await db.Chat.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { receiverId: userId }]
      },
      include: [
        { model: db.User, as: 'sender' },
        { model: db.User, as: 'receiver' }
      ],
      order: [['createdAt', 'ASC']]
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};