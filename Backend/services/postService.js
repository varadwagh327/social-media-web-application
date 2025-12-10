import Post from '../models/postSchema.js';
import Comment from '../models/commentSchema.js';
import User from '../models/userSchema.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';
import slugify from 'slugify';

/**
 * Post Service
 * Handles all post-related business logic
 */
export class PostService {
  /**
   * Create a new post
   */
  static async createPost(postData, userId) {
    const { title, description, content, contentType, tags, visibility, media } = postData;

    // Generate slug
    let slug = slugify(title, { lower: true, strict: true });
    let existingPost = await Post.findOne({ slug });
    if (existingPost) {
      slug = `${slug}-${Date.now()}`;
    }

    const post = new Post({
      author: userId,
      title,
      description,
      content,
      contentType: contentType || 'text',
      tags: tags || [],
      visibility: visibility || 'public',
      slug,
      media: media || [],
    });

    await post.save();
    await post.populate('author', 'username fullName profilePicture');

    // Update user's posts count
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    return post;
  }

  /**
   * Get post by ID
   */
  static async getPostById(postId) {
    const post = await Post.findById(postId)
      .populate('author', 'username fullName profilePicture bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName profilePicture',
        },
      });

    if (!post || post.isDeleted) {
      throw new ErrorHandler('Post not found', 404);
    }

    return post;
  }

  /**
   * Get all posts with pagination
   */
  static async getAllPosts(page = 1, limit = 20, userId = null) {
    const skip = (page - 1) * limit;

    // Build query
    let query = { isDeleted: false };

    // If user is authenticated, show public posts + user's private posts
    if (userId) {
      query = {
        $and: [
          { isDeleted: false },
          {
            $or: [
              { visibility: 'public' },
              { author: userId },
              { visibility: 'friends' }, // Simplified - in production, check actual friends list
            ],
          },
        ],
      };
    } else {
      query.visibility = 'public';
    }

    const posts = await Post.find(query)
      .populate('author', 'username fullName profilePicture bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments(query);

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Get user's posts
   */
  static async getUserPosts(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      author: userId,
      isDeleted: false,
    })
      .populate('author', 'username fullName profilePicture bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      author: userId,
      isDeleted: false,
    });

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }

  /**
   * Update post
   */
  static async updatePost(postId, userId, updateData) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new ErrorHandler('Post not found', 404);
    }

    // Check authorization
    if (post.author.toString() !== userId.toString()) {
      throw new ErrorHandler('Not authorized to update this post', 403);
    }

    // Update fields
    if (updateData.title) {
      post.title = updateData.title;
      post.slug = slugify(updateData.title, { lower: true, strict: true });
    }
    if (updateData.description) post.description = updateData.description;
    if (updateData.content) post.content = updateData.content;
    if (updateData.tags) post.tags = updateData.tags;
    if (updateData.visibility) post.visibility = updateData.visibility;

    post.isEdited = true;
    post.editedAt = new Date();

    await post.save();
    await post.populate('author', 'username fullName profilePicture');

    return post;
  }

  /**
   * Delete post
   */
  static async deletePost(postId, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new ErrorHandler('Post not found', 404);
    }

    // Check authorization
    if (post.author.toString() !== userId.toString()) {
      throw new ErrorHandler('Not authorized to delete this post', 403);
    }

    // Soft delete
    post.isDeleted = true;
    await post.save();

    // Update user's posts count
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: -1 } });

    return { success: true, message: 'Post deleted successfully' };
  }

  /**
   * Like a post
   */
  static async likePost(postId, userId) {
    const post = await Post.findById(postId);

    if (!post || post.isDeleted) {
      throw new ErrorHandler('Post not found', 404);
    }

    const userIdStr = userId.toString();
    const isLiked = post.likes.some((id) => id.toString() === userIdStr);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userIdStr);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.likes.push(userId);
      post.likesCount += 1;
    }

    await post.save();

    return {
      success: true,
      isLiked: !isLiked,
      likesCount: post.likesCount,
    };
  }

  /**
   * Search posts
   */
  static async searchPosts(searchTerm, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const posts = await Post.find({
      $and: [
        { isDeleted: false },
        { visibility: 'public' },
        {
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { content: { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } },
          ],
        },
      ],
    })
      .populate('author', 'username fullName profilePicture bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({
      $and: [
        { isDeleted: false },
        { visibility: 'public' },
        {
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { content: { $regex: searchTerm, $options: 'i' } },
          ],
        },
      ],
    });

    return {
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }

  /**
   * Get trending posts
   */
  static async getTrendingPosts(limit = 10) {
    const posts = await Post.find({
      isDeleted: false,
      visibility: 'public',
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Last 7 days
    })
      .populate('author', 'username fullName profilePicture bio')
      .sort({ likesCount: -1, commentsCount: -1 })
      .limit(limit);

    return posts;
  }
}

export default PostService;
