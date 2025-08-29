import db from './../models/index.js';
import { analyzeSentiment } from './../utils/sentimentAnalyzer.js';
import { Op } from 'sequelize';

// ================== User Management ==================
export const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = await db.User.create({ firstName, lastName, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await db.User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update(updates);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await db.User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== Monitoring ==================
export const getActivities = async (req, res) => {
  try {
    const logs = await db.ActivityLog.findAll({ include: db.User });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await db.Feedback.findAll({ include: db.User });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getChats = async (req, res) => {
  try {
    const chats = await db.Chat.findAll({
      include: [
        { model: db.User, as: 'sender' },
        { model: db.User, as: 'receiver' }
      ]
    });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== Moderation ==================
export const moderateChat = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await db.Chat.findByPk(id);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    await chat.update({ isModerated: true });
    res.json({ message: 'Chat moderated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== Sentiment Reports ==================
export const generateSentimentReport = async (req, res) => {
  const { startDate, endDate, role } = req.query;
  try {
    const where = {};
    if (startDate) where.createdAt = { [Op.gte]: new Date(startDate) };
    if (endDate) where.createdAt = { ...where.createdAt, [Op.lte]: new Date(endDate) };

    const feedbacks = await db.Feedback.findAll({ where, include: db.User });
    const chats = await db.Chat.findAll({ where, include: [{ model: db.User, as: 'sender' }] });

    // Filter by user role
    const filteredFeedbacks = role ? feedbacks.filter(f => f.User.role === role) : feedbacks;
    const filteredChats = role ? chats.filter(c => c.sender?.role === role) : chats;

    // Analyze sentiment if missing
    for (let fb of filteredFeedbacks) {
      if (!fb.sentiment) {
        const { category, score } = analyzeSentiment(fb.content);
        await fb.update({ sentiment: category, score });
      }
    }

    for (let ch of filteredChats) {
      if (!ch.sentiment) {
        const { category, score } = analyzeSentiment(ch.message);
        await ch.update({ sentiment: category, score });
      }
    }

    // Aggregate
    const report = {
      positive:
        filteredFeedbacks.filter(f => f.sentiment === 'positive').length +
        filteredChats.filter(c => c.sentiment === 'positive').length,
      negative:
        filteredFeedbacks.filter(f => f.sentiment === 'negative').length +
        filteredChats.filter(c => c.sentiment === 'negative').length,
      neutral:
        filteredFeedbacks.filter(f => f.sentiment === 'neutral').length +
        filteredChats.filter(c => c.sentiment === 'neutral').length,
      details: { feedbacks: filteredFeedbacks, chats: filteredChats }
    };

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== Questionnaires ==================
export const createQuestionnaire = async (req, res) => {
  try {
    const { title, questions, portal } = req.body;
    const questionnaire = await db.Questionnaire.create({ title, questions, portal });
    res.status(201).json(questionnaire);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const questionnaire = await db.Questionnaire.findByPk(id);
    if (!questionnaire) return res.status(404).json({ message: 'Questionnaire not found' });
    await questionnaire.update(updates);
    res.json(questionnaire);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await db.Questionnaire.findAll();
    res.json(questionnaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
