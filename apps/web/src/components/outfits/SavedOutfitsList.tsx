'use client';

import React from 'react';
import { useWardrobe } from '@/context/WardrobeContext';
import { Heart, Trash2, Sparkles, Wand2 } from 'lucide-react';

export const SavedOutfitsList: React.FC<{ onSwitchToGenerator: () => void }> = ({
  onSwitchToGenerator,
}) => {
  const { outfits, removeOutfit, toggleFavoriteOutfit } = useWardrobe();

  if (outfits.length === 0) {
    return (
      <div className="text-center py-20 px-4 rounded-3xl border border-dashed border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/50">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center mx-auto mb-4">
          <Wand2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-serif font-medium text-stone-900 dark:text-stone-100">
          No saved outfits yet
        </h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1.5">
          Generate an outfit combination on the canvas and click &quot;Save Outfit&quot; to build your personal capsule lookbook.
        </p>
        <button
          onClick={onSwitchToGenerator}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Your First Outfit</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {outfits.map((outfit) => (
        <div
          key={outfit.id}
          className="rounded-3xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
        >
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-serif font-medium text-base text-stone-900 dark:text-stone-100">
                  {outfit.name}
                </h4>
                {outfit.occasion && (
                  <span className="text-xs text-stone-500 capitalize">{outfit.occasion}</span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleFavoriteOutfit(outfit.id)}
                  className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 transition"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      outfit.favorite ? 'fill-rose-500 text-rose-500' : ''
                    }`}
                  />
                </button>
                <button
                  onClick={() => removeOutfit(outfit.id)}
                  className="p-1.5 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-400 hover:text-rose-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Thumbnail Row */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {outfit.items.map((slotItem) => (
                <div
                  key={slotItem.id}
                  className="aspect-[3/4] rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 relative group"
                >
                  {slotItem.clothing_item?.image_url && (
                    <img
                      src={slotItem.clothing_item.image_url}
                      alt={slotItem.clothing_item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-1 left-1 right-1 text-[9px] truncate bg-black/60 backdrop-blur-sm text-white px-1 rounded text-center capitalize">
                    {slotItem.slot_position}
                  </span>
                </div>
              ))}
            </div>

            {/* Stylist Note */}
            {outfit.stylist_notes && (
              <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 italic bg-stone-50 dark:bg-stone-800/50 p-3 rounded-2xl">
                &ldquo;{outfit.stylist_notes}&rdquo;
              </p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span>{outfit.items.length} garments</span>
            <span>{new Date(outfit.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
