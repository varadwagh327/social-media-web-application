'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface PostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export function PostForm({ onSubmit, isLoading = false, error }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<'text' | 'image' | 'video'>('text');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setLocalError('');

    // Validate file type
    if (contentType === 'image' && !ALLOWED_IMAGE_TYPES.includes(selectedFile.type)) {
      setLocalError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (contentType === 'video' && !ALLOWED_VIDEO_TYPES.includes(selectedFile.type)) {
      setLocalError('Please upload a valid video file (MP4, WebM, MOV)');
      return;
    }

    // Validate file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setLocalError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024):.0f}MB`);
      return;
    }

    setFile(selectedFile);

    // Create preview
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
    setLocalError('');

    // Validate
    if (!title.trim()) {
      setLocalError('Title is required');
      return;
    }

    if (contentType !== 'text' && !file) {
      setLocalError('Please select a file for this content type');
      return;
    }

    // Create FormData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content_type', contentType);
    if (file) {
      formData.append('file', file);
    }

    try {
      await onSubmit(formData);
      // Reset form on success
      setTitle('');
      setDescription('');
      setContentType('text');
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      setLocalError(err.message || 'Failed to create post');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a Post</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {(localError || error) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
          >
            {localError || error}
          </motion.div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setLocalError('');
            }}
            disabled={isLoading}
            placeholder="What's on your mind?"
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/200</p>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            placeholder="Add more details (optional)"
            maxLength={2000}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/2000</p>
        </div>

        {/* Content Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>
          <div className="flex gap-4">
            {(['text', 'image', 'video'] as const).map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="contentType"
                  value={type}
                  checked={contentType === type}
                  onChange={(e) => {
                    setContentType(e.target.value as typeof contentType);
                    handleRemoveFile();
                  }}
                  disabled={isLoading}
                  className="w-4 h-4"
                />
                <span className="text-gray-700 capitalize">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* File Upload */}
        {contentType !== 'text' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {contentType === 'image' ? 'Upload Image' : 'Upload Video'} *
            </label>
            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <p className="text-gray-600">
                  {contentType === 'image'
                    ? 'Click to upload an image (JPEG, PNG, GIF, WebP)'
                    : 'Click to upload a video (MP4, WebM, MOV)'}
                </p>
                <p className="text-xs text-gray-500 mt-2">Max file size: 100MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept={contentType === 'image' ? 'image/*' : 'video/*'}
                  disabled={isLoading}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                {contentType === 'image' && preview && (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                {contentType === 'video' && (
                  <video
                    src={preview}
                    controls
                    className="w-full max-h-64 rounded-lg"
                  />
                )}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                >
                  ✕
                </button>
                <p className="text-xs text-gray-500 mt-2">{file.name}</p>
              </div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Publishing...' : 'Publish Post'}
        </motion.button>
      </form>
    </motion.div>
  );
}
