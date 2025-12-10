'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks/useRedux';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  user: string;
  avatar: string;
  action: string;
  timestamp: string;
  unread: boolean;
  postId?: string;
}

export default function NotificationsPage() {
  const { user } = useAppSelector(state => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'likes' | 'comments' | 'follows'>('all');

  useEffect(() => {
    // TODO: Fetch notifications from API
    setNotifications([
      {
        id: '1',
        type: 'like',
        user: 'john_doe',
        avatar: '👨',
        action: 'liked your post',
        timestamp: '2 minutes ago',
        unread: true,
        postId: '123',
      },
      {
        id: '2',
        type: 'comment',
        user: 'jane_smith',
        avatar: '👩',
        action: 'commented on your post',
        timestamp: '15 minutes ago',
        unread: true,
        postId: '124',
      },
      {
        id: '3',
        type: 'follow',
        user: 'alex_tech',
        avatar: '👨‍💻',
        action: 'started following you',
        timestamp: '1 hour ago',
        unread: false,
      },
      {
        id: '4',
        type: 'like',
        user: 'sarah_baker',
        avatar: '👩‍🍳',
        action: 'liked your post',
        timestamp: '3 hours ago',
        unread: false,
        postId: '125',
      },
      {
        id: '5',
        type: 'comment',
        user: 'mike_cool',
        avatar: '😎',
        action: 'commented on your post',
        timestamp: '5 hours ago',
        unread: false,
        postId: '126',
      },
    ]);
    setLoading(false);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h1>
          <Link href="/auth/login" className="text-pink-500 hover:text-pink-600 font-semibold">
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'likes') return notif.type === 'like';
    if (filter === 'comments') return notif.type === 'comment';
    if (filter === 'follows') return notif.type === 'follow';
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'message':
        return '✉️';
      default:
        return '🔔';
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Notifications</h1>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 border-b border-gray-200">
            {[
              { value: 'all' as const, label: 'All' },
              { value: 'likes' as const, label: '❤️ Likes' },
              { value: 'comments' as const, label: '💬 Comments' },
              { value: 'follows' as const, label: '👤 Follows' },
            ].map((tab) => (
              <motion.button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 font-semibold whitespace-nowrap transition ${
                  filter === tab.value
                    ? 'text-pink-600 border-b-2 border-pink-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 border-4 border-gray-300 border-t-pink-500 rounded-full"
            />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-2">🔔 No notifications</p>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <motion.div className="space-y-2">
            {filteredNotifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg transition border-l-4 ${
                  notif.unread
                    ? 'bg-pink-50 border-pink-500'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-lg flex-shrink-0">
                    {notif.avatar}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <p className="font-semibold text-gray-900">@{notif.user}</p>
                      <p className="text-gray-700">{notif.action}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{notif.timestamp}</p>
                  </div>

                  {/* Notification Icon & Action */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xl">{getNotificationIcon(notif.type)}</span>
                    {notif.unread && (
                      <div className="w-3 h-3 rounded-full bg-pink-500" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
