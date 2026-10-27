'use client';

import React from 'react';
import { useWardrobe } from '@/context/WardrobeContext';
import { ClothingItem, ClothingCategory } from '@stylemuse/types';
import { X, Check } from 'lucide-react';

interface SwapItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category: ClothingCategory;
  currentSelectedId?: string;
  onSelect: (item: ClothingItem) => void;
}

export const SwapItemDrawer: React.FC<SwapItemDrawerProps> = ({
  isOpen,
  onClose,
  category,
  currentSelectedId,
  onSelect,
}) => {
  const { wardrobe } = useWardrobe();

  if (!isOpen) return null;

  const eligibleItems = wardrobe.filter((i) => i.category === category);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md h-full bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="font-serif font-semibold text-stone-900 dark:text-stone-100 capitalize">
              Swap {category}
            </h3>
            <p className="text-xs text-stone-500">
              Select another piece from your wardrobe for this slot.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {eligibleItems.length > 0 ? (
            eligibleItems.map((item) => {
              const isSelected = item.id === currentSelectedId;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-amber-600'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-400 dark:hover:border-stone-600'
                  }`}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-20 rounded-xl object-cover bg-stone-100 dark:bg-stone-800 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-stone-900 dark:text-stone-100 truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-stone-500 capitalize mt-0.5">
                      {item.subcategory.replace('_', ' ')} &bull; {item.primary_color}
                    </p>
                    <span className="inline-block mt-2 text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                      {item.formality.replace('_', ' ')}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 text-xs text-stone-500">
              No other {category} in your wardrobe. Upload more to expand options!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
