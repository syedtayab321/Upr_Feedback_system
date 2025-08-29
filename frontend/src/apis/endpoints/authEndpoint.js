import api from './../axiosConfig';

// Register user
export const registerUserApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login user
export const loginUserApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Get user profile
export const getProfileApi = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

// Update user profile
export const updateProfileApi = async (userData) => {
  const response = await api.put('/auth/profile', userData);
  return response.data;
};

// Change password
export const changePasswordApi = async (passwordData) => {
  const response = await api.put('/auth/change-password', passwordData);
  return response.data;
};

// Refresh token
export const refreshTokenApi = async () => {
  const response = await api.post('/auth/refresh');
  return response.data;
};

// Forgot password
export const forgotPasswordApi = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPasswordApi = async (token, passwordData) => {
  const response = await api.post(`/auth/reset-password/${token}`, passwordData);
  return response.data;
};

// Verify email
export const verifyEmailApi = async (token) => {
  const response = await api.post(`/auth/verify-email/${token}`);
  return response.data;
};

// Resend verification email
export const resendVerificationApi = async () => {
  const response = await api.post('/auth/resend-verification');
  return response.data;
};

// Logout (client-side only)
export const logoutApi = () => {
  localStorage.removeItem('token');
  return Promise.resolve({ message: 'Logged out successfully' });
};