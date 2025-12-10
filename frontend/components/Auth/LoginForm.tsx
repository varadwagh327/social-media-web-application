'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function LoginForm() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setLocalError('Email and password are required');
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      if (result && result.user) {
        router.push('/posts');
      }
    } catch (err: any) {
      setLocalError(err.message || 'Login failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full p-10 rounded-2xl bg-white/40 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                 border border-white/50 space-y-8"
    >
      {/* Logo */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 drop-shadow-sm">
          SocialHub
        </h1>
        <p className="text-sm text-gray-600">Welcome back 👋</p>
      </div>

      {/* Error */}
      {(localError || error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-700 text-sm shadow-sm"
        >
          {localError || error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-gray-100 shadow-inner p-[3px]"
        >
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 outline-none 
                       focus:ring-2 focus:ring-pink-500"
          />
        </motion.div>

        {/* Password Input */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-xl bg-gray-100 shadow-inner p-[3px]"
        >
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl bg-gray-50 outline-none 
                       focus:ring-2 focus:ring-pink-500"
          />
        </motion.div>

        {/* Forgot Password */}
        <div className="flex justify-end -mt-1">
          <Link
            href="#"
            className="text-sm text-pink-600 hover:underline hover:text-pink-700"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 
                     text-white font-semibold text-lg shadow-[0_4px_14px_rgba(255,0,90,0.4)]
                     disabled:opacity-50"
        >
          {loading ? 'Logging in…' : 'Log in'}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-2">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-gray-500 text-sm">OR</span>
        <div className="flex-1 h-ppx bg-gray-300"></div>
      </div>

      {/* Signup */}
      <p className="text-center text-gray-700 text-sm">
        Don’t have an account?{' '}
        <Link href="/auth/signup" className="font-semibold text-purple-800 hover:text-purple-600">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
