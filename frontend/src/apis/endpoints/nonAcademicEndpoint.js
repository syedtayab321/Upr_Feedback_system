import api from './../axiosConfig';
import { io } from 'socket.io-client';

// Initialize socket connection
let socket = null;

export const initializeSocket = (userId) => {
  socket = io('http://localhost:5000');
  socket.emit('join', userId);
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};

// Feedback API
export const fetchFeedbacksApi = async () => {
  try {
    const response = await api.get('/non-academic/feedback');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch feedbacks');
  }
};

export const respondToFeedbackApi = async ({ feedbackId, response }) => {
  try {
    const responseData = await api.post('/non-academic/feedback/respond', { feedbackId, response });
    return responseData.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to respond to feedback');
  }
};

// Chat API
export const fetchChatsApi = async () => {
  try {
    const response = await api.get('/non-academic/chats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch chats');
  }
};

export const fetchChatUsersApi = async () => {
  try{
    const response = await api.get('/non-academic/chat-users');
    console.log(response);
    return response.data;
  }
  catch(error){
    throw new Error(error.response?.data?.message || 'Failed to fetch chat users');
  }
};

export const sendMessageApi = async ({ senderId, receiverId, message }) => {
  try {
    const socket = getSocket();
    return new Promise((resolve, reject) => {
      socket.emit('sendMessage', { senderId, receiverId, message }, (ack) => {
        if (ack.success) {
          resolve({ 
            senderId, 
            receiverId, 
            message, 
            id: ack.messageId, 
            timestamp: new Date().toISOString() 
          });
        } else {
          reject(new Error(ack.error || 'Failed to send message'));
        }
      });
    });
  } catch (error) {
    throw new Error(error.message || 'Failed to send message');
  }
};

// Socket event handlers
export const setupSocketListeners = (socket, dispatch, addMessageAction) => {
  socket.on('receiveMessage', (message) => {
    dispatch(addMessageAction(message));
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.warn('Socket disconnected:', reason);
  });

  return () => {
    socket.off('receiveMessage');
    socket.off('connect_error');
    socket.off('disconnect');
  };
};