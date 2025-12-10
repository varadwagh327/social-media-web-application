'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks/useRedux';

interface Conversation {
  id: string;
  username: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export default function MessagesPage() {
  const { user } = useAppSelector(state => state.auth);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch conversations from API
    setConversations([
      {
        id: '1',
        username: 'john_doe',
        avatar: '👨',
        lastMessage: 'Hey! How are you?',
        timestamp: '2 hours ago',
        unread: true,
      },
      {
        id: '2',
        username: 'jane_smith',
        avatar: '👩',
        lastMessage: 'That sounds great!',
        timestamp: 'Yesterday',
        unread: false,
      },
      {
        id: '3',
        username: 'alex_tech',
        avatar: '👨‍💻',
        lastMessage: 'See you soon',
        timestamp: '3 days ago',
        unread: false,
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

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Conversations List */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-80 border-r border-gray-200 flex flex-col h-screen md:h-auto"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
          <input
            type="text"
            placeholder="🔍 Search conversations..."
            className="w-full px-4 py-2 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm placeholder-gray-500"
          />
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-8 h-8 border-3 border-gray-300 border-t-pink-500 rounded-full"
              />
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No conversations yet</p>
            </div>
          ) : (
            conversations.map((conv, index) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedConversation(conv.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition ${
                  selectedConversation === conv.id
                    ? 'bg-gray-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-xl flex-shrink-0">
                    {conv.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-gray-900">@{conv.username}</p>
                      <span className="text-xs text-gray-500">{conv.timestamp}</span>
                    </div>
                    <p className={`text-sm truncate ${
                      conv.unread ? 'font-semibold text-gray-900' : 'text-gray-600'
                    }`}>
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread && (
                    <div className="w-2 h-2 rounded-full bg-pink-500 flex-shrink-0" />
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>

      {/* Chat Area */}
      {selectedConversation ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="hidden md:flex flex-1 flex-col"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex items-center justify-center text-lg">
                👨
              </div>
              <div>
                <p className="font-semibold text-gray-900">@john_doe</p>
                <p className="text-xs text-gray-500">Active now</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-gray-700">ⓘ</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex justify-start">
              <div className="max-w-xs bg-gray-100 rounded-lg p-3 text-gray-900">
                Hey! How are you?
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-xs bg-pink-500 rounded-lg p-3 text-white">
                I'm doing great, thanks for asking!
              </div>
            </div>
            <div className="flex justify-start">
              <div className="max-w-xs bg-gray-100 rounded-lg p-3 text-gray-900">
                Want to grab coffee soon?
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-3">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="💬 Write a message..."
                className="flex-1 px-4 py-2 bg-gray-100 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 placeholder-gray-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold transition hover:shadow-lg"
              >
                📤
              </motion.button>
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-xl text-gray-600 mb-2">💬 Select a conversation</p>
            <p className="text-gray-500">Start messaging with your friends</p>
          </div>
        </div>
      )}

      {/* Mobile - No Chat Selected Message */}
      <div className="md:hidden flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2">💬 Choose a conversation</p>
          <p className="text-gray-500 text-sm">Tap on a conversation to start chatting</p>
        </div>
      </div>
    </div>
  );
}
