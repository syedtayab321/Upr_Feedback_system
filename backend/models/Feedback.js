import { DataTypes } from 'sequelize';
import sequelize from './../config/db.js';
import User from './User.js';

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  questionnaireId: {
    type: DataTypes.UUID,
    allowNull: true // Optional if not tied to a questionnaire
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  sentiment: {
    type: DataTypes.ENUM('positive', 'negative', 'neutral'),
    allowNull: true // Computed later
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true // Sentiment score
  },
  portal: {
    type: DataTypes.ENUM('student', 'academic', 'non_academic', 'alumni'),
    allowNull: false
  }
}, {
  timestamps: true
});

Feedback.belongsTo(User, { foreignKey: 'userId' });

export default Feedback;