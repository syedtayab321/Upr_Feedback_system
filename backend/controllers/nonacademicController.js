import  db  from './../models/index.js';
import { Op } from 'sequelize';

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await db.Feedback.findAll({
      where: { portal: 'non_academic' },
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