import express from 'express';
import { authenticate } from './../middlewares/authMiddleware.js';
import {
  getFeedbacks,
  respondToFeedback,
  getChats,
  getSentimentTrends,
  getChatUsers
} from './../controllers/academicController.js';

const router = express.Router();

router.use(authenticate);
router.get('/feedback', getFeedbacks);
router.post('/feedback/respond', respondToFeedback);
router.get('/chats', getChats);
router.get('/sentiment-trends', getSentimentTrends);
router.get('/chat-users', getChatUsers);

export default router;