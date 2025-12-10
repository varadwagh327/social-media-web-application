import express from 'express';
import {
  getUserProfile,
  getCurrentUserProfile,
  updateProfile,
  followUser,
  getFollowers,
  getFollowing,
  searchUsers,
  getSuggestedUsers,
  deactivateAccount,
} from '../controller/userController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();


router.get('/search', apiLimiter, searchUsers);
router.get('/:userId', getUserProfile);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

router.get('/profile/me', authenticate, getCurrentUserProfile);
router.put('/profile/me', authenticate, updateProfile);
router.post('/:userId/follow', authenticate, followUser);
router.get('/suggestions', authenticate, getSuggestedUsers);
router.post('/deactivate', authenticate, deactivateAccount);

export default router;
