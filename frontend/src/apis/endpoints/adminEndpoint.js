import api from './../axiosConfig';

// Users API
export const fetchUsersApi = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch users');
  }
};

export const createUserApi = async (userData) => {
  try {
    const response = await api.post('/admin/users', userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create user');
  }
};

export const updateUserApi = async ({ id, data }) => {
  try {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const deleteUserApi = async (id) => {
  try {
    await api.delete(`/admin/users/${id}`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete user');
  }
};

// Activities API
export const fetchActivitiesApi = async () => {
  try {
    const response = await api.get('/admin/activities');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch activities');
  }
};

// Feedbacks API
export const fetchFeedbacksApi = async () => {
  try {
    const response = await api.get('/admin/feedbacks');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch feedbacks');
  }
};

// Chats API
export const fetchChatsApi = async () => {
  try {
    const response = await api.get('/admin/chats');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch chats');
  }
};

export const moderateChatApi = async (id) => {
  try {
    await api.put(`/admin/chats/${id}/moderate`);
    return id;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to moderate chat');
  }
};

// Reports API
export const generateReportApi = async (params) => {
  try {
    const response = await api.get('/admin/reports/sentiment', { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to generate report');
  }
};

// Questionnaires API
export const fetchQuestionnairesApi = async () => {
  try {
    const response = await api.get('/admin/questionnaires');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch questionnaires');
  }
};

export const createQuestionnaireApi = async (data) => {
  try {
    const response = await api.post('/admin/questionnaires', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create questionnaire');
  }
};

export const updateQuestionnaireApi = async ({ id, data }) => {
  try {
    const response = await api.put(`/admin/questionnaires/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update questionnaire');
  }
};