import express from 'express';
import { authenticate } from './../middlewares/authMiddleware.js';
import {
  getFeedbacks,
  submitFeedback,
  respondToFeedback,
  getChats,
  getSentimentTrends,
  getChatUsers,
  getQuestionnaires
} from './../controllers/academicController.js';

const router = express.Router();

router.use(authenticate);
router.post('/feedback', submitFeedback);
router.get('/feedback', getFeedbacks);
router.post('/feedback/respond', respondToFeedback);
router.get('/chats', getChats);
router.get('/sentiment-trends', getSentimentTrends);
router.get('/chat-users', getChatUsers);
router.get('/questionnaires', getQuestionnaires);

export default router;