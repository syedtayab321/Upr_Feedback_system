import api from './../axiosConfig';

// Feedback API
export const submitFeedbackApi = async (feedbackData) => {
  try {
    const response = await api.post('/alumni/feedback', feedbackData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to submit feedback');
  }
};

export const fetchFeedbacksApi = async () => {
  try {
    const response = await api.get('/alumni/feedback');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch feedbacks');
  }
};

// Additional alumni endpoints can be added here as needed
export const fetchAlumniProfileApi = async () => {
  try {
    const response = await api.get('/alumni/profile');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch alumni profile');
  }
};

export const updateAlumniProfileApi = async (profileData) => {
  try {
    const response = await api.put('/alumni/profile', profileData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update alumni profile');
  }
};

export const fetchAlumniEventsApi = async () => {
  try {
    const response = await api.get('/alumni/events');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch alumni events');
  }
};

export const registerForEventApi = async (eventId) => {
  try {
    const response = await api.post(`/alumni/events/${eventId}/register`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to register for event');
  }
};