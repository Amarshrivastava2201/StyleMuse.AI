import { z } from 'zod';

export const StyleArchetypeSchema = z.enum([
  'minimalist',
  'streetwear',
  'classic',
  'old_money',
  'bohemian',
  'grunge',
  'athleisure',
  'smart_casual',
  'vintage',
  'eclectic',
]);
export type StyleArchetype = z.infer<typeof StyleArchetypeSchema>;

export const BodyShapeSchema = z.enum([
  'rectangle',
  'hourglass',
  'pear',
  'inverted_triangle',
  'oval',
  'athletic',
  'unspecified',
]);
export type BodyShape = z.infer<typeof BodyShapeSchema>;

export const GenderPreferenceSchema = z.enum([
  'womenswear',
  'menswear',
  'androgynous',
  'unspecified',
]);
export type GenderPreference = z.infer<typeof GenderPreferenceSchema>;

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  gender_preference: GenderPreferenceSchema.default('unspecified'),
  style_archetypes: z.array(StyleArchetypeSchema).default([]),
  color_preferences: z.array(z.string()).default([]),
  color_dislikes: z.array(z.string()).default([]),
  body_shape: BodyShapeSchema.default('unspecified'),
  budget_preference: z.string().nullable().optional(),
  onboarding_completed: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Profile = z.infer<typeof ProfileSchema>;

export const OnboardingInputSchema = z.object({
  full_name: z.string().min(1).max(100),
  gender_preference: GenderPreferenceSchema,
  style_archetypes: z.array(StyleArchetypeSchema).min(1, 'Select at least one style archetype'),
  color_preferences: z.array(z.string()).default([]),
  color_dislikes: z.array(z.string()).default([]),
  body_shape: BodyShapeSchema.default('unspecified'),
});
export type OnboardingInputDto = z.infer<typeof OnboardingInputSchema>;
