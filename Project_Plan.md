# StyleMuse AI - Architecture Specification & Project Plan

**Author:** Antigravity Senior Engineering Team  
**Status:** Approved Architecture Draft  
**Target:** MVP Release (Phase 1)  

---

## 1. Executive Summary & Vision

**StyleMuse AI** is an intelligent personal styling and wardrobe curation platform. It bridges digital wardrobe management with multi-modal AI intelligence, empowering users to:
1. Digitally catalog their real clothes with zero tedious manual tagging (AI Vision auto-extraction).
2. Receive tailored fashion advice and daily outfit combinations constructed exclusively from clothes they actually own.
3. Save, edit, and experiment with outfit combinations.

The long-term vision scales into virtual try-on (VTON), smart shopping discovery, suitcase packing assistant, calendar-based outfit scheduling, and a social fashion community.

---

## 2. Environment Audit & Infrastructure Constraints

| Component | Detected Version | Recommended Target | Status / Action Item |
| :--- | :--- | :--- | :--- |
| **OS** | Windows 11 | Windows 11 | Supported |
| **Workspace Path** | `C:\Users\Amar\OneDrive\Desktop\...` | `C:\dev\StyleMuse` or excluded sync | **HIGH RISK**: OneDrive sync locks `node_modules` and symlinks. Recommend moving or excluding sync. |
| **Node.js** | `v24.13.0` | `v20.x` or `v22.x` (LTS) | **WARNING**: Node 24 is bleeding-edge. Metro bundler in Expo SDK 52 can experience breaking incompatibilities. |
| **Package Manager**| `pnpm 12.11.2` / `npm 11.6.2` | `pnpm` (with `node-linker=hoisted`) | Supported with proper `.npmrc` configuration for React Native. |
| **Git** | `2.52.0.windows.1` | Git (with `core.longpaths true`) | Configure `git config core.longpaths true` to handle deep monorepo paths. |

---

## 3. High-Level System Architecture

We employ a **Turborepo + pnpm Monorepo** architecture ensuring 100% TypeScript type-safety from database to mobile and web frontends.

```
StyleMuse (Root)
├── apps/
│   ├── web/               # Next.js 15 (App Router, Tailwind CSS, shadcn/ui, Supabase SSR)
│   ├── mobile/            # Expo SDK 52 (Expo Router, React Native Paper / Tailwind, Supabase JS)
│   └── api/               # NestJS 11 (Modular backend, Swagger OpenAPI, Supabase Auth Guards)
├── packages/
│   ├── types/             # Shared TypeScript schemas, DTOs, Enums, and API contracts
│   ├── ai-engine/         # Multimodal prompts, Zod validation schemas, outfit synthesis logic
│   ├── database/          # Supabase SQL migrations, seed scripts, generated DB types
│   ├── config/            # Shared ESLint, Prettier, and TypeScript configurations
├── supabase/              # Local Supabase CLI configuration, migrations, and storage buckets
├── .npmrc                 # Hoisting configuration for React Native Metro compatibility
├── turbo.json             # Build cache and pipeline orchestrator
└── package.json           # Workspace root
```

### Why NestJS Backend instead of Serverless-Only?
- **Shared API for Web and Mobile:** Avoids duplicate business logic across Next.js Server Actions and Mobile API clients.
- **Heavy AI Orchestration:** Outfit generation requires multi-step prompt chains, image pre-processing, vector similarity search, rate limiting, and token budget tracking.
- **Enterprise-Grade Testing:** NestJS dependency injection allows mocking external AI and Supabase services with 100% unit and integration test coverage.

---

## 4. Database Schema (Supabase PostgreSQL)

```sql
-- 1. Profiles (extending Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  gender_preference text,
  style_archetypes text[] default '{}',     -- e.g. ['minimalist', 'streetwear', 'classic']
  color_preferences text[] default '{}',     -- preferred color palettes
  color_dislikes text[] default '{}',        -- avoided colors
  body_shape text,
  budget_preference text,
  onboarding_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Clothing Items (Digital Wardrobe)
create table public.clothing_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  image_url text not null,
  thumbnail_url text,
  name text,
  category text not null,                   -- 'tops', 'bottoms', 'one-piece', 'outerwear', 'footwear', 'accessories'
  subcategory text not null,                -- 'oxford_shirt', 'trench_coat', 'chelsea_boots', etc.
  primary_color text not null,
  secondary_colors text[] default '{}',
  pattern text default 'solid',             -- 'solid', 'striped', 'floral', 'plaid', etc.
  material text,                            -- 'cotton', 'denim', 'wool', 'linen', 'leather'
  formality text not null,                  -- 'casual', 'smart_casual', 'business', 'formal', 'athletic'
  seasons text[] default '{}',              -- ['spring', 'summer', 'fall', 'winter']
  fit text,                                 -- 'oversized', 'regular', 'slim'
  brand text,
  favorite boolean default false,
  ai_metadata jsonb default '{}'::jsonb,    -- raw model extraction output
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Outfits (Saved & Generated)
create table public.outfits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  occasion text,                            -- 'work', 'weekend_brunch', 'date_night'
  season text,
  stylist_notes text,                       -- AI explanation on why this outfit works
  favorite boolean default false,
  rating smallint check (rating between 1 and 5),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 4. Outfit Items (Junction Table)
create table public.outfit_items (
  id uuid default gen_random_uuid() primary key,
  outfit_id uuid references public.outfits(id) on delete cascade not null,
  clothing_item_id uuid references public.clothing_items(id) on delete cascade not null,
  slot_position text not null,              -- 'top', 'bottom', 'outerwear', 'shoes', 'accessory_1'
  created_at timestamptz default now()
);

-- 5. Stylist Chat Sessions
create table public.stylist_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'Styling Session',
  created_at timestamptz default now()
);

create table public.stylist_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.stylist_conversations(id) on delete cascade not null,
  sender text not null check (sender in ('user', 'stylist')),
  content text not null,
  suggested_outfit_id uuid references public.outfits(id) on delete set null,
  created_at timestamptz default now()
);
```

*Note: All tables enforce Row-Level Security (RLS) policies ensuring users can only read, insert, update, and delete their own records (`auth.uid() = user_id`).*

---

## 5. AI Engineering Pipeline

### A. Clothing Recognition Pipeline (Vision Model)
1. **Input:** Garment image uploaded to Supabase Storage bucket (`wardrobe-images/{user_id}/{filename}`).
2. **Processing:**
   - NestJS calls Multimodal Vision API (Gemini 1.5 Flash / 2.5 Flash or GPT-4o-mini).
   - Structured JSON output enforced via Zod schema.
3. **Extracted Attributes:**
   - Category (`tops`, `bottoms`, `outerwear`, `footwear`, `one-piece`, `accessories`)
   - Subcategory, Primary & Secondary Colors (hex approximation + common name)
   - Pattern, Material estimation, Formality tier, Seasonality tags
4. **Resilience:** User is presented with a pre-filled review card before persisting, allowing manual override of any AI-detected attribute.

### B. Personal Stylist & Outfit Generation Pipeline
1. **Input Parameters:**
   - User ID (fetches style archetypes, color preferences, disliked colors from `profiles`)
   - Request prompt (e.g., *"Smart-casual outfit for dinner in 18°C rainy weather"*)
   - Occasion & season tag
2. **Inventory Ingestion:** Fetch available wardrobe items from `clothing_items` matching relevant seasons or neutral layers.
3. **Outfit Synthesis Prompt:**
   - Applies fashion theory rules: color coordination (analogous, complementary, neutral balancing), silhouette balancing (loose-top/fitted-bottom or vice versa), and formality cohesion.
   - Enforces exact item ID matching: The AI must pick real item IDs from the user's inventory.
4. **Structured Response:**
   ```json
   {
     "outfitName": "Effortless Parisian Dinner",
     "itemIds": ["uuid-1", "uuid-2", "uuid-3"],
     "slots": {
       "top": "uuid-1",
       "bottom": "uuid-2",
       "footwear": "uuid-3"
     },
     "stylistNotes": "Balancing the crisp white poplin shirt with relaxed charcoal trousers and leather loafers creates an elevated yet comfortable silhouette.",
     "weatherSuitability": "Great for mild 18°C weather with light wind."
   }
   ```

---

## 6. Phased Implementation Roadmap

### Phase 1: MVP Core (Current Target)
- [ ] Monorepo setup (Turborepo + pnpm workspaces + TypeScript configs).
- [ ] Shared `@stylemuse/types` package (Zod schemas, DTOs, Enums).
- [ ] Supabase local/cloud project initialization, schema migrations, and storage buckets.
- [ ] NestJS backend API:
  - Auth guard verifying Supabase JWTs.
  - Profile & Onboarding endpoints.
  - Wardrobe CRUD endpoints with image upload pre-signing.
  - AI Clothing Recognition service.
  - AI Stylist & Outfit Generator service.
- [ ] Next.js 15 Web Application:
  - Landing page, Auth (login/signup), Onboarding preference wizard.
  - Digital wardrobe gallery (filter by category, color, season).
  - Clothing upload modal with instant AI tagging and confirmation.
  - Stylist chat interface and Outfit Generator canvas.
  - Saved outfits manager (favorite, edit, swap items).
- [ ] Expo React Native Mobile Skeleton:
  - Expo Router tabs, Supabase Auth hook, Wardrobe viewer.

### Phase 2: Refinements & Enhanced Styling
- Automatic background removal for clothing photos (rembg / AI segmentation).
- Vector embeddings for clothing items using `pgvector` for instant visual similarity search.
- Weather API integration (OpenWeatherMap) for automatic daily morning outfit recommendations.

### Phase 3: Outfit Calendar & Travel Capsule
- Calendar outfit planner (schedule outfits for dates/events).
- Smart packing list generator (capsule wardrobe for X days with minimal luggage).

### Phase 4: Virtual Try-On (VTON) & Shopping Discovery
- Generative AI try-on models (diffusion-based garment warping onto user avatar).
- Missing piece recommendations (identifies gaps in your wardrobe with affiliate shopping links).

### Phase 5: Community & Monetization
- Public styling feed and peer reviews.
- Premium tier (unlimited AI styling chats, high-resolution VTON, priority generation).

---

## 7. MVP Acceptance Checklist

To consider the MVP feature-complete and production-ready:

1. **Authentication:**
   - User can register with email/password or Google.
   - Session persists across page reloads.
   - Protected routes redirect unauthenticated users to `/login`.
2. **Onboarding:**
   - First-time user is automatically directed to `/onboarding`.
   - Saves style archetypes, colors, and body shape to Supabase.
   - Completing onboarding flags `onboarding_completed = true`.
3. **Digital Wardrobe:**
   - User can upload clothing images (JPEG/PNG/WebP, max 10MB).
   - Images are stored in Supabase Storage with authenticated access.
   - User can view their wardrobe grouped and filtered by category.
4. **AI Clothing Recognition:**
   - Uploading an image triggers AI classification within < 4 seconds.
   - Category, color, pattern, formality, and seasonality are accurately populated.
   - User can edit and verify tags before saving.
5. **AI Stylist & Outfit Generation:**
   - User can request an outfit for a specific occasion or weather.
   - The AI returns an outfit composed **only** of existing wardrobe items.
   - Provides clear, natural-language stylist rationale.
6. **Saved Outfits:**
   - User can save recommended outfits to their collection.
   - User can swap an item in a saved outfit (e.g., switch sneaker for boot).
   - User can delete or favorite outfits.
7. **Code Quality & Reliability:**
   - TypeScript compiles with zero errors (`turbo run type-check`).
   - Linting passes cleanly (`turbo run lint`).
   - API endpoints have validation pipes (invalid inputs return 400 with actionable messages).

---

## 8. External Accounts & Integrations Required

> [!NOTE]
> Database migrations and cloud account creation can be performed after the platform UI and features are completely built. See [DEPLOYMENT_GUIDE.md](file:///c:/Users/Amar/OneDrive/Desktop/Projects/StyleMuse/DEPLOYMENT_GUIDE.md) for click-by-click instructions.

| Service | Purpose | Credentials Required |
| :--- | :--- | :--- |
| **Supabase** | PostgreSQL, Auth, Storage | `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET` |
| **AI Provider** | Vision Recognition & Outfit LLM | `GEMINI_API_KEY` (Recommended) or `OPENAI_API_KEY` |
| **Weather API** (Phase 2) | Context-aware styling | OpenWeatherMap API Key |
| **Expo / EAS** | Mobile testing & builds | Expo free account |

