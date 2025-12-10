'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks/useRedux';

interface ExplorePost {
  id: string;
  title: string;
  image: string;
  likes: number;
  comments: number;
}

export default function ExplorePage() {
  const { user } = useAppSelector(state => state.auth);
  const [explorePosts, setExplorePosts] = useState<ExplorePost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch explore posts from API
    setExplorePosts([
      { id: '1', title: 'Beautiful Sunset', image: '🌅', likes: 245, comments: 12 },
      { id: '2', title: 'Mountain Adventure', image: '⛰️', likes: 189, comments: 8 },
      { id: '3', title: 'City Lights', image: '🌃', likes: 567, comments: 42 },
      { id: '4', title: 'Beach Day', image: '🏖️', likes: 432, comments: 28 },
      { id: '5', title: 'Forest Walk', image: '🌲', likes: 321, comments: 15 },
      { id: '6', title: 'Night Sky', image: '🌌', likes: 678, comments: 51 },
    ]);
    setLoading(false);
  }, []);

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
        className="max-w-6xl mx-auto"
      >
        {/* Header with Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore</h1>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search posts, users, hashtags..."
              className="w-full px-4 py-3 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full"
            />
          </div>
        ) : explorePosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-2">🔍 No posts found</p>
            <p className="text-gray-500">Try searching for something else</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {explorePosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 0.98 }}
                className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
              >
                {/* Post Image/Content */}
                <div className="w-full h-full flex items-center justify-center text-7xl bg-gradient-to-br from-gray-100 to-gray-200">
                  {post.image}
                </div>

                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center gap-8 transition"
                >
                  <div className="text-center">
                    <p className="text-white text-3xl font-bold">{post.likes}</p>
                    <p className="text-white/80 text-sm">❤️ Likes</p>
                  </div>
                  <div className="text-center">
                    <p className="text-white text-3xl font-bold">{post.comments}</p>
                    <p className="text-white/80 text-sm">💬 Comments</p>
                  </div>
                </motion.div>

                {/* Post Info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                  <p className="text-white font-semibold truncate">{post.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
