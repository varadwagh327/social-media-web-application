import express from 'express';
import { authenticate } from '../middlewares/auth.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

/**
 * Direct Messaging Routes
 */

// Protected routes - requires authentication
router.post('/send', authenticate, apiLimiter, async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    
    if (!recipientId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Recipient ID and content are required',
      });
    }

    // Import here to avoid circular dependencies
    const Message = (await import('../models/messageSchema.js')).default;
    const User = (await import('../models/userSchema.js')).default;

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found',
      });
    }

    // Create message
    const message = new Message({
      sender: req.user._id,
      recipient: recipientId,
      content,
    });

    await message.save();
    await message.populate('sender', 'username fullName profilePicture');
    await message.populate('recipient', 'username fullName profilePicture');

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Message sent successfully',
      data: {
        message,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get conversation between two users
router.get('/conversation/:userId', authenticate, apiLimiter, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const Message = (await import('../models/messageSchema.js')).default;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user._id,
          recipient: userId,
        },
        {
          sender: userId,
          recipient: req.user._id,
        },
      ],
    })
      .populate('sender', 'username fullName profilePicture')
      .populate('recipient', 'username fullName profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Mark as read
    await Message.updateMany(
      {
        recipient: req.user._id,
        sender: userId,
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Conversation retrieved',
      data: messages,
      pagination: {
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get all conversations for current user
router.get('/conversations', authenticate, apiLimiter, async (req, res, next) => {
  try {
    const Message = (await import('../models/messageSchema.js')).default;

    // Get distinct conversations
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: require('mongoose').Types.ObjectId(req.user._id) },
            { recipient: require('mongoose').Types.ObjectId(req.user._id) },
          ],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$sender', require('mongoose').Types.ObjectId(req.user._id)] },
              '$recipient',
              '$sender',
            ],
          },
          lastMessage: { $first: '$content' },
          lastMessageTime: { $first: '$createdAt' },
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Conversations retrieved',
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
