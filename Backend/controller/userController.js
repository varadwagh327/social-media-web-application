import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';
import UserService from '../services/userService.js';
import { updateProfileSchema } from '../schemas/userSchema.js';

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await UserService.getUserProfile(userId);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User profile retrieved',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getCurrentUserProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await UserService.getUserProfile(req.user._id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Current user profile retrieved',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body);

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const user = await UserService.updateProfile(req.user._id, value);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Profile updated successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const followUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const result = await UserService.followUser(userId, req.user._id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: result.isFollowing ? 'User followed' : 'User unfollowed',
      data: {
        isFollowing: result.isFollowing,
        followersCount: result.followersCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getFollowers = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await UserService.getFollowers(userId, parseInt(page), parseInt(limit));

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Followers retrieved',
      data: result.followers,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

export const getFollowing = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await UserService.getFollowing(userId, parseInt(page), parseInt(limit));

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Following retrieved',
      data: result.following,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

export const searchUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return next(new ErrorHandler('Search term is required', 400));
    }

    const result = await UserService.searchUsers(q, parseInt(page), parseInt(limit));

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Search results',
      data: result.users,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

export const getSuggestedUsers = catchAsyncErrors(async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const users = await UserService.getSuggestedUsers(req.user._id, parseInt(limit));

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Suggested users retrieved',
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

export const deactivateAccount = catchAsyncErrors(async (req, res, next) => {
  try {
    const result = await UserService.deactivateAccount(req.user._id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
});
