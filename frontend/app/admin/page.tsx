'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/hooks/useRedux';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const { user } = useAppSelector(state => state.auth);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user || user.role !== 'admin') {
      return;
    }

    // Fetch stats
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/v1/admin/stats', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
          <p className="text-gray-400 mb-8">You don't have permission to access this page.</p>
          <Link
            href="/posts"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back to Posts
          </Link>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'from-blue-500 to-blue-600' },
    { label: 'Total Posts', value: stats.totalPosts, color: 'from-purple-500 to-purple-600' },
    { label: 'Total Comments', value: stats.totalComments, color: 'from-pink-500 to-pink-600' },
    { label: 'Active Users', value: stats.activeUsers, color: 'from-green-500 to-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your platform and view statistics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${card.color} p-6 rounded-lg text-white shadow-lg hover:shadow-xl transition`}
            >
              <p className="text-gray-100 mb-2">{card.label}</p>
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <p className="text-4xl font-bold">{card.value}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Admin Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-800 rounded-lg p-6 border border-slate-700"
        >
          <h2 className="text-2xl font-bold text-white mb-4">Admin Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/admin/users"
              className="block p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              <h3 className="font-semibold mb-1">Manage Users</h3>
              <p className="text-sm text-blue-100">View and manage user accounts</p>
            </Link>
            <Link
              href="/admin/posts"
              className="block p-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <h3 className="font-semibold mb-1">Moderate Posts</h3>
              <p className="text-sm text-purple-100">Review and remove inappropriate content</p>
            </Link>
            <Link
              href="/admin/reports"
              className="block p-4 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition"
            >
              <h3 className="font-semibold mb-1">View Reports</h3>
              <p className="text-sm text-pink-100">Handle user reports and complaints</p>
            </Link>
            <Link
              href="/admin/settings"
              className="block p-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <h3 className="font-semibold mb-1">System Settings</h3>
              <p className="text-sm text-green-100">Configure platform settings</p>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
