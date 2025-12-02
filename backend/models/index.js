import sequelize from './../config/db.js';
import User from './User.js';
import Feedback from './Feedback.js';
import Chat from './Chat.js';
import Questionnaire from './Questionnaire.js';
import ActivityLog from './ActivityLog.js';
import FeedbackResponse from './FeedbackResponse.js';
const db = {
  sequelize,
  User,
  Feedback,
  Chat,
  Questionnaire,
  ActivityLog,
  FeedbackResponse,
};

export default db;