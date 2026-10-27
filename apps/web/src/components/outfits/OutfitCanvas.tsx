'use client';

import React, { useState, useEffect } from 'react';
import { useWardrobe } from '@/context/WardrobeContext';
import { ClothingItem, ClothingCategory, OutfitSlotPosition } from '@stylemuse/types';
import { SwapItemDrawer } from './SwapItemDrawer';
import {
  Wand2,
  RefreshCw,
  BookmarkPlus,
  Sparkles,
  ArrowRightLeft,
  Check,
  Compass,
} from 'lucide-react';

const OCCASIONS = [
  'Effortless Everyday Minimal',
  'Smart Casual Office & Dinner',
  'Autumn Weekend Gallery Stroll',
  'Summer Evening Drinks',
  'Clean Monochrome Capsule',
];

export const OutfitCanvas: React.FC = () => {
  const { wardrobe, profile, saveOutfit } = useWardrobe();

  const [occasion, setOccasion] = useState(OCCASIONS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Selected Slots: Map of slot name to ClothingItem
  const [selectedTop, setSelectedTop] = useState<ClothingItem | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<ClothingItem | null>(null);
  const [selectedOuterwear, setSelectedOuterwear] = useState<ClothingItem | null>(null);
  const [selectedShoes, setSelectedShoes] = useState<ClothingItem | null>(null);
  const [selectedDress, setSelectedDress] = useState<ClothingItem | null>(null);

  const [stylistNotes, setStylistNotes] = useState('');
  const [vibeKeywords, setVibeKeywords] = useState<string[]>([]);

  // Swap Drawer State
  const [swapSlot, setSwapSlot] = useState<{
    category: ClothingCategory;
    currentId?: string;
  } | null>(null);

  // Initial generation on first mount if wardrobe has items
  useEffect(() => {
    if (wardrobe.length > 0 && !selectedTop && !selectedBottom && !selectedDress) {
      generateLook();
    }
  }, [wardrobe]);

  const generateLook = async (promptOverride?: string) => {
    setIsGenerating(true);
    setSavedSuccess(false);

    const activePrompt = promptOverride || customPrompt || occasion;

    try {
      // 1. Try backend API call
      let outfitResult: any;

      try {
        const res = await fetch('http://localhost:4000/ai/generate-outfit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: activePrompt }),
        });
        if (res.ok) {
          outfitResult = await res.json();
        } else {
          throw new Error('API offline');
        }
      } catch (e) {
        // Fallback local smart algorithm
        await new Promise((r) => setTimeout(r, 600));

        const tops = wardrobe.filter((i) => i.category === 'tops');
        const bottoms = wardrobe.filter((i) => i.category === 'bottoms');
        const dresses = wardrobe.filter((i) => i.category === 'one-piece');
        const shoes = wardrobe.filter((i) => i.category === 'footwear');
        const outerwear = wardrobe.filter((i) => i.category === 'outerwear');

        const useDress = dresses.length > 0 && Math.random() > 0.6;

        outfitResult = {
          outfit_name: activePrompt,
          slots: {
            ...(useDress
              ? { 'one-piece': dresses[0].id }
              : {
                  top: tops[Math.floor(Math.random() * tops.length)]?.id,
                  bottom: bottoms[Math.floor(Math.random() * bottoms.length)]?.id,
                }),
            shoes: shoes[Math.floor(Math.random() * shoes.length)]?.id,
            outerwear:
              outerwear.length > 0 && Math.random() > 0.3
                ? outerwear[Math.floor(Math.random() * outerwear.length)]?.id
                : undefined,
          },
          stylist_notes: `By pairing the ${
            useDress ? 'flowing one-piece' : 'structured top'
          } with complementary footwear, this look maintains effortless proportions suitable for ${activePrompt.toLowerCase()}. A restrained neutral color palette elevates the silhouette.`,
          vibe_keywords: ['balanced', 'intentional', 'contemporary'],
        };
      }

      // Map IDs back to real wardrobe items
      const findItem = (id?: string) => wardrobe.find((i) => i.id === id) || null;

      if (outfitResult.slots['one-piece']) {
        setSelectedDress(findItem(outfitResult.slots['one-piece']));
        setSelectedTop(null);
        setSelectedBottom(null);
      } else {
        setSelectedDress(null);
        setSelectedTop(findItem(outfitResult.slots['top']));
        setSelectedBottom(findItem(outfitResult.slots['bottom']));
      }

      setSelectedOuterwear(findItem(outfitResult.slots['outerwear']));
      setSelectedShoes(findItem(outfitResult.slots['shoes']));
      setStylistNotes(outfitResult.stylist_notes);
      setVibeKeywords(outfitResult.vibe_keywords || ['tailored', 'minimalist']);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveCurrentOutfit = () => {
    const items: Array<{ clothing_item_id: string; slot_position: OutfitSlotPosition }> = [];

    if (selectedDress) items.push({ clothing_item_id: selectedDress.id, slot_position: 'one-piece' });
    if (selectedTop) items.push({ clothing_item_id: selectedTop.id, slot_position: 'top' });
    if (selectedBottom) items.push({ clothing_item_id: selectedBottom.id, slot_position: 'bottom' });
    if (selectedOuterwear) items.push({ clothing_item_id: selectedOuterwear.id, slot_position: 'outerwear' });
    if (selectedShoes) items.push({ clothing_item_id: selectedShoes.id, slot_position: 'shoes' });

    if (items.length === 0) return;

    saveOutfit({
      user_id: profile.id,
      name: customPrompt || occasion,
      occasion,
      stylist_notes: stylistNotes,
      favorite: true,
      items: items.map((i) => ({
        id: crypto.randomUUID(),
        outfit_id: '',
        clothing_item_id: i.clothing_item_id,
        slot_position: i.slot_position,
        clothing_item: wardrobe.find((w) => w.id === i.clothing_item_id),
        created_at: new Date().toISOString(),
      })),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full">
      {/* Occasion / Prompt Bar */}
      <div className="p-6 rounded-3xl bg-stone-100 dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 mb-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block mb-2">
              Select or describe an occasion:
            </span>
            <div className="flex flex-wrap gap-2">
              {OCCASIONS.map((occ) => (
                <button
                  key={occ}
                  onClick={() => {
                    setOccasion(occ);
                    generateLook(occ);
                  }}
                  className={`text-xs px-3.5 py-1.5 rounded-full border transition ${
                    occasion === occ && !customPrompt
                      ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent font-medium shadow-sm'
                      : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => generateLook()}
            disabled={isGenerating || wardrobe.length === 0}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-medium bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90 transition shadow-sm disabled:opacity-50 self-start md:self-auto"
          >
            <Wand2 className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Curating Look...' : 'Generate New Look'}</span>
          </button>
        </div>
      </div>

      {/* Outfit Canvas Display */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Visual Canvas (2 cols) */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
            <div className="flex items-center justify-between pb-6 border-b border-stone-100 dark:border-stone-800 mb-6">
              <div>
                <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold uppercase tracking-wider">
                  AI Wardrobe Synthesis
                </span>
                <h3 className="text-xl font-serif font-medium text-stone-900 dark:text-stone-100 mt-0.5">
                  {occasion}
                </h3>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateLook()}
                  className="p-2.5 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition"
                  title="Reshuffle Look"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSaveCurrentOutfit}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium transition ${
                    savedSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 hover:opacity-90'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Save Outfit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Outerwear Slot */}
              <div className="flex flex-col">
                <span className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider text-center">
                  Layer
                </span>
                {selectedOuterwear ? (
                  <SlotCard
                    item={selectedOuterwear}
                    onSwap={() =>
                      setSwapSlot({ category: 'outerwear', currentId: selectedOuterwear.id })
                    }
                  />
                ) : (
                  <EmptySlot
                    label="Optional Coat"
                    category="outerwear"
                    onAdd={() => setSwapSlot({ category: 'outerwear' })}
                  />
                )}
              </div>

              {/* Top or Dress Slot */}
              {selectedDress ? (
                <div className="flex flex-col col-span-2">
                  <span className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider text-center">
                    One-Piece Dress
                  </span>
                  <SlotCard
                    item={selectedDress}
                    onSwap={() =>
                      setSwapSlot({ category: 'one-piece', currentId: selectedDress.id })
                    }
                  />
                </div>
              ) : (
                <>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider text-center">
                      Top
                    </span>
                    {selectedTop ? (
                      <SlotCard
                        item={selectedTop}
                        onSwap={() => setSwapSlot({ category: 'tops', currentId: selectedTop.id })}
                      />
                    ) : (
                      <EmptySlot
                        label="Add Top"
                        category="tops"
                        onAdd={() => setSwapSlot({ category: 'tops' })}
                      />
                    )}
                  </div>

                  {/* Bottom Slot */}
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider text-center">
                      Bottom
                    </span>
                    {selectedBottom ? (
                      <SlotCard
                        item={selectedBottom}
                        onSwap={() =>
                          setSwapSlot({ category: 'bottoms', currentId: selectedBottom.id })
                        }
                      />
                    ) : (
                      <EmptySlot
                        label="Add Bottom"
                        category="bottoms"
                        onAdd={() => setSwapSlot({ category: 'bottoms' })}
                      />
                    )}
                  </div>
                </>
              )}

              {/* Footwear Slot */}
              <div className="flex flex-col">
                <span className="text-xs font-medium text-stone-400 mb-2 uppercase tracking-wider text-center">
                  Footwear
                </span>
                {selectedShoes ? (
                  <SlotCard
                    item={selectedShoes}
                    onSwap={() =>
                      setSwapSlot({ category: 'footwear', currentId: selectedShoes.id })
                    }
                  />
                ) : (
                  <EmptySlot
                    label="Add Shoes"
                    category="footwear"
                    onAdd={() => setSwapSlot({ category: 'footwear' })}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stylist Rationale Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/60">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 mb-3">
              <Sparkles className="w-4 h-4" />
              <h4 className="text-sm font-semibold font-serif">Stylist Editorial Notes</h4>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
              {stylistNotes ||
                'This combination uses tonal balance and contrasting fabric weights to create a cohesive look that flatters proportions while staying true to your personal preferences.'}
            </p>

            {/* Vibe Tags */}
            <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-amber-200/60 dark:border-amber-900/40">
              {vibeKeywords.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-100/80 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 capitalize"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400">
            <h5 className="font-semibold text-stone-900 dark:text-stone-100 mb-1.5 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-stone-500" />
              <span>Interactive Wardrobe Linking</span>
            </h5>
            <p className="leading-relaxed">
              Every item in this outfit is pulled directly from your digitized wardrobe. Tap
              &quot;Swap&quot; on any piece to test alternative footwear, tops, or layers.
            </p>
          </div>
        </div>
      </div>

      {/* Swap Item Drawer */}
      {swapSlot && (
        <SwapItemDrawer
          isOpen={!!swapSlot}
          category={swapSlot.category}
          currentSelectedId={swapSlot.currentId}
          onClose={() => setSwapSlot(null)}
          onSelect={(newItem) => {
            if (newItem.category === 'tops') setSelectedTop(newItem);
            if (newItem.category === 'bottoms') setSelectedBottom(newItem);
            if (newItem.category === 'outerwear') setSelectedOuterwear(newItem);
            if (newItem.category === 'footwear') setSelectedShoes(newItem);
            if (newItem.category === 'one-piece') {
              setSelectedDress(newItem);
              setSelectedTop(null);
              setSelectedBottom(null);
            }
          }}
        />
      )}
    </div>
  );
};

interface SlotCardProps {
  item: ClothingItem;
  onSwap: () => void;
}

const SlotCard: React.FC<SlotCardProps> = ({ item, onSwap }) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 shadow-sm hover:shadow transition">
      <div className="aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-800 relative">
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Swap Overlay Button */}
        <button
          onClick={onSwap}
          className="absolute inset-0 bg-stone-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-1.5 text-white text-xs font-medium"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Swap Piece</span>
        </button>
      </div>

      <div className="p-2.5">
        <h5 className="text-xs font-medium text-stone-900 dark:text-stone-100 truncate">
          {item.name}
        </h5>
        <span className="text-[10px] text-stone-500 capitalize">
          {item.subcategory.replace('_', ' ')}
        </span>
      </div>
    </div>
  );
};

const EmptySlot: React.FC<{ label: string; category: string; onAdd: () => void }> = ({
  label,
  onAdd,
}) => {
  return (
    <button
      onClick={onAdd}
      className="aspect-[3/4] w-full rounded-2xl border-2 border-dashed border-stone-200 dark:border-stone-800 hover:border-amber-600 flex flex-col items-center justify-center gap-1 text-stone-400 hover:text-amber-600 transition p-4 bg-stone-50/50 dark:bg-stone-850/50"
    >
      <ArrowRightLeft className="w-4 h-4 mb-1" />
      <span className="text-[11px] font-medium">{label}</span>
    </button>
  );
};
