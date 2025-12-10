import { apiClient } from './client';
import { Post } from '@/store/types';

export const fetchPostsAPI = async (page: number = 1, limit: number = 20) => {
  const response = await apiClient.get(`/?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const fetchPostAPI = async (postId: string) => {
  const response = await apiClient.get(`/${postId}`);
  return response.data.data;
};

export const createPostAPI = async (formData: FormData) => {
  const response = await apiClient.post('/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.data;
};

export const updatePostAPI = async (postId: string, data: Partial<Post>) => {
  const response = await apiClient.put(`/${postId}`, data);
  return response.data.data;
};

export const deletePostAPI = async (postId: string) => {
  const response = await apiClient.delete(`/${postId}`);
  return response.data;
};

export const likePostAPI = async (postId: string) => {
  const response = await apiClient.post(`/${postId}/like`);
  return response.data.data;
};

export const searchPostsAPI = async (query: string, page: number = 1) => {
  const response = await apiClient.get(`/search?q=${query}&page=${page}&limit=20`);
  return response.data.data;
};

export const getTrendingPostsAPI = async (page: number = 1) => {
  const response = await apiClient.get(`/trending?page=${page}&limit=20`);
  return response.data.data;
};

export const addCommentAPI = async (postId: string, content: string) => {
  const response = await apiClient.post(`/${postId}/comments`, { content });
  return response.data.data;
};

export const getCommentsAPI = async (postId: string, page: number = 1) => {
  const response = await apiClient.get(`/${postId}/comments?page=${page}&limit=20`);
  return response.data.data;
};

export const getUserPostsAPI = async (userId: string, page: number = 1) => {
  const response = await apiClient.get(`/user/${userId}?page=${page}&limit=20`);
  return response.data.data;
};
