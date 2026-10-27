'use client';

import React, { useState } from 'react';
import { useWardrobe } from '@/context/WardrobeContext';
import { StyleArchetype, GenderPreference } from '@stylemuse/types';
import { Sparkles, Check, ArrowRight, ArrowLeft, Shirt, Sparkle, Layers } from 'lucide-react';

const ARCHETYPES: Array<{ id: StyleArchetype; title: string; desc: string }> = [
  { id: 'minimalist', title: 'Minimalist', desc: 'Clean lines, monochromatic accents, modern restraint' },
  { id: 'smart_casual', title: 'Smart Casual', desc: 'Relaxed tailoring, blazers, chinos & loafers' },
  { id: 'old_money', title: 'Quiet Luxury', desc: 'Cashmere, linen, subtle heritage tailoring' },
  { id: 'streetwear', title: 'Contemporary Street', desc: 'Oversized cuts, statement sneakers, relaxed denim' },
  { id: 'classic', title: 'Classic Tailoring', desc: 'Trench coats, crisp poplin shirts, timeless cuts' },
];

const COLORS = ['navy', 'cream', 'charcoal', 'olive', 'black', 'white', 'camel', 'burgundy'];

export const OnboardingWizard: React.FC = () => {
  const {
    showOnboardingWizard,
    setShowOnboardingWizard,
    profile,
    updateProfile,
    seedStarterWardrobe,
    clearWardrobe,
    setIsExtractorOpen,
  } = useWardrobe();

  const [step, setStep] = useState<number>(1);
  const [selectedArchs, setSelectedArchs] = useState<StyleArchetype[]>(
    profile.style_archetypes || ['minimalist']
  );
  const [selectedColors, setSelectedColors] = useState<string[]>(
    profile.color_preferences || ['navy', 'cream']
  );
  const [gender, setGender] = useState<GenderPreference>(
    profile.gender_preference || 'unspecified'
  );
  const [wardrobeOption, setWardrobeOption] = useState<'seed' | 'empty' | 'extract'>('seed');

  if (!showOnboardingWizard) return null;

  const toggleArch = (id: StyleArchetype) => {
    setSelectedArchs((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const toggleColor = (c: string) => {
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((col) => col !== c) : [...prev, c]
    );
  };

  const handleFinish = () => {
    updateProfile({
      style_archetypes: selectedArchs,
      color_preferences: selectedColors,
      gender_preference: gender,
      onboarding_completed: true,
    });

    if (wardrobeOption === 'seed') {
      seedStarterWardrobe();
    } else if (wardrobeOption === 'empty') {
      clearWardrobe();
    } else if (wardrobeOption === 'extract') {
      clearWardrobe();
      setIsExtractorOpen(true);
    }

    setShowOnboardingWizard(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-10 flex flex-col">
        {/* Progress bar */}
        <div className="w-full bg-stone-100 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden mb-6">
          <div
            className="bg-stone-900 dark:bg-stone-100 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2">
          <span>
            Step {step} of 3 &bull; {step === 1 ? 'Style Aesthetic' : step === 2 ? 'Color Palette' : 'Wardrobe Setup'}
          </span>
          <span className="text-amber-700 dark:text-amber-400 font-medium">StyleMuse Walkthrough</span>
        </div>

        {/* Step 1: Style Archetypes */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Welcome {profile.full_name || 'there'}! What is your style identity?
            </h2>
            <p className="text-xs text-stone-500 leading-relaxed">
              Select 1 to 3 aesthetic pillars. Muse uses this to curate your daily outfit suggestions.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {ARCHETYPES.map((arch) => {
                const active = selectedArchs.includes(arch.id);
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => toggleArch(arch.id)}
                    className={`text-left p-3.5 rounded-2xl border transition ${
                      active
                        ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 hover:border-stone-400 text-stone-800 dark:text-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{arch.title}</span>
                      {active && <Check className="w-4 h-4" />}
                    </div>
                    <p
                      className={`text-[11px] mt-1.5 line-clamp-2 ${
                        active ? 'text-stone-300 dark:text-stone-600' : 'text-stone-500'
                      }`}
                    >
                      {arch.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Colors & Department */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
                Choose your signature colors & department
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Tell us which colors dominate your current closet.
              </p>
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                Department Focus
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['womenswear', 'menswear', 'androgynous'] as GenderPreference[]).map((g) => {
                  const active = gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-2.5 text-xs font-semibold rounded-xl capitalize border transition ${
                        active
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent shadow-sm'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 uppercase tracking-wider mb-2">
                Preferred Color Palette
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map((col) => {
                  const active = selectedColors.includes(col);
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => toggleColor(col)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs capitalize border transition ${
                        active
                          ? 'bg-amber-100 dark:bg-amber-950 border-amber-600 text-amber-900 dark:text-amber-200 font-medium'
                          : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <span>{col}</span>
                      {active && <Check className="w-3.5 h-3.5" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Wardrobe Setup */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              How would you like to set up your wardrobe?
            </h2>
            <p className="text-xs text-stone-500">
              StyleMuse ensures your wardrobe is 100% private and user-isolated.
            </p>

            <div className="space-y-3 pt-2">
              {/* Option A: Seed with mockups */}
              <button
                type="button"
                onClick={() => setWardrobeOption('seed')}
                className={`w-full text-left p-4 rounded-2xl border transition flex items-center gap-4 ${
                  wardrobeOption === 'seed'
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-600'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Seed with Essential Starter Mock-ups (Recommended)
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Starts your wardrobe with 4 clean studio mock-up essentials (Oxford shirt, chinos, sneakers, overcoat).
                  </p>
                </div>
                {wardrobeOption === 'seed' && <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />}
              </button>

              {/* Option B: Clean empty wardrobe */}
              <button
                type="button"
                onClick={() => setWardrobeOption('empty')}
                className={`w-full text-left p-4 rounded-2xl border transition flex items-center gap-4 ${
                  wardrobeOption === 'empty'
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-600'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center flex-shrink-0">
                  <Shirt className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Start with a Clean Empty Wardrobe
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Zero pre-filled items. You will build your closet by uploading your own clothing photos.
                  </p>
                </div>
                {wardrobeOption === 'empty' && <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />}
              </button>

              {/* Option C: Outfit Photo Deconstructor */}
              <button
                type="button"
                onClick={() => setWardrobeOption('extract')}
                className={`w-full text-left p-4 rounded-2xl border transition flex items-center gap-4 ${
                  wardrobeOption === 'extract'
                    ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-600'
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                    Deconstruct an Outfit Photo (AI Extraction & Person Removal)
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Immediately launch the multi-garment segmenter to isolate clothes from a full-body photo.
                  </p>
                </div>
                {wardrobeOption === 'extract' && <Check className="w-5 h-5 text-amber-600 flex-shrink-0" />}
              </button>
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 shadow-sm"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 hover:opacity-90 shadow-sm"
            >
              <span>Enter My Styling Studio</span>
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
