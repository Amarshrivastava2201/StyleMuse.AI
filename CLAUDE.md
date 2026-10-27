# StyleMuse AI - AI Assistant & Developer Guidelines

## 1. Project Overview
**StyleMuse AI** is an AI-powered personal styling and digital wardrobe management platform.
The repository is structured as a TypeScript monorepo managed with **Turborepo** and **pnpm workspaces**.

- **Web:** Next.js (App Router, Tailwind CSS, shadcn/ui, Supabase Auth SSR) in `apps/web`
- **Mobile:** Expo React Native (Expo Router, Supabase JS) in `apps/mobile`
- **Backend API:** NestJS (Modular Architecture, Swagger OpenAPI, Supabase Auth Guard) in `apps/api`
- **Shared Packages:**
  - `packages/types`: Shared TypeScript interfaces, DTOs, Enums, Zod schemas
  - `packages/ai-engine`: AI prompt templates, vision schema extractors, outfit matching algorithms
  - `packages/database`: Supabase migration scripts, RLS policies, generated database types
  - `packages/config`: Shared ESLint, Prettier, and TypeScript base configurations

---

## 2. Windows 11 & Tooling Notes

1. **Package Manager:** Use `pnpm`.
   - On Windows, install/update packages with `pnpm add` or `pnpm install`.
   - `.npmrc` is configured with `node-linker=hoisted` to ensure React Native Metro bundler can resolve monorepo dependencies without symlink resolution failures.
2. **OneDrive Path Warning:**
   - If the workspace is under `OneDrive`, file synchronization locks may trigger `EPERM` or `EBUSY` errors during builds or installs. Keep build outputs (`.next`, `.turbo`, `dist`, `node_modules`) excluded from sync, or work in a non-synced drive (e.g. `C:\dev\StyleMuse`).
3. **Node Version Target:**
   - Node 20 LTS or Node 22 LTS recommended. If running on Node 24, be alert to potential Metro/Babel bundler incompatibilities.
4. **Git Paths:**
   - Run `git config core.longpaths true` to prevent Windows 260-character path limit errors.

---

## 3. Common Commands

```bash
# Install all dependencies across the monorepo
pnpm install

# Run all applications in development mode in parallel
pnpm dev

# Run individual applications
pnpm dev:api      # Start NestJS backend on http://localhost:4000 (Swagger: /api/docs)
pnpm dev:web      # Start Next.js frontend on http://localhost:3000
pnpm dev:mobile   # Start Expo mobile app with QR code for Expo Go

# For complete deployment & preview instructions, refer to DEPLOYMENT_GUIDE.md

# Build all applications and packages
pnpm build

# Type check all workspaces
pnpm type-check

# Run test suites
pnpm test

# Lint all workspaces
pnpm lint
```

---

## 4. Architecture & Coding Conventions

### A. TypeScript & Validation
- **Strict Mode:** Always enabled. Do not use `any` unless strictly interfacing with untyped 3rd-party code; prefer `unknown` with type guards.
- **Single Source of Truth:** All cross-boundary models (clothing categories, outfit payloads, user preferences, API request/response DTOs) **must** reside in `packages/types`.
- **Runtime Validation:** Use **Zod** schemas for incoming API inputs, AI JSON response parsing, and form validations. Infer TypeScript types directly from Zod: `export type ClothingItem = z.infer<typeof ClothingItemSchema>;`.

### B. Backend (NestJS) Conventions
- Group features by domain module: `AuthModule`, `ProfilesModule`, `WardrobeModule`, `OutfitsModule`, `AiModule`.
- Authenticate requests using a custom `SupabaseAuthGuard` that extracts the Bearer token from the `Authorization` header and verifies it via `supabase-js` or JWT validation.
- Always attach `@ApiTags()`, `@ApiOperation()`, and `@ApiResponse()` decorators to controllers to keep the auto-generated Swagger OpenAPI spec synchronized.
- Controllers must never perform direct database queries; business logic belongs in `@Injectable()` services.

### C. Database & Security (Supabase)
- **RLS (Row Level Security):** Every table in PostgreSQL must have RLS enabled with explicit policies checking `auth.uid() = user_id`.
- **Secret Separation:**
  - `SUPABASE_SERVICE_ROLE_KEY` must **never** be imported or used in `apps/web` or `apps/mobile`. It is strictly reserved for backend server operations in `apps/api`.
  - Client applications strictly use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

### D. AI Service Architecture
- All AI prompt templates and structured JSON parsing logic belong in `packages/ai-engine`.
- Always enforce JSON mode or structured outputs when invoking LLMs/Vision models.
- Validate LLM outputs using Zod schema safe-parsing before returning them to client callers. Always handle fallback states gracefully if the model returns unexpected formats.

---

## 5. Environment Variables Structure

### `apps/api/.env`
```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
SUPABASE_JWT_SECRET=<jwt-secret>
GEMINI_API_KEY=<gemini-api-key>
# OPENAI_API_KEY=<optional-fallback>
```

### `apps/web/.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### `apps/mobile/.env`
```env
EXPO_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
EXPO_PUBLIC_API_URL=http://localhost:4000
```

