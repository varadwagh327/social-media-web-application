import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  getUserPosts,
  updatePost,
  deletePost,
  likePost,
  searchPosts,
  getTrendingPosts,
  addComment,
  getComments,
} from '../controller/postController.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';
import { uploadLimiter, apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/', apiLimiter, optionalAuth, getAllPosts);
router.get('/search', searchPosts);
router.get('/trending', getTrendingPosts);
router.get('/:postId', optionalAuth, getPostById);
router.get('/user/:userId', getUserPosts);

router.post('/', authenticate, uploadLimiter, createPost);
router.put('/:postId', authenticate, updatePost);
router.delete('/:postId', authenticate, deletePost);

router.post('/:postId/like', authenticate, apiLimiter, likePost);

router.post('/:postId/comments', authenticate, addComment);
router.get('/:postId/comments', getComments);

export default router;
