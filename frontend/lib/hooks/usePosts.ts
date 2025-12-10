'use client';

import { useAppDispatch, useAppSelector } from './useRedux';
import { useCallback, useEffect } from 'react';
import { fetchPostsAPI } from '@/lib/api/posts';
import { setPosts, setLoading, setError, setPagination } from '@/store/slices/postsSlice';
import { RootState } from '@/store/store';
import { UsePostsReturn } from '@/store/types';

export const usePosts = (): UsePostsReturn => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state: RootState) => state.posts.posts);
  const loading = useAppSelector((state: RootState) => state.posts.loading);
  const error = useAppSelector((state: RootState) => state.posts.error);
  const pagination = useAppSelector((state: RootState) => state.posts.pagination);

  const fetchPosts = useCallback(
    async (page: number = 1, limit: number = 20) => {
      try {
        dispatch(setLoading(true));
        const data = await fetchPostsAPI(page, limit);
        dispatch(setPosts(data.posts));
        dispatch(setPagination(data.pagination));
        dispatch(setError(null));
      } catch (err: any) {
        dispatch(setError(err.message || 'Failed to fetch posts'));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch]
  );

  return {
    posts,
    loading,
    error,
    pagination,
    fetchPosts,
  };
};
