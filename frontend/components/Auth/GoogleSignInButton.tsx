'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks/useRedux';
import { setUser } from '@/store/slices/authSlice';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement | null, options: any) => void;
        };
      };
    };
    gsiInitialized?: boolean;
  }
}

export default function GoogleSignInButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadGSI = () => {
      if (typeof window === 'undefined') return;
      if (window.google && window.gsiInitialized) return;

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;

      script.onload = () => {
        try {
          const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
          if (!clientId) {
            console.error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
            return;
          }

          if (!window.google) {
            console.error('Google library failed to load');
            return;
          }

          window.gsiInitialized = true;

          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (!response?.credential) return;
              try {
                const res = await apiClient.post('/auth/google', { idToken: response.credential });
                const { user, accessToken, refreshToken } = res.data?.data || {};
                if (user && accessToken && refreshToken) {
                  localStorage.setItem('accessToken', accessToken);
                  localStorage.setItem('refreshToken', refreshToken);
                  dispatch(setUser(user));
                  // Small delay to ensure state is updated before redirect
                  setTimeout(() => {
                    router.push('/posts');
                  }, 100);
                }
              } catch (err: any) {
                console.error('Google sign-in error:', err.message || err);
              }
            },
          });

          const button = document.getElementById('google-signin-button');
          if (button) {
            window.google.accounts.id.renderButton(button, {
              theme: 'outline',
              size: 'large',
              type: 'standard',
            });
          }
        } catch (err) {
          console.error('GSI init error:', err);
        }
      };

      script.onerror = () => console.error('Failed to load Google Sign-In script');
      document.head.appendChild(script);
    };

    loadGSI();
  }, [dispatch, router]);

  return null;
}
