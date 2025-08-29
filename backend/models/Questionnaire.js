import { DataTypes } from 'sequelize';
import sequelize from './../config/db.js';

const Questionnaire = sequelize.define('Questionnaire', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questions: {
    type: DataTypes.JSON,
    allowNull: false
  },
  portal: {
    type: DataTypes.ENUM('student', 'academic', 'non_academic', 'alumni'),
    allowNull: false
  }
}, {
  timestamps: true
});

export default Questionnaire;