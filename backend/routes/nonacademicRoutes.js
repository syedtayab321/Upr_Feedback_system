import express from 'express';
import { authenticate } from './../middlewares/authMiddleware.js';
import {
  getFeedbacks,
  respondToFeedback,
  submitFeedback,
  getChats,
   getChatUsers,
  getQuestionnaires
} from './../controllers/nonacademicController.js';

const router = express.Router();

router.use(authenticate);

router.get('/feedback', getFeedbacks);
router.post('/feedback/respond', respondToFeedback);
router.get('/chats', getChats);
router.get('/chat-users', getChatUsers);
router.get('/questionnaires', getQuestionnaires);
router.post('/feedback', submitFeedback);
export default router;