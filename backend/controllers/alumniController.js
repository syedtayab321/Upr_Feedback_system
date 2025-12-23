import db from './../models/index.js';
import { analyzeSentiment } from '../utils/sentimentAnalyzer.js';
import { Op } from 'sequelize';

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

export const getQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await db.Questionnaire.findAll({
      where: { portal: 'alumni' }
    });
    res.json(questionnaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const feedbacks = await db.Feedback.findAll({
      where: { userId, portal: {
         [Op.in]: ['student', 'alumni']
      } },
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

export const getChatUsers = async (req, res) => {
  try {
    const { id: alumniId } = req.user;
    
    const users = await db.User.findAll({
      where: {
        id: { [Op.ne]: alumniId },
        [Op.or]: [
          { role: 'student' },
          { role: 'academic_staff' },
          { role: 'non_academic_staff' },
          { role: 'alumni' }
        ]
      },
      attributes: ['id', 'firstName', 'lastName', 'role', 'email'],
      order: [['firstName', 'ASC']]
    });
    
    res.json(users);
  } catch (err) {
    console.error('Error fetching chat users:', err);
    res.status(500).json({ message: 'Failed to fetch chat users' });
  }
};

export const getChats = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { withUser } = req.query;
    
    let whereCondition = {
      [Op.or]: [
        { senderId: userId },
        { receiverId: userId }
      ]
    };
    
    if (withUser) {
      whereCondition = {
        [Op.or]: [
          { senderId: userId, receiverId: withUser },
          { senderId: withUser, receiverId: userId }
        ]
      };
    }
    
    const chats = await db.Chat.findAll({
      where: whereCondition,
      include: [
        { model: db.User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'role'] },
        { model: db.User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'role'] }
      ],
      order: [['createdAt', 'ASC']]
    });
    
    res.json(chats);
  } catch (err) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { id: senderId } = req.user;
    const { receiverId, message } = req.body;
    
    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver ID and message are required' });
    }
    
    const { category: sentiment } = await analyzeSentiment(message, 'vader');
    
    const chat = await db.Chat.create({
      senderId,
      receiverId,
      message,
      sentiment
    });
    
    const populatedChat = await db.Chat.findByPk(chat.id, {
      include: [
        { model: db.User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'role'] },
        { model: db.User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'role'] }
      ]
    });
    
    res.status(201).json(populatedChat);
  } catch (err) {
    console.error('Error sending message:', err);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

export const getAlumniProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    
    const profile = await db.User.findByPk(userId, {
      include: [
        { model: db.AlumniProfile }
      ],
      attributes: { exclude: ['password'] }
    });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.json(profile);
  } catch (err) {
    console.error('Error fetching alumni profile:', err);
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
};

export const updateAlumniProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const updateData = req.body;
    
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.update({
      firstName: updateData.firstName || user.firstName,
      lastName: updateData.lastName || user.lastName,
      email: updateData.email || user.email
    });
    
    let alumniProfile = await db.AlumniProfile.findOne({ where: { userId } });
    
    if (alumniProfile) {
      await alumniProfile.update({
        graduationYear: updateData.graduationYear || alumniProfile.graduationYear,
        currentJob: updateData.currentJob || alumniProfile.currentJob,
        company: updateData.company || alumniProfile.company,
        linkedinUrl: updateData.linkedinUrl || alumniProfile.linkedinUrl,
        phone: updateData.phone || alumniProfile.phone,
        address: updateData.address || alumniProfile.address
      });
    } else {
      alumniProfile = await db.AlumniProfile.create({
        userId,
        graduationYear: updateData.graduationYear,
        currentJob: updateData.currentJob,
        company: updateData.company,
        linkedinUrl: updateData.linkedinUrl,
        phone: updateData.phone,
        address: updateData.address
      });
    }
    
    const updatedProfile = await db.User.findByPk(userId, {
      include: [
        { model: db.AlumniProfile }
      ],
      attributes: { exclude: ['password'] }
    });
    
    res.json(updatedProfile);
  } catch (err) {
    console.error('Error updating alumni profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};