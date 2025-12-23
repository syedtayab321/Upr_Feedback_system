import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { 
  submitFeedback, 
  getFeedbacks,
  getChatUsers,
  getChats,
  sendMessage,
  getAlumniProfile,
  updateAlumniProfile,
  getQuestionnaires
} from './../controllers/alumniController.js';

const router = express.Router();

router.use(authenticate);

router.post('/feedback', submitFeedback);
router.get('/feedback', getFeedbacks);

router.get('/chat/users', getChatUsers);
router.get('/chat', getChats);
router.post('/chat', sendMessage);

router.get('/profile', getAlumniProfile);
router.put('/profile', updateAlumniProfile);
router.get('/questionnaires', getQuestionnaires);

export default router;