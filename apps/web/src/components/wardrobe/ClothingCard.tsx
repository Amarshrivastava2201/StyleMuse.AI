'use client';

import React from 'react';
import { ClothingItem } from '@stylemuse/types';
import { Heart, Trash2, Sparkles } from 'lucide-react';
import { useWardrobe } from '@/context/WardrobeContext';

interface ClothingCardProps {
  item: ClothingItem;
  onSelect?: (item: ClothingItem) => void;
  selected?: boolean;
}

export const ClothingCard: React.FC<ClothingCardProps> = ({
  item,
  onSelect,
  selected = false,
}) => {
  const { toggleFavoriteItem, removeClothingItem } = useWardrobe();

  return (
    <div
      onClick={() => onSelect && onSelect(item)}
      className={`group relative flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-stone-900 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${
        selected
          ? 'border-amber-600 ring-2 ring-amber-600/30'
          : 'border-stone-200/80 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
        <img
          src={item.image_url}
          alt={item.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavoriteItem(item.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm hover:scale-110 transition active:scale-95 z-10"
          aria-label={item.favorite ? 'Remove favorite' : 'Add favorite'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              item.favorite
                ? 'fill-rose-500 text-rose-500'
                : 'text-stone-500 hover:text-rose-500'
            }`}
          />
        </button>

        {/* Delete Button (visible on hover) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(`Remove "${item.name}" from your wardrobe?`)) {
              removeClothingItem(item.id);
            }
          }}
          className="absolute top-3 left-3 p-2 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm opacity-0 group-hover:opacity-100 transition hover:text-rose-600 z-10"
          aria-label="Delete item"
        >
          <Trash2 className="w-3.5 h-3.5 text-stone-500 hover:text-rose-600" />
        </button>

        {/* Category Pill & Mockup Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
          <div className="px-2.5 py-1 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-[11px] font-medium tracking-wide capitalize">
            <span>{item.category}</span>
          </div>
          {Boolean(item.ai_metadata?.is_mockup) && (
            <div className="px-2 py-1 rounded-full bg-stone-800/80 backdrop-blur-md text-stone-200 text-[10px] font-medium">
              <span>Mock-up</span>
            </div>
          )}
        </div>

        {/* AI Confidence Indicator if present */}
        {typeof item.ai_metadata?.confidence_score === 'number' && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-white text-[10px] font-medium">
            <Sparkles className="w-2.5 h-2.5" />
            <span>AI Verified</span>
          </div>
        )}
      </div>

      {/* Card Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-stone-900">
        <div>
          <h3 className="font-medium text-sm text-stone-900 dark:text-stone-100 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 capitalize mt-0.5">
            {item.subcategory.replace('_', ' ')} &bull; {item.primary_color}
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-400">
          <span className="capitalize px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800">
            {item.formality.replace('_', ' ')}
          </span>
          {item.seasons.slice(0, 2).map((s) => (
            <span key={s} className="capitalize px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
