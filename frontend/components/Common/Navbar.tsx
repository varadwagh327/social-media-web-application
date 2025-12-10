'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useState } from 'react';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const isAdmin = user?.role === 'admin';

  return (
    <motion.nav
      className="sticky top-0 z-50 bg-white border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-2xl font-bold italic font-serif text-gray-900"
          >
            SocialHub
          </motion.div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-1 items-center">
          {isAuthenticated ? (
            <>
              {/* Home */}
              <Link
                href="/posts"
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition group"
              >
                <motion.span whileHover={{ scale: 1.2 }} className="text-2xl">
                  🏠
                </motion.span>
              </Link>

              {/* Explore */}
              <Link
                href="/explore"
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <motion.span whileHover={{ scale: 1.2 }} className="text-2xl">
                  🔍
                </motion.span>
              </Link>

              {/* Create */}
              <Link
                href="/posts/create"
                className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <motion.span whileHover={{ scale: 1.2 }} className="text-2xl">
                  ➕
                </motion.span>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative ml-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="p-1 rounded-full hover:bg-gray-100 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                </motion.button>

                <AnimatePresence>
                  {profileDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                    >
                      <Link
                        href="/profile/me"
                        className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition"
                      >
                        👤 Profile
                      </Link>
                      <Link
                        href="/saved"
                        className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition"
                      >
                        🔖 Saved
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-900 hover:bg-gray-50 transition"
                      >
                        ⚙️ Settings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition border-t border-gray-200"
                      >
                        🚪 Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/login"
                  className="px-6 py-2 text-gray-900 font-semibold hover:bg-gray-100 rounded-lg transition"
                >
                  Log in
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth/signup"
                  className="px-6 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-lg hover:shadow-lg transition"
                >
                  Sign up
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="md:hidden text-2xl text-gray-900"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/posts" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition">
                    🏠 Home
                  </Link>
                  <Link href="/explore" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition">
                    🔍 Explore
                  </Link>
                  <Link href="/posts/create" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition">
                    ➕ Create
                  </Link>
                  <Link href="/profile/me" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition">
                    👤 Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    🚪 Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="block px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition">
                    Log in
                  </Link>
                  <Link href="/auth/signup" className="block px-4 py-2 bg-pink-500 text-white rounded-lg transition">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
