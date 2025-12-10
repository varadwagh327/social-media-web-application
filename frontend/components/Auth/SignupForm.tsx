'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function SignupForm() {
  const router = useRouter();
  const { signup, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setLocalError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setLocalError('All fields are required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setLocalError(passwordError);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      await signup({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      router.push('/posts');
    } catch (err: any) {
      setLocalError(err.message || 'Signup failed');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-4"
    >
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold italic font-serif text-gray-900 mb-1">SocialHub</h1>
        <p className="text-sm text-gray-600">Sign up to see photos and videos from your friends</p>
      </div>

      {/* Error Message */}
      {(localError || error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {localError || error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Email */}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={loading}
          placeholder="Email address"
          className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50 transition-all"
        />

        {/* Username */}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          disabled={loading}
          placeholder="Username"
          className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50 transition-all"
        />

        {/* Password */}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={loading}
          placeholder="Password"
          className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50 transition-all"
        />

        {/* Confirm Password */}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={loading}
          placeholder="Confirm password"
          className="w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:bg-gray-50 transition-all"
        />

        {/* Password Requirements */}
        <div className="text-xs text-gray-700 bg-blue-50 border border-blue-200 p-3 rounded-lg">
          <p className="font-semibold mb-2 text-blue-900">Password must contain:</p>
          <ul className="space-y-1 text-blue-800">
            <li>✓ At least 8 characters</li>
            <li>✓ One uppercase letter</li>
            <li>✓ One number</li>
            <li>✓ One special character (!@#$%^&*)</li>
          </ul>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:shadow-lg text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing up...' : 'Sign up'}
        </motion.button>
      </form>

      {/* Terms */}
      <p className="text-xs text-gray-600 text-center">
        By signing up, you agree to our <span className="font-semibold">Terms</span>, <span className="font-semibold">Data Policy</span> and <span className="font-semibold">Cookies Policy</span>.
      </p>

      {/* Login Link */}
      <p className="text-center text-gray-600 text-sm">
        Have an account?{' '}
        <Link href="/auth/login" className="font-semibold text-gray-900 hover:text-gray-700">
          Log in
        </Link>
      </p>
    </motion.div>
  );
}
