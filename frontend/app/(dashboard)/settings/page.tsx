'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAppSelector } from '@/lib/hooks/useRedux';

interface SettingsSection {
  title: string;
  icon: string;
  items: {
    label: string;
    value: string | boolean;
    onChange?: (value: any) => void;
    type: 'toggle' | 'text' | 'select';
  }[];
}

export default function SettingsPage() {
  const { user } = useAppSelector(state => state.auth);
  const [settings, setSettings] = useState({
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
    },
    privacy: {
      privateAccount: false,
      allowMessages: true,
      showActivity: true,
    },
    display: {
      darkMode: false,
      compactMode: false,
    },
  });
  const [savedMessage, setSavedMessage] = useState('');

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

  const handleToggle = (section: string, key: string) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof settings],
        [key]: !prev[section as keyof typeof settings][key as any],
      },
    }));
    setSavedMessage('✓ Changes saved');
    setTimeout(() => setSavedMessage(''), 2000);
  };

  const sections: SettingsSection[] = [
    {
      title: 'Notifications',
      icon: '🔔',
      items: [
        { label: 'Likes notifications', value: settings.notifications.likes, type: 'toggle' },
        { label: 'Comments notifications', value: settings.notifications.comments, type: 'toggle' },
        { label: 'Follow notifications', value: settings.notifications.follows, type: 'toggle' },
        { label: 'Message notifications', value: settings.notifications.messages, type: 'toggle' },
      ],
    },
    {
      title: 'Privacy',
      icon: '🔒',
      items: [
        { label: 'Private account', value: settings.privacy.privateAccount, type: 'toggle' },
        { label: 'Allow direct messages', value: settings.privacy.allowMessages, type: 'toggle' },
        { label: 'Show activity status', value: settings.privacy.showActivity, type: 'toggle' },
      ],
    },
    {
      title: 'Display',
      icon: '🎨',
      items: [
        { label: 'Dark mode', value: settings.display.darkMode, type: 'toggle' },
        { label: 'Compact mode', value: settings.display.compactMode, type: 'toggle' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account preferences</p>
        </div>

        {/* Saved Message */}
        {savedMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm"
          >
            {savedMessage}
          </motion.div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {sections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1 }}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Section Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
                </div>
              </div>

              {/* Section Items */}
              <div className="divide-y divide-gray-100">
                {section.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: sectionIndex * 0.1 + itemIndex * 0.05 }}
                    className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <label className="text-gray-900 font-medium cursor-pointer">
                      {item.label}
                    </label>

                    {/* Toggle Switch */}
                    {item.type === 'toggle' && (
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const keys: {
                            [key: string]: string[];
                          } = {
                            notifications: ['likes', 'comments', 'follows', 'messages'],
                            privacy: ['privateAccount', 'allowMessages', 'showActivity'],
                            display: ['darkMode', 'compactMode'],
                          };

                          for (const [section, itemKeys] of Object.entries(keys)) {
                            if (itemKeys.includes(item.label.replace(/\s.*/, '').toLowerCase())) {
                              handleToggle(section, itemKeys[itemIndex]);
                              return;
                            }
                          }
                        }}
                        className={`relative inline-flex w-12 h-6 rounded-full transition ${
                          item.value
                            ? 'bg-gradient-to-r from-pink-500 to-red-500'
                            : 'bg-gray-300'
                        }`}
                      >
                        <motion.span
                          animate={{ x: item.value ? 24 : 2 }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full transition"
                        />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-bold text-gray-900">Account</h2>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-100">
              <motion.div
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-4 flex items-center justify-between cursor-pointer transition"
              >
                <span className="text-gray-900 font-medium">Change password</span>
                <span className="text-gray-400">→</span>
              </motion.div>
              <motion.div
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-4 flex items-center justify-between cursor-pointer transition"
              >
                <span className="text-gray-900 font-medium">Two-factor authentication</span>
                <span className="text-gray-400">→</span>
              </motion.div>
              <motion.div
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="p-4 flex items-center justify-between cursor-pointer transition"
              >
                <span className="text-gray-900 font-medium">Download your data</span>
                <span className="text-gray-400">→</span>
              </motion.div>
              <motion.button
                whileHover={{ backgroundColor: '#f9fafb' }}
                className="w-full p-4 text-left text-red-600 font-medium hover:bg-red-50 transition"
              >
                Delete account
              </motion.button>
            </div>
          </motion.div>

          {/* Sign Out */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition"
          >
            Sign out
          </motion.button>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>Version 1.0.0</p>
            <div className="flex justify-center gap-4">
              <button className="text-gray-500 hover:text-gray-700">Privacy Policy</button>
              <button className="text-gray-500 hover:text-gray-700">Terms of Service</button>
              <button className="text-gray-500 hover:text-gray-700">Report Problem</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
