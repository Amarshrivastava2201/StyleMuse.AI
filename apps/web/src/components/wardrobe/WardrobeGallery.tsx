'use client';

import React, { useState, useMemo } from 'react';
import { useWardrobe } from '@/context/WardrobeContext';
import { ClothingCard } from './ClothingCard';
import { ClothingCategory } from '@stylemuse/types';
import { Search, Plus, Filter, Heart, Sparkles, Shirt, Scissors } from 'lucide-react';

const CATEGORIES: { label: string; value: 'all' | ClothingCategory }[] = [
  { label: 'All Items', value: 'all' },
  { label: 'Tops', value: 'tops' },
  { label: 'Bottoms', value: 'bottoms' },
  { label: 'One-Piece', value: 'one-piece' },
  { label: 'Outerwear', value: 'outerwear' },
  { label: 'Footwear', value: 'footwear' },
  { label: 'Accessories', value: 'accessories' },
];

export const WardrobeGallery: React.FC = () => {
  const { wardrobe, setIsUploadOpen, setIsExtractorOpen, seedStarterWardrobe } = useWardrobe();

  const [activeCategory, setActiveCategory] = useState<'all' | ClothingCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return wardrobe.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }
      // Favorites filter
      if (favoritesOnly && !item.favorite) {
        return false;
      }
      // Search filter (name, subcategory, primary_color, material)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesSubcategory = item.subcategory.toLowerCase().includes(query);
        const matchesColor = item.primary_color.toLowerCase().includes(query);
        const matchesMaterial = item.material?.toLowerCase().includes(query);
        if (!matchesName && !matchesSubcategory && !matchesColor && !matchesMaterial) {
          return false;
        }
      }
      return true;
    });
  }, [wardrobe, activeCategory, searchQuery, favoritesOnly]);

  return (
    <div className="w-full">
      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clothes by name, color, fabric..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-400 dark:focus:ring-stone-600 shadow-sm"
          />
        </div>

        {/* Actions (Favorites, Deconstruct Photo, Add button) */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full text-xs font-medium border transition ${
              favoritesOnly
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                favoritesOnly ? 'fill-rose-500 text-rose-500' : 'text-stone-400'
              }`}
            />
            <span>Favorites</span>
          </button>

          {/* Person Removal & Garment Extractor Trigger */}
          <button
            onClick={() => setIsExtractorOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 hover:bg-amber-100 transition shadow-sm"
          >
            <Scissors className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Deconstruct Outfit Photo</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Piece</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        {CATEGORIES.map((cat) => {
          const count =
            cat.value === 'all'
              ? wardrobe.length
              : wardrobe.filter((i) => i.category === cat.value).length;
          const isActive = activeCategory === cat.value;

          return (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs whitespace-nowrap transition ${
                isActive
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 font-medium shadow-sm'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-stone-700 dark:bg-stone-300 text-white dark:text-stone-900'
                    : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Wardrobe Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item) => (
            <ClothingCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto mb-4">
            <Shirt className="w-6 h-6" />
          </div>
          <h3 className="text-base font-serif font-medium text-stone-900 dark:text-stone-100">
            Your personal wardrobe is currently empty
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mt-1.5">
            {searchQuery || favoritesOnly || activeCategory !== 'all'
              ? 'Try adjusting your filters or search keywords.'
              : 'Add clothes by uploading single pieces, deconstruct a full-body outfit photo (with person removed), or seed essential starter mock-ups.'}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsExtractorOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 transition shadow-sm"
            >
              <Scissors className="w-4 h-4 text-amber-500" />
              <span>Deconstruct Outfit Photo</span>
            </button>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Single Piece</span>
            </button>
            <button
              onClick={seedStarterWardrobe}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Add Starter Mock-ups</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
