'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PostResponse } from '@/store/types';
import Image from 'next/image';

interface PostCardProps {
  post: PostResponse;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onComment?: (postId: string) => void;
  currentUserId?: string;
  isLoading?: boolean;
}

export function PostCard({
  post,
  onLike,
  onDelete,
  onComment,
  currentUserId,
  isLoading = false,
}: PostCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffSeconds = Math.floor(diffTime / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSeconds < 60) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return '1d ago';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}m ago`;
  };

  const isOwner = currentUserId === post.user.id;

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    onLike?.(post.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white"
    >
      {/* Header - Instagram Style */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.1 }} className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
            {post.user.username[0].toUpperCase()}
          </motion.div>
          <div>
            <Link
              href={`/profile/${post.user.id}`}
              className="font-semibold text-sm text-gray-900 hover:text-gray-700"
            >
              {post.user.username}
            </Link>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>

        {/* Actions Menu */}
        {isOwner && (
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.2 }}
              onClick={() => setShowActions(!showActions)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ⋮
            </motion.button>
            {showActions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <button
                  onClick={() => onDelete?.(post.id)}
                  disabled={isLoading}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Image/Video Content */}
      {post.media_url && (
        <div className="bg-black relative w-full">
          {post.content_type === 'video' ? (
            <video
              src={post.media_url}
              controls
              className="w-full h-auto max-h-96"
            />
          ) : (
            <Image
              src={post.media_url}
              alt={post.title || 'Post image'}
              width={500}
              height={500}
              className="w-full h-auto max-h-96 object-cover"
            />
          )}
        </div>
      )}

      {/* Actions Bar */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLike}
              className="text-xl hover:opacity-70 transition"
            >
              {liked ? '❤️' : '🤍'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              onClick={() => setShowComments(!showComments)}
              className="text-xl hover:opacity-70 transition"
            >
              💬
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              className="text-xl hover:opacity-70 transition"
            >
              📤
            </motion.button>
          </div>
          <motion.button
            whileHover={{ scale: 1.2 }}
            className="text-xl hover:opacity-70 transition"
          >
            🔖
          </motion.button>
        </div>

        {/* Likes Count */}
        <p className="text-sm font-semibold text-gray-900 mb-3">
          {likes > 0 && (
            <>
              <span className="font-bold">{likes}</span> {likes === 1 ? 'like' : 'likes'}
            </>
          )}
        </p>
      </div>

      {/* Caption and Comments */}
      <div className="px-4 py-3">
        {(post.title || post.description) && (
          <div className="mb-3">
            <p className="text-sm">
              <span className="font-semibold text-gray-900">{post.user.username}</span>{' '}
              <span className="text-gray-900">
                {post.title || post.description}
              </span>
            </p>
          </div>
        )}

        {/* Comments Section */}
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-3 space-y-2"
          >
            <div className="text-xs text-gray-500 cursor-pointer hover:text-gray-700">
              View all comments
            </div>
          </motion.div>
        )}
      </div>

      {/* Comment Input */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm bg-transparent outline-none text-gray-900 placeholder-gray-500"
          />
          <button className="text-blue-500 font-semibold text-sm hover:text-blue-600">
            Post
          </button>
        </div>
      </div>
    </motion.div>
  );
}
