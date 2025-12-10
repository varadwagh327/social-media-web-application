'use client';

import { useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useRedux';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function UserProfilePage() {
  const { user } = useAppSelector(state => state.auth);
  const [userPosts] = useState([]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <Link href="/auth/login" className="text-pink-500 hover:text-pink-600 font-semibold">
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Profile Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="border-b border-gray-200 pb-8 mb-8"
        >
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-5xl font-bold text-white shadow-lg flex-shrink-0"
            >
              {user.username?.[0]?.toUpperCase()}
            </motion.div>

            {/* Profile Details */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {user.fullName || user.username}
              </h1>
              <p className="text-gray-600 mb-4">@{user.username}</p>
              
              {user.bio && (
                <p className="text-gray-700 mb-4">{user.bio}</p>
              )}

              {/* Stats */}
              <div className="flex gap-8 justify-center sm:justify-start mb-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userPosts.length}</p>
                  <p className="text-sm text-gray-600">posts</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">followers</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                  <p className="text-sm text-gray-600">following</p>
                </div>
              </div>

              {/* Role Badge */}
              {user.role && user.role !== 'user' && (
                <div className="inline-block">
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    user.role === 'admin'
                      ? 'bg-purple-100 text-purple-700'
                      : user.role === 'moderator'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center sm:justify-start flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/settings"
                className="px-8 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-lg transition"
              >
                Edit profile
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/posts/create"
                className="px-8 py-2 bg-gradient-to-r from-pink-500 to-red-500 hover:shadow-lg text-white font-semibold rounded-lg transition"
              >
                📸 New post
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* User Posts Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Posts</h2>
          {userPosts.length === 0 ? (
            <div className="text-center text-gray-600 py-16">
              <p className="text-xl mb-4">📝 No posts yet</p>
              <p className="text-gray-500 mb-6">Share your first photo or video</p>
              <Link
                href="/posts/create"
                className="inline-block px-8 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg transition hover:shadow-lg"
              >
                Create post
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {userPosts.map((post: any) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 0.98 }}
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.caption}
                      className="w-full h-full object-cover hover:opacity-80 transition"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
