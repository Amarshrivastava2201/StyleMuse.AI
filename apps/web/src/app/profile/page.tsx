'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWardrobe } from '@/context/WardrobeContext';
import {
  ArrowLeft,
  User,
  SlidersHorizontal,
  LogOut,
  Sparkles,
  Shirt,
  Bookmark,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const {
    currentUser,
    isAuthenticated,
    profile,
    wardrobe,
    outfits,
    signOut,
    setIsProfileOpen,
    clearWardrobe,
    seedStarterWardrobe,
  } = useWardrobe();

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-950">
        <div className="text-center max-w-sm">
          <div className="w-12 h-12 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6 text-stone-600 dark:text-stone-300" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Sign In Required
          </h2>
          <p className="text-xs text-stone-500 mt-2 mb-6">
            Please create an account or sign in to view your personal style profile and wardrobe.
          </p>
          <Link
            href="/auth?redirect=/profile"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    signOut();
    router.push('/');
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'SM';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/60 dark:bg-stone-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition"
              title="Back to Studio"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
              My Profile & Account
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/studio"
              className="text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900"
            >
              Back to Studio
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6">
        {/* User Identity Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-full bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 font-serif font-bold text-2xl flex items-center justify-center flex-shrink-0 shadow-md">
            {getInitials(profile.full_name)}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100">
              {profile.full_name || 'My Fashion Profile'}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">{profile.email}</p>

            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900 capitalize font-medium">
                {profile.gender_preference} Focus
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                Private Isolated Wardrobe
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Edit Preferences</span>
          </button>
        </div>

        {/* Wardrobe Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center">
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {wardrobe.length}
            </span>
            <span className="block text-xs text-stone-500 mt-1">Wardrobe Pieces</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center">
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {wardrobe.filter((i) => i.favorite).length}
            </span>
            <span className="block text-xs text-stone-500 mt-1">Favorite Items</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center">
            <span className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              {outfits.length}
            </span>
            <span className="block text-xs text-stone-500 mt-1">Saved Looks</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-center">
            <span className="text-2xl font-serif font-bold text-emerald-600 dark:text-emerald-400">
              Active
            </span>
            <span className="block text-xs text-stone-500 mt-1">Muse AI Stylist</span>
          </div>
        </div>

        {/* Style Pillars */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-6">
          <div>
            <h3 className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-base">
              My Style Archetypes
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.style_archetypes?.map((arch) => (
                <span
                  key={arch}
                  className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 capitalize"
                >
                  {arch.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <h3 className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-base">
              Preferred Color Palettes
            </h3>
            <div className="flex flex-wrap gap-2 mt-3">
              {profile.color_preferences?.map((col) => (
                <span
                  key={col}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 capitalize"
                >
                  {col.replace('_', ' ')}
                </span>
              ))}
            </div>
          </div>

          {/* Manage Wardrobe Data */}
          <div className="pt-4 border-t border-stone-100 dark:border-stone-800">
            <h3 className="font-serif font-semibold text-stone-900 dark:text-stone-100 text-base mb-3">
              Wardrobe Management
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={seedStarterWardrobe}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Add Essential Starter Mock-ups</span>
              </button>
              <button
                onClick={() => {
                  if (confirm('Clear all items from your wardrobe?')) {
                    clearWardrobe();
                  }
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear My Wardrobe</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
