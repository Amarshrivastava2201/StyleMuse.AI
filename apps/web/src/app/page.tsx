'use client';

import React from 'react';
import { Sparkles, Shirt, Wand2, Compass, ArrowRight, CheckCircle2, User, Scissors } from 'lucide-react';
import Link from 'next/link';
import { useWardrobe } from '@/context/WardrobeContext';

export default function Home() {
  const { isAuthenticated, currentUser } = useWardrobe();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b border-stone-200/60 dark:border-stone-800/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-stone-900 dark:text-stone-100 font-serif">
              StyleMuse<span className="text-amber-700 dark:text-amber-400">.ai</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#features"
              className="text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition hidden sm:inline-block"
            >
              Features
            </a>

            {/* Ask Muse button - Requires Login! */}
            <Link
              href={isAuthenticated ? '/studio?action=chat' : '/auth?action=muse'}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
              <span>Ask Muse</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{currentUser?.profile.full_name?.split(' ')[0] || 'My Profile'}</span>
                </Link>
                <Link
                  href="/studio"
                  className="text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 px-4 py-2 rounded-full hover:opacity-90 transition shadow-sm"
                >
                  My Studio
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth?mode=login"
                  className="text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 px-3 py-1.5"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth?mode=signup"
                  className="text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 px-4 py-2 rounded-full hover:opacity-90 transition shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs font-medium mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Wardrobe Intelligence & Daily Personal Styling</span>
          </div>

          <h1 className="text-5xl sm:text-6xl font-serif font-medium tracking-tight text-stone-900 dark:text-stone-50 max-w-3xl mx-auto leading-tight">
            Stop staring at a full closet with nothing to wear.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto leading-relaxed">
            Digitize your wardrobe in seconds. Our AI removes background clutter, extracts individual garments (tops, pants, shoes) into clean studio mock-ups, and curates daily looks from clothes you actually own.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={isAuthenticated ? '/studio' : '/auth?mode=signup'}
              className="flex items-center gap-2 text-sm font-semibold bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 px-7 py-3 rounded-full hover:opacity-90 transition shadow-sm"
            >
              <span>{isAuthenticated ? 'Open My Studio' : 'Create My Personal Wardrobe'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={isAuthenticated ? '/studio?action=extract' : '/auth?action=extract'}
              className="flex items-center gap-2 text-sm font-medium border border-stone-300 dark:border-stone-700 px-6 py-3 rounded-full hover:bg-stone-50 dark:hover:bg-stone-900 transition"
            >
              <Scissors className="w-4 h-4 text-amber-700" />
              <span>Deconstruct an Outfit Photo</span>
            </Link>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 mb-4">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                1. Photo Cleanup & Person Removal
              </h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Upload a full-body photo or selfie. AI segments tops, pants, jackets, and shoes, eliminates the person, and renders isolated studio mock-ups.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 mb-4">
                <Wand2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                2. Real-Wardrobe Synthesis
              </h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Unlike generic Pinterest boards, StyleMuse builds complete occasion outfits constructed exclusively using garments from your private closet.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-800 dark:text-amber-300 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                3. Muse - Conversational Stylist
              </h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                Chat with Muse by name for weather-tailored advice, color coordination tips, and capsule wardrobe recommendations.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200/60 dark:border-stone-800/60 py-8 text-center text-xs text-stone-500">
        <p>StyleMuse AI &copy; 2026. Private user wardrobes with AI vision extraction.</p>
      </footer>
    </div>
  );
}
