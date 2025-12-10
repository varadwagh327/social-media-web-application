'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/hooks/useRedux';
import { setUser } from '@/store/slices/authSlice';
import { getCurrentUserAPI } from '@/lib/api/auth';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const init = async () => {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const user = await getCurrentUserAPI();
        if (user) {
          dispatch(setUser(user));
        }
      } catch (err) {
        // if token invalid, clear local storage
        console.warn('Auth init failed:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    };

    init();
  }, [dispatch]);

  return null;
}
