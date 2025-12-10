import User from '../models/userSchema.js';
import { ErrorHandler } from '../middlewares/errorMiddleware.js';

/**
 * User Service
 * Handles user profile management and relationships
 */
export class UserService {
  /**
   * Get user profile
   */
  static async getUserProfile(userId) {
    const user = await User.findById(userId)
      .select('-password -verificationToken -verificationTokenExpiry -passwordResetToken -passwordResetExpiry')
      .populate('followers', 'username fullName profilePicture')
      .populate('following', 'username fullName profilePicture');

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, updateData) {
    const allowedFields = ['fullName', 'bio', 'profilePicture', 'coverImage'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (updateData[field]) {
        updates[field] = updateData[field];
      }
    });

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password -verificationToken -passwordResetToken');

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    return user;
  }

  /**
   * Follow user
   */
  static async followUser(userIdToFollow, currentUserId) {
    if (userIdToFollow === currentUserId.toString()) {
      throw new ErrorHandler('Cannot follow yourself', 400);
    }

    const user = await User.findById(userIdToFollow);
    const currentUser = await User.findById(currentUserId);

    if (!user || !currentUser) {
      throw new ErrorHandler('User not found', 404);
    }

    // Check if already following
    const isFollowing = currentUser.following.includes(userIdToFollow);

    if (isFollowing) {
      // Unfollow
      currentUser.following = currentUser.following.filter((id) => id.toString() !== userIdToFollow);
      currentUser.followingCount = Math.max(0, currentUser.followingCount - 1);

      user.followers = user.followers.filter((id) => id.toString() !== currentUserId.toString());
      user.followersCount = Math.max(0, user.followersCount - 1);
    } else {
      // Follow
      currentUser.following.push(userIdToFollow);
      currentUser.followingCount += 1;

      user.followers.push(currentUserId);
      user.followersCount += 1;
    }

    await currentUser.save();
    await user.save();

    return {
      success: true,
      isFollowing: !isFollowing,
      followersCount: user.followersCount,
      followingCount: currentUser.followingCount,
    };
  }

  /**
   * Get followers
   */
  static async getFollowers(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .select('followers')
      .populate({
        path: 'followers',
        select: 'username fullName profilePicture bio',
        skip,
        limit,
      });

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    return {
      followers: user.followers,
      pagination: {
        currentPage: page,
        totalItems: user.followersCount,
        totalPages: Math.ceil(user.followersCount / limit),
      },
    };
  }

  /**
   * Get following
   */
  static async getFollowing(userId, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const user = await User.findById(userId)
      .select('following')
      .populate({
        path: 'following',
        select: 'username fullName profilePicture bio',
        skip,
        limit,
      });

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    return {
      following: user.following,
      pagination: {
        currentPage: page,
        totalItems: user.followingCount,
        totalPages: Math.ceil(user.followingCount / limit),
      },
    };
  }

  /**
   * Search users
   */
  static async searchUsers(searchTerm, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const users = await User.find({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { fullName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    })
      .select('-password -verificationToken -passwordResetToken')
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments({
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { fullName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } },
      ],
      isActive: true,
    });

    return {
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    };
  }

  /**
   * Get suggested users to follow
   */
  static async getSuggestedUsers(userId, limit = 10) {
    const currentUser = await User.findById(userId).select('following');

    const suggestedUsers = await User.find({
      _id: { $ne: userId, $nin: currentUser.following },
      isActive: true,
    })
      .select('username fullName profilePicture bio followersCount')
      .sort({ followersCount: -1 })
      .limit(limit);

    return suggestedUsers;
  }

  /**
   * Deactivate account
   */
  static async deactivateAccount(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new ErrorHandler('User not found', 404);
    }

    return { success: true, message: 'Account deactivated' };
  }
}

export default UserService;
