import  db  from './../models/index.js';
import { Op } from 'sequelize';

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await db.Feedback.findAll({
      where: { portal: 'student' },
      include: [
        { model: db.User },
        { model: db.FeedbackResponse, include: [{ model: db.User, as: 'responder' }] }
      ]
    });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const respondToFeedback = async (req, res) => {
  try {
    const { feedbackId, response } = req.body;
    const { id: responderId } = req.user;
    const feedbackResponse = await db.FeedbackResponse.create({
      feedbackId,
      responderId,
      response
    });
    res.status(201).json(feedbackResponse);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getChatUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: {
        role: { [Op.in]: ['academic_staff', 'non_academic_staff','student'] }
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
        [Op.or]: [{ senderId: userId }, { receiverId: userId }],
      },
      include: [
        { model: db.User, as: 'sender' },
        { model: db.User, as: 'receiver' }
      ],
      order: [['createdAt', 'ASC']]
    }); // Enhanced logging
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err); // Log full error
    res.status(500).json({ message: err.message });
  }
};

export const getSentimentTrends = async (req, res) => {
  try {
    
    const { startDate, endDate } = req.query.startDate ? req.query : req.body;
    const where = {};
    
    if (startDate || endDate) {
      where.createdAt = {};
      
      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        where.createdAt[Op.gte] = start;
        console.log('Start date filter:', start);
      }
      
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = end;
        console.log('End date filter:', end);
      }
    }
    await db.Feedback.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'sentiment', 'portal', 'createdAt', 'content', 'userId']
    });
  
    const feedbacks = await db.Feedback.findAll({ 
      where,
      attributes: ['id', 'sentiment', 'portal', 'createdAt', 'content']
    });

    const sentimentCounts = {
      positive: feedbacks.filter(f => f.sentiment === 'positive').length,
      negative: feedbacks.filter(f => f.sentiment === 'negative').length,
      neutral: feedbacks.filter(f => f.sentiment === 'neutral' || !f.sentiment).length
    };
    
    res.json(sentimentCounts);
  } catch (err) {
    console.error('Error in getSentimentTrends:', err);
    res.status(500).json({ 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};