import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import db from './models/index.js';
import { Server } from 'socket.io';
import studentRoutes from './routes/studentRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import nonAcademicRoutes from './routes/nonacademicRoutes.js';
import alumniRoutes from './routes/alumniRoutes.js';
import { createServer } from "http";
import sequelize from "./config/db.js";
import { analyzeSentiment } from './utils/sentimentAnalyzer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
  }
});

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/non-academic', nonAcademicRoutes);
app.use('/api/alumni', alumniRoutes);

app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running successfully' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('New socket connection:', socket.id);

  socket.on('join', (userId) => {
    activeUsers.set(userId, socket.id);
    socket.join(userId);
    console.log(`User ${userId} joined room with socket ${socket.id}`);
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }, callback) => {
    try {
      console.log('Processing message:', { senderId, receiverId, message: message.substring(0, 50) });
      
      if (!senderId || !receiverId || !message?.trim()) {
        if (callback) callback({ success: false, error: 'Invalid message data' });
        return;
      }

      const { category: sentiment } = await analyzeSentiment(message, 'vader');
      
      const chat = await db.Chat.create({ 
        senderId, 
        receiverId, 
        message, 
        sentiment 
      });
      
      const populatedChat = await db.Chat.findByPk(chat.id, {
        include: [
          { model: db.User, as: 'sender', attributes: ['id', 'firstName', 'lastName', 'role'] },
          { model: db.User, as: 'receiver', attributes: ['id', 'firstName', 'lastName', 'role'] }
        ]
      });

      const messageData = {
        ...populatedChat.toJSON(),
        timestamp: new Date().toISOString()
      };

      io.to(receiverId).emit('receiveMessage', messageData);
      io.to(senderId).emit('receiveMessage', messageData);
      
      if (callback) {
        callback({ 
          success: true, 
          message: messageData 
        });
      }
      
      console.log(`Message sent from ${senderId} to ${receiverId}`);
    } catch (err) {
      console.error('Chat error:', err);
      if (callback) {
        callback({ success: false, error: 'Failed to send message' });
      }
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
    for (const [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        console.log(`User ${userId} removed from active users`);
        break;
      }
    }
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Database sync failed:", err);
});