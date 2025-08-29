import express from 'express';
import { authenticate, adminOnly } from './../middlewares/authMiddleware.js';
import {
  createUser, updateUser, deleteUser, getAllUsers,
  getActivities, getFeedbacks, getChats,
  moderateChat,
  generateSentimentReport,
  createQuestionnaire, updateQuestionnaire, getQuestionnaires
} from './../controllers/adminController.js';

const router = express.Router();

router.use(authenticate, adminOnly); // All routes protected for admin

// User Management
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users', getAllUsers);

// Monitoring
router.get('/activities', getActivities);
router.get('/feedbacks', getFeedbacks);
router.get('/chats', getChats);

// Moderation
router.put('/chats/:id/moderate', moderateChat);

// Reports
router.get('/reports/sentiment', generateSentimentReport);

// Questionnaires
router.post('/questionnaires', createQuestionnaire);
router.put('/questionnaires/:id', updateQuestionnaire);
router.get('/questionnaires', getQuestionnaires);

export default router;