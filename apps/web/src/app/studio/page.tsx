'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWardrobe } from '@/context/WardrobeContext';
import { WardrobeGallery } from '@/components/wardrobe/WardrobeGallery';
import { OutfitCanvas } from '@/components/outfits/OutfitCanvas';
import { SavedOutfitsList } from '@/components/outfits/SavedOutfitsList';
import { UploadGarmentModal } from '@/components/wardrobe/UploadGarmentModal';
import { MultiItemExtractorModal } from '@/components/wardrobe/MultiItemExtractorModal';
import { StylistChatDrawer } from '@/components/stylist/StylistChatDrawer';
import { StyleProfileModal } from '@/components/onboarding/StyleProfileModal';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import {
  Shirt,
  Wand2,
  Bookmark,
  SlidersHorizontal,
  Plus,
  Sparkles,
  ArrowLeft,
  Scissors,
  User,
  LogOut,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

type StudioTab = 'wardrobe' | 'generator' | 'saved';

function StudioContent() {
  const searchParams = useSearchParams();
  const {
    currentUser,
    isAuthenticated,
    wardrobe,
    outfits,
    profile,
    setIsChatOpen,
    setIsUploadOpen,
    setIsProfileOpen,
    setIsExtractorOpen,
  } = useWardrobe();

  const [activeTab, setActiveTab] = useState<StudioTab>('wardrobe');

  // Handle URL action params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'chat') {
      setIsChatOpen(true);
    } else if (action === 'extract') {
      setIsExtractorOpen(true);
    }
  }, [searchParams, setIsChatOpen, setIsExtractorOpen]);

  // Auth Guard: If not signed in, show private wardrobe sign-in gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50 dark:bg-stone-950">
        <div className="max-w-md w-full bg-white dark:bg-stone-900 p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
            Sign In to Access Your Studio
          </h2>
          <p className="text-xs text-stone-500 mt-2 mb-6 leading-relaxed">
            StyleMuse isolates each user&apos;s digital wardrobe, garment mock-ups, and outfit generations to their private account. Please sign in or create your profile to continue.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/auth?mode=signup"
              className="w-full py-3 px-4 rounded-full text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 transition shadow-sm"
            >
              Create My Personal Profile
            </Link>
            <Link
              href="/auth?mode=login"
              className="w-full py-2.5 px-4 rounded-full text-xs font-medium border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition"
            >
              Sign In to Existing Wardrobe
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userDisplayName = profile.full_name || currentUser?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/40 dark:bg-stone-950">
      {/* Studio Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition"
              title="Return to Home"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                StyleMuse<span className="text-amber-700 dark:text-amber-400">.studio</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-medium">
                {userDisplayName}&apos;s Closet
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-full">
            <button
              onClick={() => setActiveTab('wardrobe')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition ${
                activeTab === 'wardrobe'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Wardrobe</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-700">
                {wardrobe.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition ${
                activeTab === 'generator'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>AI Outfit Canvas</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition ${
                activeTab === 'saved'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Lookbook</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-700">
                {outfits.length}
              </span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Deconstruct Outfit Photo Button */}
            <button
              onClick={() => setIsExtractorOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition shadow-sm"
              title="Deconstruct photo: remove person and extract garments"
            >
              <Scissors className="w-3.5 h-3.5 text-amber-700" />
              <span>Deconstruct Photo</span>
            </button>

            {/* Stylist Chat Drawer Trigger */}
            <button
              onClick={() => setIsChatOpen(true)}
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>Ask Muse</span>
            </button>

            {/* Upload Button */}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Piece</span>
            </button>

            {/* My Profile Link */}
            <Link
              href="/profile"
              className="flex items-center gap-1.5 p-2 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition"
              title="My Profile & Settings"
            >
              <User className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden border-t border-stone-100 dark:border-stone-800 px-4 py-2 gap-2 overflow-x-auto bg-stone-50 dark:bg-stone-900">
          <button
            onClick={() => setActiveTab('wardrobe')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'wardrobe' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Wardrobe ({wardrobe.length})
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'generator' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Outfit Canvas
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeTab === 'saved' ? 'bg-stone-900 text-white' : 'text-stone-600'
            }`}
          >
            Lookbook ({outfits.length})
          </button>
          <button
            onClick={() => setIsExtractorOpen(true)}
            className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap text-amber-700 bg-amber-50"
          >
            ✂️ Deconstruct Photo
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {activeTab === 'wardrobe' && <WardrobeGallery />}
        {activeTab === 'generator' && <OutfitCanvas />}
        {activeTab === 'saved' && (
          <SavedOutfitsList onSwitchToGenerator={() => setActiveTab('generator')} />
        )}
      </main>

      {/* Portals */}
      <UploadGarmentModal />
      <MultiItemExtractorModal />
      <StylistChatDrawer />
      <StyleProfileModal />
      <OnboardingWizard />
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 dark:bg-stone-950" />}>
      <StudioContent />
    </Suspense>
  );
}
