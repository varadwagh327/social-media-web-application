'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useRedux';
import { usePosts } from '@/lib/hooks/usePosts';
import { PostCard } from '@/components/Posts/PostCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PostsPage() {
  const { user } = useAppSelector(state => state.auth);
  const { posts, pagination, loading, error } = useAppSelector(state => state.posts);
  const { fetchPosts } = usePosts();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Initial load
  useEffect(() => {
    fetchPosts(1, 20);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && pagination?.hasNext) {
          const nextPage = (page || 1) + 1;
          setPage(nextPage);
          fetchPosts(nextPage, 20);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loading, page, pagination?.hasNext, fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    try {
      // Call like API
    } catch (err) {
      console.error('Error liking post:', err);
    }
  }, []);

  const handleDelete = useCallback(async (postId: string) => {
    try {
      // Call delete API
    } catch (err) {
      console.error('Error deleting post:', err);
    }
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
        className="max-w-2xl mx-auto"
      >
        {/* Stories Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 pb-8 border-b border-gray-200"
        >
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
            {/* Create Story Button */}
            <Link
              href="/stories/create"
              className="flex-shrink-0 w-16 h-24 rounded-lg bg-gradient-to-br from-pink-400 to-red-400 flex flex-col items-center justify-center text-center text-white font-semibold text-xs hover:opacity-80 transition"
            >
              <span className="text-xl mb-1">➕</span>
              Your story
            </Link>

            {/* Story Examples */}
            {[1].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="flex-shrink-0 w-16 h-24 rounded-lg bg-gradient-to-br from-blue-300 to-purple-400 cursor-pointer border-2 border-gray-200 flex items-center justify-center text-2xl hover:border-pink-500 transition"
              >
                👤
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            {error}
          </motion.div>
        )}

        {/* Posts List */}
        {posts && posts.length > 0 ? (
          <motion.div className="space-y-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard
                  post={post}
                  currentUserId={user?.id || ''}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-500">Loading posts...</p>
              </>
            ) : (
              <>
                <p className="text-gray-500 mb-4 text-lg">📝 No posts yet</p>
                <p className="text-gray-400 mb-6">Follow people or create a post to get started</p>
                <Link
                  href="/posts/create"
                  className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
                >
                  Create Post
                </Link>
              </>
            )}
          </motion.div>
        )}

        {/* Infinite Scroll Sentinel */}
        <div ref={sentinelRef} className="py-8" />

        {/* End of Feed */}
        {!hasMore && posts && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <p>You've reached the end of your feed</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
