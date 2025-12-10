'use client';

import { useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks/useRedux';
import { setUser } from '@/store/slices/authSlice';

export default function GoogleSignInButton() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadGSI = () => {
      if (typeof window === 'undefined') return;
      // Do not initialize twice
      if (window.google && (window as any).gsiInitialized) return;

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        try {
          const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
          (window as any).gsiInitialized = true;

          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: any) => {
              if (!response || !response.credential) return;
              try {
                const res = await apiClient.post('/auth/google', { idToken: response.credential });
                const payload = res.data.data;
                if (payload) {
                  const { user, accessToken, refreshToken } = payload;
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', refreshToken);
                  }
                  dispatch(setUser(user as any));
                  router.push('/posts');
                }
              } catch (err) {
                console.error('Google sign-in error:', err);
              }
            },
          });

          // Render the Google button inside the container
          window.google.accounts.id.renderButton(
            document.getElementById('google-signin-button'),
            { theme: 'outline', size: 'large', type: 'standard' }
          );
        } catch (err) {
          console.error('GSI init error:', err);
        }
      };
      document.head.appendChild(script);
    };

    loadGSI();
  }, [dispatch, router]);

  return null;
}
