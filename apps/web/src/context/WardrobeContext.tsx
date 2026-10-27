'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClothingItem, Outfit, Profile, StylistChatMessage } from '@stylemuse/types';

export interface UserAccount {
  email: string;
  password?: string;
  profile: Profile;
  wardrobe: ClothingItem[];
  outfits: Outfit[];
  chatHistory: StylistChatMessage[];
}

interface WardrobeContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  wardrobe: ClothingItem[];
  outfits: Outfit[];
  profile: Profile;
  chatHistory: StylistChatMessage[];
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  isUploadOpen: boolean;
  setIsUploadOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  isExtractorOpen: boolean;
  setIsExtractorOpen: (open: boolean) => void;
  showOnboardingWizard: boolean;
  setShowOnboardingWizard: (show: boolean) => void;

  // Auth actions
  signUp: (email: string, password: string, fullName: string) => boolean;
  signIn: (email: string, password?: string) => boolean;
  signOut: () => void;

  // Wardrobe actions
  addClothingItem: (item: Omit<ClothingItem, 'id' | 'created_at' | 'updated_at'>) => ClothingItem;
  addMultipleClothingItems: (items: Array<Omit<ClothingItem, 'id' | 'created_at' | 'updated_at'>>) => void;
  removeClothingItem: (id: string) => void;
  toggleFavoriteItem: (id: string) => void;
  clearWardrobe: () => void;
  seedStarterWardrobe: () => void;

  // Outfit actions
  saveOutfit: (outfit: Omit<Outfit, 'id' | 'created_at' | 'updated_at'>) => Outfit;
  removeOutfit: (id: string) => void;
  toggleFavoriteOutfit: (id: string) => void;

  // Profile & Chat
  updateProfile: (profile: Partial<Profile>) => void;
  addChatMessage: (sender: 'user' | 'stylist', content: string, suggestedOutfit?: any) => void;
}

// Clean flat-lay studio mock-ups for starter wardrobe (no person, pure e-commerce product shots)
export const STARTER_MOCKUP_WARDROBE: ClothingItem[] = [
  {
    id: 'starter-1',
    user_id: 'default',
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
    ai_metadata: { confidence_score: 0.98, is_mockup: true },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'starter-2',
    user_id: 'default',
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
    ai_metadata: { confidence_score: 0.94, is_mockup: true },
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'starter-3',
    user_id: 'default',
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
    ai_metadata: { confidence_score: 0.96, is_mockup: true },
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'starter-4',
    user_id: 'default',
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
    ai_metadata: { confidence_score: 0.95, is_mockup: true },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: React.ReactNode }) {
  // Current active user
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Active user's state
  const [wardrobe, setWardrobe] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [profile, setProfile] = useState<Profile>({
    id: 'anonymous',
    email: '',
    full_name: '',
    gender_preference: 'unspecified',
    style_archetypes: ['minimalist'],
    color_preferences: ['navy', 'cream'],
    color_dislikes: [],
    body_shape: 'unspecified',
    onboarding_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });
  const [chatHistory, setChatHistory] = useState<StylistChatMessage[]>([]);

  // UI state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isExtractorOpen, setIsExtractorOpen] = useState(false);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

  // Helper to get all users from localStorage
  const getUsersDB = (): Record<string, UserAccount> => {
    try {
      const data = localStorage.getItem('stylemuse_users_db');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  // Helper to persist user account
  const saveUserToDB = (user: UserAccount) => {
    try {
      const db = getUsersDB();
      db[user.email.toLowerCase()] = user;
      localStorage.setItem('stylemuse_users_db', JSON.stringify(db));
    } catch (e) {
      console.warn('Failed to save to users DB:', e);
    }
  };

  // Initialize session on mount
  useEffect(() => {
    try {
      const activeEmail = localStorage.getItem('stylemuse_active_user_email');
      if (activeEmail) {
        const db = getUsersDB();
        const existing = db[activeEmail.toLowerCase()];
        if (existing) {
          loadUserSession(existing);
        }
      }
    } catch (e) {
      console.warn('Session init error:', e);
    }
  }, []);

  const loadUserSession = (user: UserAccount) => {
    setCurrentUser(user);
    setWardrobe(user.wardrobe || []);
    setOutfits(user.outfits || []);
    setProfile(user.profile);

    // Personalized greeting matching user's actual FIRST name strictly
    const firstName = getFirstName(user.profile.full_name, user.email);
    if (!user.chatHistory || user.chatHistory.length === 0) {
      const initialGreeting: StylistChatMessage = {
        id: `greeting-${Date.now()}`,
        conversation_id: 'conv-1',
        sender: 'stylist',
        content: `Hello ${firstName}! I'm Muse, your personal AI stylist. I have connected to your private wardrobe. Ask me for styling advice, outfit creation, or garment combinations anytime!`,
        created_at: new Date().toISOString(),
      };
      setChatHistory([initialGreeting]);
      user.chatHistory = [initialGreeting];
    } else {
      // Ensure the initial greeting uses the clean first name for existing sessions as well
      const sanitizedHistory = user.chatHistory.map((msg, idx) => {
        if (idx === 0 && msg.sender === 'stylist' && msg.content.startsWith('Hello ')) {
          return {
            ...msg,
            content: msg.content.replace(/^Hello\s+[^!]+!/, `Hello ${firstName}!`),
          };
        }
        return msg;
      });
      setChatHistory(sanitizedHistory);
    }

    try {
      localStorage.setItem('stylemuse_active_user_email', user.email.toLowerCase());
    } catch {}
  };

  // Sync state changes back to user account in DB
  const syncCurrentUser = (
    updatedWardrobe = wardrobe,
    updatedOutfits = outfits,
    updatedProfile = profile,
    updatedChat = chatHistory
  ) => {
    if (!currentUser) return;
    const updatedAccount: UserAccount = {
      ...currentUser,
      wardrobe: updatedWardrobe,
      outfits: updatedOutfits,
      profile: updatedProfile,
      chatHistory: updatedChat,
    };
    setCurrentUser(updatedAccount);
    saveUserToDB(updatedAccount);
  };

  // Authentication: Sign Up
  const signUp = (email: string, password = '', fullName: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim() || cleanEmail.split('@')[0];
    const db = getUsersDB();

    const newProfile: Profile = {
      id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
      email: cleanEmail,
      full_name: cleanName,
      gender_preference: 'unspecified',
      style_archetypes: ['minimalist'],
      color_preferences: ['navy', 'cream', 'charcoal'],
      color_dislikes: [],
      body_shape: 'unspecified',
      onboarding_completed: false, // Triggers onboarding walkthrough!
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const firstName = getFirstName(cleanName, cleanEmail);

    const initialGreeting: StylistChatMessage = {
      id: `greeting-${Date.now()}`,
      conversation_id: 'conv-1',
      sender: 'stylist',
      content: `Hello ${firstName}! I'm Muse, your personal AI stylist. Welcome to your private styling studio. Complete your preference profile or upload your first garment to get started!`,
      created_at: new Date().toISOString(),
    };

    // Brand new user starts with THEIR OWN EMPTY wardrobe (not shared!)
    const newUser: UserAccount = {
      email: cleanEmail,
      password,
      profile: newProfile,
      wardrobe: [],
      outfits: [],
      chatHistory: [initialGreeting],
    };

    db[cleanEmail] = newUser;
    try {
      localStorage.setItem('stylemuse_users_db', JSON.stringify(db));
    } catch {}

    loadUserSession(newUser);
    setShowOnboardingWizard(true);
    return true;
  };

  // Authentication: Sign In
  const signIn = (email: string, password = ''): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const db = getUsersDB();
    const existing = db[cleanEmail];

    if (existing) {
      loadUserSession(existing);
      return true;
    }

    // If logging in for the first time without prior sign-up, create their account
    return signUp(cleanEmail, password, cleanEmail.split('@')[0]);
  };

  // Authentication: Sign Out
  const signOut = () => {
    setCurrentUser(null);
    setWardrobe([]);
    setOutfits([]);
    setChatHistory([]);
    setProfile({
      id: 'anonymous',
      email: '',
      full_name: '',
      gender_preference: 'unspecified',
      style_archetypes: [],
      color_preferences: [],
      color_dislikes: [],
      body_shape: 'unspecified',
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    try {
      localStorage.removeItem('stylemuse_active_user_email');
    } catch {}
  };

  // Add single clothing item
  const addClothingItem = (itemData: Omit<ClothingItem, 'id' | 'created_at' | 'updated_at'>) => {
    const newItem: ClothingItem = {
      ...itemData,
      id: crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}-${Math.random()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const nextWardrobe = [newItem, ...wardrobe];
    setWardrobe(nextWardrobe);
    syncCurrentUser(nextWardrobe);
    return newItem;
  };

  // Add multiple extracted clothing mock-ups at once
  const addMultipleClothingItems = (
    itemsData: Array<Omit<ClothingItem, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    const newItems: ClothingItem[] = itemsData.map((itemData, idx) => ({
      ...itemData,
      id: crypto.randomUUID ? crypto.randomUUID() : `item-${Date.now()}-${idx}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    const nextWardrobe = [...newItems, ...wardrobe];
    setWardrobe(nextWardrobe);
    syncCurrentUser(nextWardrobe);
  };

  const removeClothingItem = (id: string) => {
    const next = wardrobe.filter((i) => i.id !== id);
    setWardrobe(next);
    syncCurrentUser(next);
  };

  const toggleFavoriteItem = (id: string) => {
    const next = wardrobe.map((i) => (i.id === id ? { ...i, favorite: !i.favorite } : i));
    setWardrobe(next);
    syncCurrentUser(next);
  };

  const clearWardrobe = () => {
    setWardrobe([]);
    syncCurrentUser([]);
  };

  const seedStarterWardrobe = () => {
    const customizedStarters = STARTER_MOCKUP_WARDROBE.map((item, idx) => ({
      ...item,
      id: `usr-item-${Date.now()}-${idx}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
    const next = [...customizedStarters, ...wardrobe];
    setWardrobe(next);
    syncCurrentUser(next);
  };

  const saveOutfit = (outfitData: Omit<Outfit, 'id' | 'created_at' | 'updated_at'>) => {
    const newOutfit: Outfit = {
      ...outfitData,
      id: crypto.randomUUID ? crypto.randomUUID() : `outfit-${Date.now()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const next = [newOutfit, ...outfits];
    setOutfits(next);
    syncCurrentUser(wardrobe, next);
    return newOutfit;
  };

  const removeOutfit = (id: string) => {
    const next = outfits.filter((o) => o.id !== id);
    setOutfits(next);
    syncCurrentUser(wardrobe, next);
  };

  const toggleFavoriteOutfit = (id: string) => {
    const next = outfits.map((o) => (o.id === id ? { ...o, favorite: !o.favorite } : o));
    setOutfits(next);
    syncCurrentUser(wardrobe, next);
  };

  const updateProfile = (updatedFields: Partial<Profile>) => {
    const nextProfile: Profile = {
      ...profile,
      ...updatedFields,
      updated_at: new Date().toISOString(),
    };
    setProfile(nextProfile);
    syncCurrentUser(wardrobe, outfits, nextProfile);
  };

  const addChatMessage = (sender: 'user' | 'stylist', content: string, suggestedOutfit?: any) => {
    const newMsg: StylistChatMessage = {
      id: crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`,
      conversation_id: 'conv-1',
      sender,
      content,
      suggested_outfit: suggestedOutfit,
      created_at: new Date().toISOString(),
    };
    const nextChat = [...chatHistory, newMsg];
    setChatHistory(nextChat);
    syncCurrentUser(wardrobe, outfits, profile, nextChat);
  };

  return (
    <WardrobeContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        wardrobe,
        outfits,
        profile,
        chatHistory,
        isChatOpen,
        setIsChatOpen,
        isUploadOpen,
        setIsUploadOpen,
        isProfileOpen,
        setIsProfileOpen,
        isExtractorOpen,
        setIsExtractorOpen,
        showOnboardingWizard,
        setShowOnboardingWizard,
        signUp,
        signIn,
        signOut,
        addClothingItem,
        addMultipleClothingItems,
        removeClothingItem,
        toggleFavoriteItem,
        clearWardrobe,
        seedStarterWardrobe,
        saveOutfit,
        removeOutfit,
        toggleFavoriteOutfit,
        updateProfile,
        addChatMessage,
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error('useWardrobe must be used within a WardrobeProvider');
  }
  return context;
}
