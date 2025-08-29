import express from 'express';
import { authenticate } from './../middlewares/authMiddleware.js';
import {
  submitFeedback,
  getFeedbacks,
  getQuestionnaires,
  getChatUsers,
  getChats
} from './../controllers/studentController.js';

const router = express.Router();

router.use(authenticate);

router.post('/feedback', submitFeedback);
router.get('/feedback', getFeedbacks);
router.get('/questionnaires', getQuestionnaires);
router.get('/chat-users', getChatUsers);
router.get('/chats', getChats);

export default router;