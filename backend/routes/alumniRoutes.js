import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { submitFeedback, getFeedbacks } from './../controllers/alumniController.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.post('/feedback', submitFeedback);
router.get('/feedback', getFeedbacks);

export default router;