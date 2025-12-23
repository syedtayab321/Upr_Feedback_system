import api from './../axiosConfig';

export const submitFeedbackApi = async (feedbackData) => {
  const response = await api.post('/alumni/feedback', feedbackData);
  return response.data;
};

export const fetchQuestionnairesApi = async () => {
  try {
    const response = await api.get('/alumni/questionnaires');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch questionnaires');
  }
};

export const fetchFeedbacksApi = async () => {
  const response = await api.get('/alumni/feedback');
  return response.data;
};

export const fetchAlumniProfileApi = async () => {
  const response = await api.get('/alumni/profile');
  return response.data;
};

export const updateAlumniProfileApi = async (profileData) => {
  const response = await api.put('/alumni/profile', profileData);
  return response.data;
};

export const fetchAlumniEventsApi = async () => {
  const response = await api.get('/alumni/events');
  return response.data;
};

export const registerForEventApi = async (eventId) => {
  const response = await api.post(`/alumni/events/${eventId}/register`);
  return response.data;
};

export const fetchChatUsersApi = async () => {
  const response = await api.get('/alumni/chat/users');
  return response.data;
};

export const fetchChatsApi = async () => {
  const response = await api.get('/alumni/chat');
  return response.data;
};

export const sendMessageApi = async (messageData) => {
  const response = await api.post('/alumni/chat', messageData);
  return response.data;
};

export const initializeSocket = (userId, dispatch) => {
  const socket = new WebSocket(`ws://localhost:5000`);
  
  socket.onopen = () => {
    console.log('WebSocket connected for alumni');
    socket.send(JSON.stringify({
      type: 'join',
      userId
    }));
  };
  
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'receiveMessage') {
        import('../../redux/slices/alumniSlice').then(({ receiveMessage }) => {
          dispatch(receiveMessage(data.message));
        });
      }
    } catch (err) {
      console.error('Error parsing WebSocket message:', err);
    }
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  socket.onclose = () => {
    console.log('WebSocket disconnected for alumni');
  };
  
  return socket;
};