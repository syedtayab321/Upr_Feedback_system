import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import  db  from './models/index.js';
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
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/non-academic', nonAcademicRoutes);
app.use('/api/alumni', alumniRoutes);


// Health check endpoint
app.get('/api/health', (res) => {
  res.json({ message: 'Server is running successfully' });
});

// Error handling middleware
app.use((err,res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((res) => {
  res.status(404).json({ message: 'Route not found' });
});


// sockets setup
io.on('connection', (socket) => {
  socket.on('join', (userId) => {
    socket.join(userId); // User joins their own room
  });

  socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
    try {
      const { category } = await analyzeSentiment(message, 'vader');
      const chat = await db.Chat.create({ senderId, receiverId, message, sentiment: category });
      io.to(receiverId).emit('receiveMessage', chat); // Send to receiver
      io.to(senderId).emit('receiveMessage', chat); // Echo back to sender
    } catch (err) {
      console.error('Chat error:', err);
    }
  });

  socket.on('disconnect', () => {
    // console.log('User disconnected:', socket.id);
  });
});

sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Database sync failed:", err);
});
