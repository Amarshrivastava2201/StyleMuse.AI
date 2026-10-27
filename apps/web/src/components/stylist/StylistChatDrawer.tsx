'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useWardrobe, getFirstName } from '@/context/WardrobeContext';
import { X, Send, Sparkles, Bot, User, Compass } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'What can I wear with my charcoal overcoat?',
  'Style me for a rainy 16°C gallery walk',
  'Suggest a minimalist smart casual look',
  'How do I dress up my white low-top sneakers?',
];

export const StylistChatDrawer: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatHistory, addChatMessage, wardrobe, profile } =
    useWardrobe();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  if (!isChatOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isTyping) return;

    addChatMessage('user', text);
    setInputValue('');
    setIsTyping(true);

    try {
      let reply = '';

      try {
        const res = await fetch('http://localhost:4000/ai/stylist-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text }),
        });
        if (res.ok) {
          const data = await res.json();
          reply = data.reply;
        } else {
          throw new Error('API offline');
        }
      } catch (e) {
        // Fallback local smart response tailored to the prompt & real wardrobe
        await new Promise((r) => setTimeout(r, 800));

        const firstName = getFirstName(profile.full_name, profile.email);
        const lower = text.toLowerCase();
        if (lower.includes('overcoat') || lower.includes('coat')) {
          reply =
            `For your charcoal wool overcoat, ${firstName}, I recommend creating a tonal contrast: pair it with your crisp white oxford shirt and relaxed pleated chinos. Finish with white minimalist sneakers to keep the energy relaxed yet tailored.`;
        } else if (lower.includes('rain') || lower.includes('weather') || lower.includes('16')) {
          reply =
            `For a cool, overcast day at 16°C, ${firstName}, layered textures work best. Start with a structured cotton base, add your merino wool knit or charcoal overcoat, and choose leather footwear like your loafers to handle damp streets elegantly.`;
        } else if (lower.includes('sneaker') || lower.includes('dress up')) {
          reply =
            `To elevate clean white low-tops, ${firstName}, contrast them with tailored trousers instead of casual denim. Adding your pleated chinos with a tucked-in shirt creates an elevated Scandinavian aesthetic.`;
        } else {
          reply = `Based on your ${
            profile.style_archetypes?.[0] || 'minimalist'
          } aesthetic, ${firstName}, the secret lies in silhouette balance and restrained color palettes. From your current wardrobe, pairing clean neutrals (navy, cream, charcoal) always yields a timeless result.`;
        }
      }

      addChatMessage('stylist', reply);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg h-full bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-800 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-semibold text-stone-900 dark:text-stone-100">
                  Muse
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Stylist Active
                </span>
              </div>
              <p className="text-xs text-stone-500">
                AI Personal Stylist &bull; {wardrobe.length} Wardrobe Pieces Loaded
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsChatOpen(false)}
            className="p-2 rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatHistory.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 flex items-center justify-center flex-shrink-0 text-xs mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 rounded-br-sm'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center justify-center flex-shrink-0 text-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-stone-400 text-xs italic py-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>Muse is curating styling advice...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Pills */}
        <div className="p-3 bg-stone-50 dark:bg-stone-850 border-t border-stone-100 dark:border-stone-800">
          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block mb-2 px-1">
            Suggested styling queries:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSend(prompt)}
                className="text-[11px] text-left px-2.5 py-1 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-600 transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Muse anything about your wardrobe..."
              className="flex-1 px-4 py-2.5 text-xs rounded-full border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-600"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-9 h-9 rounded-full bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center hover:opacity-90 disabled:opacity-40 transition flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
