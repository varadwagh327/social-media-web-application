'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/hooks/useAuth';
import { createPostAPI } from '@/lib/api/posts';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState<'text' | 'image' | 'video'>('text');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
  const MAX_FILE_SIZE = 100 * 1024 * 1024;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError('');

    if (contentType === 'image' && !ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
      setError('Please upload a valid image (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (contentType === 'video' && !ALLOWED_VIDEO_TYPES.includes(selectedFile.type)) {
      setError('Please upload a valid video (MP4, WebM)');
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Caption is required');
      return;
    }

    if (contentType !== 'text' && !file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content_type', contentType);
      if (file) {
        formData.append('file', file);
      }

      await createPostAPI(formData);
      toast.success('Post created successfully!');
      setTitle('');
      setFile(null);
      setPreview(null);
      setContentType('text');
      setTimeout(() => router.push('/posts'), 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create post';
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <Link
            href="/auth/login"
            className="inline-block bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-2 rounded-lg transition hover:shadow-lg"
          >
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  const contentTypeOptions = [
    { value: 'text' as const, label: '📝 Text', color: 'from-blue-500 to-blue-600' },
    { value: 'image' as const, label: '📸 Photo', color: 'from-pink-500 to-red-500' },
    { value: 'video' as const, label: '🎥 Video', color: 'from-purple-500 to-pink-500' },
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Create post</h1>
            <p className="text-gray-600">Share a moment with your followers</p>
          </div>
          <Link
            href="/posts"
            className="text-pink-500 hover:text-pink-600 font-semibold text-sm"
          >
            ← Back
          </Link>
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-lg shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="p-6 space-y-6">
            {/* Content Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Post type</label>
              <div className="grid grid-cols-3 gap-3">
                {contentTypeOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setContentType(option.value);
                      handleRemoveFile();
                    }}
                    className={`p-3 rounded-lg font-semibold transition border-2 ${
                      contentType === option.value
                        ? `bg-gradient-to-r ${option.color} border-transparent text-white`
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                Caption
              </label>
              <motion.textarea
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                placeholder="What's on your mind?"
                maxLength={2200}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:opacity-50 resize-none transition"
                whileFocus={{ scale: 1.01 }}
              />
              <p className="text-xs text-gray-500 mt-2">{title.length}/2200</p>
            </div>

            {/* File Upload */}
            {contentType !== 'text' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                {!preview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition group"
                  >
                    <motion.div whileHover={{ scale: 1.1 }} className="text-6xl mb-3">
                      {contentType === 'image' ? '📸' : '🎬'}
                    </motion.div>
                    <p className="text-gray-700 font-semibold mb-1">
                      Drag and drop your {contentType}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">or tap to select</p>
                    <p className="text-xs text-gray-500">
                      Max size: {MAX_FILE_SIZE / (1024 * 1024)}MB
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    {contentType === 'image' ? (
                      <div className="relative w-full h-96 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={preview}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                        <video
                          src={preview}
                          controls
                          className="w-full h-96 rounded-lg"
                        />
                      </div>
                    )}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRemoveFile}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-9 h-9 flex items-center justify-center transition shadow-lg"
                    >
                      ✕
                    </motion.button>
                  </motion.div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className="hidden"
                  accept={
                    contentType === 'image'
                      ? ALLOWED_IMAGE_TYPES.join(',')
                      : ALLOWED_VIDEO_TYPES.join(',')
                  }
                />
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-lg hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Publishing...
                </>
              ) : (
                <>
                  <span>📤</span> Share
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}
