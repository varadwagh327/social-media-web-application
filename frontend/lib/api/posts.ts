import { apiClient } from './client';
import { Post } from '@/store/types';

const POSTS_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1/posts';

export const fetchPostsAPI = async (page: number = 1, limit: number = 20) => {
  const response = await apiClient.get(`/posts?page=${page}&limit=${limit}`);
  return response.data.data;
};

export const fetchPostAPI = async (postId: string) => {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data.data;
};

export const createPostAPI = async (formData: FormData) => {
  const response = await apiClient.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updatePostAPI = async (postId: string, data: Partial<Post>) => {
  const response = await apiClient.put(`/posts/${postId}`, data);
  return response.data.data;
};

export const deletePostAPI = async (postId: string) => {
  const response = await apiClient.delete(`/posts/${postId}`);
  return response.data;
};

export const likePostAPI = async (postId: string) => {
  const response = await apiClient.post(`/posts/${postId}/like`);
  return response.data.data;
};

export const searchPostsAPI = async (query: string, page: number = 1) => {
  const response = await apiClient.get(`/posts/search?q=${query}&page=${page}&limit=20`);
  return response.data.data;
};

export const getTrendingPostsAPI = async (page: number = 1) => {
  const response = await apiClient.get(`/posts/trending?page=${page}&limit=20`);
  return response.data.data;
};

export const addCommentAPI = async (postId: string, content: string) => {
  const response = await apiClient.post(`/posts/${postId}/comments`, { content });
  return response.data.data;
};

export const getCommentsAPI = async (postId: string, page: number = 1) => {
  const response = await apiClient.get(`/posts/${postId}/comments?page=${page}&limit=20`);
  return response.data.data;
};

export const getUserPostsAPI = async (userId: string, page: number = 1) => {
  const response = await apiClient.get(`/posts/user/${userId}?page=${page}&limit=20`);
  return response.data.data;
};
