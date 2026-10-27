import { z } from 'zod';
import { ClothingItemSchema } from './clothing';

export const OutfitSlotPositionSchema = z.enum([
  'top',
  'bottom',
  'one-piece',
  'outerwear',
  'shoes',
  'bag',
  'accessory_1',
  'accessory_2',
]);
export type OutfitSlotPosition = z.infer<typeof OutfitSlotPositionSchema>;

export const OutfitItemSchema = z.object({
  id: z.string().uuid(),
  outfit_id: z.string().uuid(),
  clothing_item_id: z.string().uuid(),
  slot_position: OutfitSlotPositionSchema,
  clothing_item: ClothingItemSchema.optional(),
  created_at: z.string().datetime(),
});
export type OutfitItem = z.infer<typeof OutfitItemSchema>;

export const OutfitSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().nullable().optional(),
  occasion: z.string().nullable().optional(),
  season: z.string().nullable().optional(),
  stylist_notes: z.string().nullable().optional(),
  favorite: z.boolean().default(false),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  items: z.array(OutfitItemSchema).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Outfit = z.infer<typeof OutfitSchema>;

export const CreateOutfitSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  occasion: z.string().optional(),
  season: z.string().optional(),
  stylist_notes: z.string().optional(),
  items: z.array(
    z.object({
      clothing_item_id: z.string().uuid(),
      slot_position: OutfitSlotPositionSchema,
    })
  ).min(1, 'An outfit must contain at least one clothing item'),
});
export type CreateOutfitDto = z.infer<typeof CreateOutfitSchema>;

export const SwapOutfitItemSchema = z.object({
  slot_position: OutfitSlotPositionSchema,
  new_clothing_item_id: z.string().uuid(),
});
export type SwapOutfitItemDto = z.infer<typeof SwapOutfitItemSchema>;
