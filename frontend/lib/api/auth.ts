import { apiClient } from './client';
import { User, ApiResponse } from '@/store/types';

export const signupAPI = async (userData: {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}) => {
  const response = await apiClient.post('/auth/signup', userData);
  return response.data.data;
};

export const loginAPI = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data.data;
};

export const refreshTokenAPI = async (refreshToken: string) => {
  const response = await apiClient.post('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return response.data.data;
};

export const logoutAPI = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const getCurrentUserAPI = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  return response.data.data;
};

export const forgotPasswordAPI = async (email: string) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPasswordAPI = async (token: string, password: string) => {
  const response = await apiClient.post('/auth/reset-password', { token, password });
  return response.data;
};
