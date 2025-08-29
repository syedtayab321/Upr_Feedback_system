import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';

const Chat = sequelize.define('Chat', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  isModerated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sentiment: {
    type: DataTypes.ENUM('positive', 'negative', 'neutral'),
    allowNull: true
  }
}, {
  timestamps: true
});

Chat.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });
Chat.belongsTo(User, { as: 'receiver', foreignKey: 'receiverId' });

export default Chat;