import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PostsState, Post } from '../types';

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  },
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state: PostsState, action: PayloadAction<Post[]>) => {
      state.posts = action.payload;
    },
    addPost: (state: PostsState, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },
    deletePost: (state: PostsState, action: PayloadAction<string>) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
    updatePost: (state: PostsState, action: PayloadAction<Post>) => {
      const index = state.posts.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    setPagination: (state: PostsState, action: PayloadAction<any>) => {
      state.pagination = action.payload;
    },
    setLoading: (state: PostsState, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state: PostsState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPosts,
  addPost,
  deletePost,
  updatePost,
  setPagination,
  setLoading,
  setError,
} = postsSlice.actions;

export default postsSlice.reducer;
