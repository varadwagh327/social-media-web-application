import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Create directory if it doesn't exist
 */
export const createDirectoryIfNotExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Delete file if exists
 */
export const deleteFileIfExists = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error deleting file: ${error.message}`);
    return false;
  }
};

/**
 * Generate unique filename
 */
export const generateUniqueFilename = (originalFilename) => {
  const ext = path.extname(originalFilename);
  const name = path.basename(originalFilename, ext);
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${name}-${timestamp}-${random}${ext}`;
};

/**
 * Format file size (bytes to human readable)
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Validate file extension
 */
export const isValidFileExtension = (filename, allowedExtensions) => {
  const ext = path.extname(filename).toLowerCase();
  return allowedExtensions.includes(ext);
};

/**
 * Validate file size
 */
export const isValidFileSize = (fileSize, maxSize) => {
  return fileSize <= maxSize;
};

/**
 * Get MIME type from extension
 */
export const getMimeType = (ext) => {
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mov': 'video/quicktime',
    '.avi': 'video/x-msvideo',
  };
  return mimeTypes[ext.toLowerCase()] || 'application/octet-stream';
};

/**
 * Check if file is image
 */
export const isImageFile = (filename) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
};

/**
 * Check if file is video
 */
export const isVideoFile = (filename) => {
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi', '.mkv'];
  const ext = path.extname(filename).toLowerCase();
  return videoExtensions.includes(ext);
};

export default {
  createDirectoryIfNotExists,
  deleteFileIfExists,
  generateUniqueFilename,
  formatFileSize,
  isValidFileExtension,
  isValidFileSize,
  getMimeType,
  isImageFile,
  isVideoFile,
};
