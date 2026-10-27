import React, { createContext, useContext, useState } from 'react';
import { ClothingItem, Outfit, Profile, StylistChatMessage, StyleArchetype } from '@stylemuse/types';

interface MobileWardrobeContextType {
  wardrobe: ClothingItem[];
  outfits: Outfit[];
  profile: Profile;
  chatHistory: StylistChatMessage[];
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'created_at' | 'updated_at'>) => ClothingItem;
  removeClothingItem: (id: string) => void;
  toggleFavoriteItem: (id: string) => void;
  saveOutfit: (outfit: Omit<Outfit, 'id' | 'created_at' | 'updated_at'>) => Outfit;
  updateProfile: (profile: Partial<Profile>) => void;
  addChatMessage: (sender: 'user' | 'stylist', content: string) => void;
}

const SEED_WARDROBE: ClothingItem[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Crisp Oxford Cotton Shirt',
    category: 'tops',
    subcategory: 'button_down',
    primary_color: 'white',
    secondary_colors: [],
    pattern: 'solid',
    material: 'cotton',
    formality: 'smart_casual',
    seasons: ['spring', 'summer', 'fall'],
    fit: 'regular',
    favorite: true,
    image_url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    ai_metadata: { confidence_score: 0.98 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Relaxed Pleated Chinos',
    category: 'bottoms',
    subcategory: 'chinos',
    primary_color: 'khaki',
    secondary_colors: [],
    pattern: 'solid',
    material: 'cotton',
    formality: 'smart_casual',
    seasons: ['spring', 'summer', 'fall'],
    fit: 'relaxed',
    favorite: true,
    image_url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    ai_metadata: { confidence_score: 0.94 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Minimalist Leather Low-Tops',
    category: 'footwear',
    subcategory: 'sneakers',
    primary_color: 'white',
    secondary_colors: ['grey'],
    pattern: 'solid',
    material: 'leather',
    formality: 'casual',
    seasons: ['spring', 'summer', 'fall', 'winter'],
    fit: 'regular',
    favorite: false,
    image_url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80',
    ai_metadata: { confidence_score: 0.96 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    user_id: '00000000-0000-0000-0000-000000000001',
    name: 'Tailored Wool Overcoat',
    category: 'outerwear',
    subcategory: 'overcoat',
    primary_color: 'charcoal',
    secondary_colors: [],
    pattern: 'solid',
    material: 'wool',
    formality: 'business',
    seasons: ['fall', 'winter'],
    fit: 'regular',
    favorite: true,
    image_url: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    ai_metadata: { confidence_score: 0.95 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const DEFAULT_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'alex@stylemuse.ai',
  full_name: 'Alex Morgan',
  gender_preference: 'unspecified',
  style_archetypes: ['minimalist', 'smart_casual'],
  color_preferences: ['navy', 'cream', 'charcoal'],
  color_dislikes: ['neon_green'],
  body_shape: 'athletic',
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function getFirstName(fullName?: string | null, email?: string | null): string {
  if (fullName && fullName.trim()) {
    const firstWord = fullName.trim().split(/\s+/)[0];
    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
  }
  if (email && email.trim()) {
    const localPart = email.split('@')[0];
    const firstWord = localPart.split(/[._-]/)[0];
    return firstWord ? firstWord.charAt(0).toUpperCase() + firstWord.slice(1) : 'there';
  }
  return 'there';
}

const MobileWardrobeContext = createContext<MobileWardrobeContextType | undefined>(undefined);

export function MobileWardrobeProvider({ children }: { children: React.ReactNode }) {
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>(SEED_WARDROBE);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const initialFirstName = getFirstName(DEFAULT_PROFILE.full_name, DEFAULT_PROFILE.email);
  const [chatHistory, setChatHistory] = useState<StylistChatMessage[]>([
    {
      id: 'msg-1',
      conversation_id: 'conv-1',
      sender: 'stylist',
      content:
        `Hi ${initialFirstName}! I'm Muse, your mobile AI stylist. I have cataloged your wardrobe. Tap any outfit occasion or ask me for look combinations anytime!`,
      created_at: new Date().toISOString(),
    },
  ]);

  const addClothingItem = (itemData: Omit<ClothingItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: ClothingItem = {
      ...itemData,
      id: `item-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setWardrobe((prev) => [newItem, ...prev]);
    return newItem;
  };

  const removeClothingItem = (id: string) => {
    setWardrobe((prev) => prev.filter((i) => i.id !== id));
  };

  const toggleFavoriteItem = (id: string) => {
    setWardrobe((prev) =>
      prev.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i))
    );
  };

  const saveOutfit = (outfitData: Omit<Outfit, 'id' | 'created_at' | 'updated_at'>) => {
    const newOutfit: Outfit = {
      ...outfitData,
      id: `outfit-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setOutfits((prev) => [newOutfit, ...prev]);
    return newOutfit;
  };

  const updateProfile = (fields: Partial<Profile>) => {
    setProfile((prev) => ({ ...prev, ...fields, updated_at: new Date().toISOString() }));
  };

  const addChatMessage = (sender: 'user' | 'stylist', content: string) => {
    const newMsg: StylistChatMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: 'conv-1',
      sender,
      content,
      created_at: new Date().toISOString(),
    };
    setChatHistory((prev) => [...prev, newMsg]);
  };

  return (
    <MobileWardrobeContext.Provider
      value={{
        wardrobe,
        outfits,
        profile,
        chatHistory,
        addClothingItem,
        removeClothingItem,
        toggleFavoriteItem,
        saveOutfit,
        updateProfile,
        addChatMessage,
      }}
    >
      {children}
    </MobileWardrobeContext.Provider>
  );
}

export function useMobileWardrobe() {
  const context = useContext(MobileWardrobeContext);
  if (!context) {
    throw new Error('useMobileWardrobe must be used within a MobileWardrobeProvider');
  }
  return context;
}
