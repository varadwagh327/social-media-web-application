'use client';

import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { loginAPI, signupAPI, logoutAPI } from '@/lib/api/auth';
import { login, signup, logout } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { UseAuthReturn } from '@/store/types';

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useAppSelector((state: RootState) => state.auth.loading);
  const error = useAppSelector((state: RootState) => state.auth.error);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const result = await dispatch(login({ email, password }));
      return result.payload;
    },
    [dispatch]
  );

  const handleSignup = useCallback(
    async (userData: any) => {
      const result = await dispatch(signup(userData));
      return result.payload;
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    if (user) {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          await logoutAPI(token);
        }
      } catch (err) {
        console.error('Logout API error:', err);
      }
    }
    dispatch(logout());
  }, [dispatch, user]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};
