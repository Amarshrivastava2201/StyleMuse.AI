import { z } from 'zod';
import { OutfitSlotPositionSchema } from './outfit';
import { ClothingCategorySchema, FormalitySchema, SeasonSchema } from './clothing';

// Request to generate an outfit
export const GenerateOutfitRequestSchema = z.object({
  prompt: z.string().optional().describe('Freeform occasion or styling instruction (e.g., Casual Sunday gallery visit)'),
  occasion: z.string().optional().describe('Event type, e.g. date_night, work, casual, travel'),
  season: z.string().optional().describe('Season or weather vibe, e.g. autumn_rain, warm_summer'),
  locked_item_ids: z.array(z.string().uuid()).default([]).describe('Item IDs that must be included in the generated outfit'),
});
export type GenerateOutfitRequestDto = z.infer<typeof GenerateOutfitRequestSchema>;

// AI Generated Outfit Recommendation Output
export const AiOutfitRecommendationSchema = z.object({
  outfit_name: z.string().describe('Evocative and stylish name for the combination'),
  slots: z.record(OutfitSlotPositionSchema, z.string().uuid()).describe('Map of slot position to selected item UUID from user inventory'),
  stylist_notes: z.string().describe('Fashion rationale explaining why these pieces harmonize well (color theory, proportions, aesthetic)'),
  vibe_keywords: z.array(z.string()).describe('Stylistic keywords, e.g. Minimalist, Parisian, Relaxed'),
  weather_suitability: z.string().optional().describe('Contextual weather advice'),
});
export type AiOutfitRecommendation = z.infer<typeof AiOutfitRecommendationSchema>;

// Stylist Chat
export const StylistChatMessageSchema = z.object({
  id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  sender: z.enum(['user', 'stylist']),
  content: z.string(),
  suggested_outfit: AiOutfitRecommendationSchema.nullable().optional(),
  created_at: z.string().datetime(),
});
export type StylistChatMessage = z.infer<typeof StylistChatMessageSchema>;

export const SendStylistMessageRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty'),
  conversation_id: z.string().uuid().optional(),
});
export type SendStylistMessageRequestDto = z.infer<typeof SendStylistMessageRequestSchema>;

// Multi-Garment Outfit Deconstruction & Person Removal Schema
export const DeconstructedItemMockupSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ClothingCategorySchema,
  subcategory: z.string(),
  primary_color: z.string(),
  material: z.string().optional(),
  formality: FormalitySchema,
  seasons: z.array(SeasonSchema),
  mockup_image_url: z.string(),
  confidence: z.number().min(0).max(1),
});
export type DeconstructedItemMockup = z.infer<typeof DeconstructedItemMockupSchema>;

export const DeconstructOutfitResponseSchema = z.object({
  outfit_description: z.string(),
  detected_items_count: z.number(),
  items: z.array(DeconstructedItemMockupSchema),
});
export type DeconstructOutfitResponse = z.infer<typeof DeconstructOutfitResponseSchema>;

