'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

export default function Home() {
  const { isAuthenticated } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Instagram Style */}
      <div className="grid lg:grid-cols-2 min-h-screen">
        {/* Left Side - Logo & Text */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 p-8 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          <motion.div
            className="relative z-10 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.h1
              className="text-6xl font-bold text-white mb-4 italic font-serif"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              SocialHub
            </motion.h1>
            <p className="text-white text-lg font-light mb-8 max-w-md">
              Share moments. Connect with friends. Inspire the world.
            </p>
            <div className="space-y-2 text-white text-sm">
              <p>📸 Share your photos and videos</p>
              <p>❤️ Like and comment on posts</p>
              <p>👥 Follow friends and discover content</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Side - Form Section */}
        <motion.div
          className="flex items-center justify-center p-8 bg-white"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <motion.div variants={itemVariants} className="lg:hidden text-center mb-8">
              <h1 className="text-4xl font-bold italic font-serif mb-2">SocialHub</h1>
              <p className="text-gray-600 text-sm">Share moments. Connect with friends.</p>
            </motion.div>

            {isAuthenticated ? (
              <motion.div
                variants={containerVariants}
                className="text-center space-y-6"
              >
                <motion.div variants={itemVariants}>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome Back!</h2>
                  <p className="text-gray-600">Ready to explore amazing content?</p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-3">
                  <Link
                    href="/posts"
                    className="block w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    📰 Go to Feed
                  </Link>
                  <Link
                    href="/posts/create"
                    className="block w-full bg-gray-100 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    ➕ Create Post
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              <motion.form variants={containerVariants} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full px-4 py-3 bg-gray-100 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <p className="text-xs text-gray-600 px-4 py-3 text-center">
                    People who use our service may have uploaded your contact information to SocialHub.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants} className="space-y-2">
                  <Link
                    href="/auth/signup"
                    className="block w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-2 rounded-lg font-semibold text-sm hover:shadow-lg transition-shadow text-center"
                  >
                    Sign Up with Email
                  </Link>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition">
                    Log in with Facebook
                  </button>
                </motion.div>

                <motion.div variants={itemVariants} className="text-center">
                  <p className="text-sm text-gray-600">
                    Have an account?{' '}
                    <Link href="/auth/login" className="font-semibold text-pink-600 hover:text-pink-700">
                      Log in
                    </Link>
                  </p>
                </motion.div>
              </motion.form>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Info Section */}
      {!isAuthenticated && (
        <motion.div
          className="bg-white border-t border-gray-200 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="max-w-md mx-auto text-center">
            <p className="text-xs text-gray-500 mb-4">
              By signing up, you agree to our Terms, Data Policy and Cookies Policy. You may receive SMS Notifications from us and can opt out anytime.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
