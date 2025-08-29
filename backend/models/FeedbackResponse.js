import { DataTypes } from 'sequelize';
import sequelize from './../config/db.js';
import User from './User.js';
import Feedback from './Feedback.js';

const FeedbackResponse = sequelize.define('FeedbackResponse', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  feedbackId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Feedback,
      key: 'id'
    }
  },
  responderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});

FeedbackResponse.belongsTo(Feedback, { foreignKey: 'feedbackId' });
FeedbackResponse.belongsTo(User, { as: 'responder', foreignKey: 'responderId' });
Feedback.hasMany(FeedbackResponse, { foreignKey: 'feedbackId' });

export default FeedbackResponse;