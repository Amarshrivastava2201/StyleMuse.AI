import { z } from 'zod';

export const ClothingCategorySchema = z.enum([
  'tops',
  'bottoms',
  'one-piece',
  'outerwear',
  'footwear',
  'accessories',
]);
export type ClothingCategory = z.infer<typeof ClothingCategorySchema>;

export const FormalitySchema = z.enum([
  'casual',
  'smart_casual',
  'business',
  'formal',
  'athletic',
]);
export type Formality = z.infer<typeof FormalitySchema>;

export const SeasonSchema = z.enum([
  'spring',
  'summer',
  'fall',
  'winter',
]);
export type Season = z.infer<typeof SeasonSchema>;

export const PatternSchema = z.enum([
  'solid',
  'striped',
  'plaid',
  'floral',
  'checkered',
  'polka_dot',
  'graphic',
  'animal',
  'other',
]);
export type Pattern = z.infer<typeof PatternSchema>;

export const FitSchema = z.enum([
  'tight',
  'slim',
  'regular',
  'relaxed',
  'oversized',
]);
export type Fit = z.infer<typeof FitSchema>;

// Full database Clothing Item Schema
export const ClothingItemSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  image_url: z.string().url(),
  thumbnail_url: z.string().url().nullable().optional(),
  name: z.string().min(1).max(100),
  category: ClothingCategorySchema,
  subcategory: z.string().min(1).max(50),
  primary_color: z.string().min(1).max(30),
  secondary_colors: z.array(z.string()).default([]),
  pattern: PatternSchema.default('solid'),
  material: z.string().nullable().optional(),
  formality: FormalitySchema.default('casual'),
  seasons: z.array(SeasonSchema).default([]),
  fit: FitSchema.nullable().optional(),
  brand: z.string().nullable().optional(),
  favorite: z.boolean().default(false),
  ai_metadata: z.record(z.unknown()).default({}),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type ClothingItem = z.infer<typeof ClothingItemSchema>;

// DTO for creating clothing item
export const CreateClothingItemSchema = ClothingItemSchema.omit({
  id: true,
  user_id: true,
  created_at: true,
  updated_at: true,
}).partial({
  thumbnail_url: true,
  material: true,
  fit: true,
  brand: true,
  favorite: true,
  ai_metadata: true,
});
export type CreateClothingItemDto = z.infer<typeof CreateClothingItemSchema>;

// AI Vision Extraction Output Schema
export const AiClothingAnalysisResultSchema = z.object({
  name: z.string().describe('Suggested concise name for garment, e.g. White Oxford Cotton Shirt'),
  category: ClothingCategorySchema.describe('High-level clothing category'),
  subcategory: z.string().describe('Specific item type, e.g. trench_coat, hoodie, pleated_skirt, chelsea_boots'),
  primary_color: z.string().describe('Main dominant color name'),
  secondary_colors: z.array(z.string()).describe('Accent or secondary colors'),
  pattern: PatternSchema.describe('Visual pattern on the garment'),
  material: z.string().nullable().describe('Estimated dominant fabric/material, e.g. denim, wool, linen, silk, cotton'),
  formality: FormalitySchema.describe('Formality rating for styling context'),
  seasons: z.array(SeasonSchema).describe('Seasons suitable to wear this garment'),
  fit: FitSchema.nullable().describe('Visual cut or silhouette'),
  confidence_score: z.number().min(0).max(1).optional().describe('Model confidence in assessment'),
});
export type AiClothingAnalysisResult = z.infer<typeof AiClothingAnalysisResultSchema>;
