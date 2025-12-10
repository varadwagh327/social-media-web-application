'use client';

import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { motion } from 'framer-motion';

export function AuthToggle() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {isLogin ? (
        <>
          <LoginForm />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center text-sm text-gray-600"
          >
            Don't have an account?{' '}
            <button
              onClick={() => setIsLogin(false)}
              className="font-semibold text-pink-600 hover:text-pink-700 cursor-pointer"
            >
              Sign up
            </button>
          </motion.div>
        </>
      ) : (
        <>
          <SignupForm />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-center text-sm text-gray-600"
          >
            Have an account?{' '}
            <button
              onClick={() => setIsLogin(true)}
              className="font-semibold text-pink-600 hover:text-pink-700 cursor-pointer"
            >
              Log in
            </button>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
