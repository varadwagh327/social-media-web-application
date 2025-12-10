import { catchAsyncErrors } from '../middlewares/catchAsyncErrors.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';
import PostService from '../services/postService.js';
import Comment from '../models/commentSchema.js';
import { createPostSchema, updatePostSchema, paginationSchema, commentSchema } from '../schemas/postSchema.js';

export const createPost = catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = createPostSchema.validate(req.body);

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const post = await PostService.createPost(value, req.user._id);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Post created successfully',
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getAllPosts = catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = paginationSchema.validate(req.query);

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const { page, limit } = value;
    const userId = req.user ? req.user._id : null;

    const result = await PostService.getAllPosts(page, limit, userId);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Posts retrieved successfully',
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

export const getPostById = catchAsyncErrors(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await PostService.getPostById(postId);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Post retrieved successfully',
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getUserPosts = catchAsyncErrors(async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const result = await PostService.getUserPosts(userId, parseInt(page), parseInt(limit));

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'User posts retrieved',
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

export const updatePost = catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = updatePostSchema.validate(req.body);

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const { postId } = req.params;
    const post = await PostService.updatePost(postId, req.user._id, value);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Post updated successfully',
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const deletePost = catchAsyncErrors(async (req, res, next) => {
  try {
    const { postId } = req.params;
    await PostService.deletePost(postId, req.user._id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export const likePost = catchAsyncErrors(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const result = await PostService.likePost(postId, req.user._id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: result.isLiked ? 'Post liked' : 'Post unliked',
      data: {
        isLiked: result.isLiked,
        likesCount: result.likesCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const searchPosts = catchAsyncErrors(async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return next(new ErrorHandler('Search term is required', 400));
    }

    const result = await PostService.searchPosts(q, parseInt(page), parseInt(limit));

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Search results',
      data: result.posts,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
});

export const getTrendingPosts = catchAsyncErrors(async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const posts = await PostService.getTrendingPosts(parseInt(limit));

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Trending posts retrieved',
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});

export const addComment = catchAsyncErrors(async (req, res, next) => {
  try {
    const { error, value } = commentSchema.validate(req.body);

    if (error) {
      return next(new ErrorHandler(error.details[0].message, 400));
    }

    const { postId } = req.params;
    const comment = new Comment({
      post: postId,
      author: req.user._id,
      content: value.content,
    });

    await comment.save();
    await comment.populate('author', 'username fullName profilePicture');

    const post = await require('../models/postSchema.js').default.findById(postId);
    post.comments.push(comment._id);
    post.commentsCount += 1;
    await post.save();

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Comment added successfully',
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
});

export const getComments = catchAsyncErrors(async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      post: postId,
      isDeleted: false,
    })
      .populate('author', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Comment.countDocuments({
      post: postId,
      isDeleted: false,
    });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Comments retrieved',
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    });
  } catch (error) {
    next(error);
  }
});
