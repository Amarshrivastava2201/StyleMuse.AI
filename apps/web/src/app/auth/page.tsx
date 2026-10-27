'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { useWardrobe } from '@/context/WardrobeContext';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signUp, signIn, isAuthenticated } = useWardrobe();

  const initialMode = searchParams.get('mode') === 'login' ? 'login' : 'signup';
  const actionParam = searchParams.get('action');

  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');

  // If already authenticated, redirect to studio
  useEffect(() => {
    if (isAuthenticated) {
      const target = actionParam === 'muse' ? '/studio?action=chat' : '/studio';
      router.push(target);
    }
  }, [isAuthenticated, actionParam, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please provide an email address.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      signUp(email, password, fullName);
    } else {
      signIn(email, password);
    }

    const target = actionParam === 'muse' ? '/studio?action=chat' : '/studio';
    router.push(target);
  };

  const handleQuickDemo = (demoName: string, demoEmail: string) => {
    signUp(demoEmail, 'demo123', demoName);
    const target = actionParam === 'muse' ? '/studio?action=chat' : '/studio';
    router.push(target);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-stone-50/60 dark:bg-stone-950">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-block">
          <span className="text-2xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100">
            StyleMuse<span className="text-amber-700 dark:text-amber-400">.ai</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-serif font-medium tracking-tight text-stone-900 dark:text-stone-100">
          {actionParam === 'muse'
            ? 'Sign in to consult Muse'
            : mode === 'signup'
            ? 'Create your private wardrobe'
            : 'Sign in to your wardrobe'}
        </h2>
        <p className="mt-1.5 text-xs text-stone-500">
          {actionParam === 'muse'
            ? 'Your personal AI stylist requires an account to access and style your private clothes.'
            : 'Your wardrobe, measurements, and outfits are strictly isolated to your account.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-stone-900 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-stone-200/80 dark:border-stone-800">
          {/* Mode Switcher */}
          <div className="flex bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                mode === 'signup'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-xs font-semibold rounded-xl transition ${
                mode === 'login'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500'
              }`}
            >
              Sign In
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sarah Chen"
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 transition shadow-sm"
            >
              <span>{mode === 'signup' ? 'Create Account & Start Walkthrough' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Identities */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-200 dark:border-stone-800" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-stone-900 text-stone-400">
                Or test with sample accounts
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('Sarah Chen', 'sarah.chen@stylemuse.ai')}
              className="p-2.5 text-left rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-600 transition bg-stone-50/50 dark:bg-stone-850"
            >
              <span className="block text-xs font-semibold text-stone-900 dark:text-stone-100">
                Sarah Chen
              </span>
              <span className="block text-[10px] text-stone-500">Womenswear Minimal</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('Liam Vance', 'liam.vance@stylemuse.ai')}
              className="p-2.5 text-left rounded-xl border border-stone-200 dark:border-stone-800 hover:border-amber-600 transition bg-stone-50/50 dark:bg-stone-850"
            >
              <span className="block text-xs font-semibold text-stone-900 dark:text-stone-100">
                Liam Vance
              </span>
              <span className="block text-[10px] text-stone-500">Menswear Tailored</span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-center text-xs text-stone-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>User-specific isolation &bull; Separate closets &bull; No shared data</span>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 dark:bg-stone-950" />}>
      <AuthForm />
    </Suspense>
  );
}
