'use client';

import React, { useState } from 'react';
import { useWardrobe } from '@/context/WardrobeContext';
import { StyleArchetype, BodyShape, GenderPreference } from '@stylemuse/types';
import { X, Check, SlidersHorizontal, Sparkles } from 'lucide-react';

const ALL_ARCHETYPES: { id: StyleArchetype; label: string; desc: string }[] = [
  { id: 'minimalist', label: 'Minimalist', desc: 'Clean lines, architectural cuts, neutral palette' },
  { id: 'smart_casual', label: 'Smart Casual', desc: 'Blazers, chinos, elevated knits and loafers' },
  { id: 'classic', label: 'Classic', desc: 'Timeless tailoring, trench coats, crisp tailoring' },
  { id: 'old_money', label: 'Old Money / Quiet Luxury', desc: 'Linen, cashmere, subtle heritage elegance' },
  { id: 'streetwear', label: 'Streetwear', desc: 'Relaxed silhouettes, statement pieces, sneakers' },
  { id: 'athleisure', label: 'Athleisure', desc: 'Technical fabrics, active comfort, sleek runners' },
  { id: 'vintage', label: 'Vintage / Retro', desc: '70s-90s tailoring, textured leather, nostalgic cuts' },
];

const POPULAR_COLORS = ['navy', 'cream', 'charcoal', 'olive', 'black', 'white', 'camel', 'burgundy', 'forest_green'];

export const StyleProfileModal: React.FC = () => {
  const { isProfileOpen, setIsProfileOpen, profile, updateProfile } = useWardrobe();

  const [archetypes, setArchetypes] = useState<StyleArchetype[]>(
    profile.style_archetypes || ['minimalist']
  );
  const [colors, setColors] = useState<string[]>(
    profile.color_preferences || ['navy', 'cream']
  );
  const [dislikes, setDislikes] = useState<string[]>(
    profile.color_dislikes || ['neon_green']
  );
  const [gender, setGender] = useState<GenderPreference>(
    profile.gender_preference || 'unspecified'
  );
  const [savedMessage, setSavedMessage] = useState(false);

  if (!isProfileOpen) return null;

  const toggleArchetype = (arch: StyleArchetype) => {
    setArchetypes((prev) =>
      prev.includes(arch) ? prev.filter((a) => a !== arch) : [...prev, arch]
    );
  };

  const toggleColor = (c: string) => {
    setColors((prev) =>
      prev.includes(c) ? prev.filter((col) => col !== c) : [...prev, c]
    );
  };

  const handleSave = () => {
    updateProfile({
      style_archetypes: archetypes,
      color_preferences: colors,
      color_dislikes: dislikes,
      gender_preference: gender,
      onboarding_completed: true,
    });
    setSavedMessage(true);
    setTimeout(() => {
      setSavedMessage(false);
      setIsProfileOpen(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-800 dark:text-amber-300">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
                Fashion Preferences & Onboarding
              </h2>
              <p className="text-xs text-stone-500">
                Stylist Muse tunes outfit generation to these aesthetic pillars.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsProfileOpen(false)}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {/* Style Archetypes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Style Archetypes (Pick 1-3)
            </label>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {ALL_ARCHETYPES.map((arch) => {
                const active = archetypes.includes(arch.id);
                return (
                  <button
                    key={arch.id}
                    type="button"
                    onClick={() => toggleArchetype(arch.id)}
                    className={`text-left p-3 rounded-2xl border transition ${
                      active
                        ? 'border-stone-900 dark:border-stone-100 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 text-stone-800 dark:text-stone-200 hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{arch.label}</span>
                      {active && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <p
                      className={`text-[11px] mt-1 line-clamp-2 ${
                        active
                          ? 'text-stone-300 dark:text-stone-600'
                          : 'text-stone-500 dark:text-stone-400'
                      }`}
                    >
                      {arch.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Preferences */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Preferred Palettes
            </label>
            <div className="flex flex-wrap gap-2">
              {POPULAR_COLORS.map((col) => {
                const active = colors.includes(col);
                return (
                  <button
                    key={col}
                    type="button"
                    onClick={() => toggleColor(col)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs capitalize border transition ${
                      active
                        ? 'bg-amber-100 dark:bg-amber-950 border-amber-600 text-amber-900 dark:text-amber-200 font-medium'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    <span>{col.replace('_', ' ')}</span>
                    {active && <Check className="w-3 h-3 text-amber-700" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gender Preference */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Department Focus
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['womenswear', 'menswear', 'androgynous'] as GenderPreference[]).map((g) => {
                const active = gender === g;
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2 text-xs rounded-xl capitalize border transition font-medium text-center ${
                      active
                        ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 border-transparent shadow-sm'
                        : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => setIsProfileOpen(false)}
            className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-400"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-full text-xs font-medium bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 shadow-sm transition"
          >
            {savedMessage ? 'Preferences Saved!' : 'Save Style Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};
