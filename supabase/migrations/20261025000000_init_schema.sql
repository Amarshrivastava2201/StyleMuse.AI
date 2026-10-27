-- ==============================================================================
-- StyleMuse AI - Supabase PostgreSQL Schema & Security Policies
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  gender_preference text default 'unspecified',
  style_archetypes text[] default '{}',
  color_preferences text[] default '{}',
  color_dislikes text[] default '{}',
  body_shape text default 'unspecified',
  budget_preference text,
  onboarding_completed boolean default false,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Trigger to automatically create a profile when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Clothing Items Table (Digital Wardrobe)
create table if not exists public.clothing_items (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  image_url text not null,
  thumbnail_url text,
  name text not null,
  category text not null,
  subcategory text not null,
  primary_color text not null,
  secondary_colors text[] default '{}',
  pattern text default 'solid',
  material text,
  formality text not null default 'casual',
  seasons text[] default '{}',
  fit text,
  brand text,
  favorite boolean default false,
  ai_metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on clothing_items
alter table public.clothing_items enable row level security;

create policy "Users can view own clothing items"
  on public.clothing_items for select
  using (auth.uid() = user_id);

create policy "Users can insert own clothing items"
  on public.clothing_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own clothing items"
  on public.clothing_items for update
  using (auth.uid() = user_id);

create policy "Users can delete own clothing items"
  on public.clothing_items for delete
  using (auth.uid() = user_id);

-- Index for fast user wardrobe filtering
create index if not exists idx_clothing_items_user_category
  on public.clothing_items (user_id, category);

-- 3. Outfits Table
create table if not exists public.outfits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  occasion text,
  season text,
  stylist_notes text,
  favorite boolean default false,
  rating smallint check (rating >= 1 and rating <= 5),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS on outfits
alter table public.outfits enable row level security;

create policy "Users can view own outfits"
  on public.outfits for select
  using (auth.uid() = user_id);

create policy "Users can insert own outfits"
  on public.outfits for insert
  with check (auth.uid() = user_id);

create policy "Users can update own outfits"
  on public.outfits for update
  using (auth.uid() = user_id);

create policy "Users can delete own outfits"
  on public.outfits for delete
  using (auth.uid() = user_id);

-- 4. Outfit Items Table (Junction Table)
create table if not exists public.outfit_items (
  id uuid default gen_random_uuid() primary key,
  outfit_id uuid references public.outfits(id) on delete cascade not null,
  clothing_item_id uuid references public.clothing_items(id) on delete cascade not null,
  slot_position text not null,
  created_at timestamptz default now() not null
);

-- Enable RLS on outfit_items
alter table public.outfit_items enable row level security;

create policy "Users can view own outfit items"
  on public.outfit_items for select
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid()
    )
  );

create policy "Users can insert own outfit items"
  on public.outfit_items for insert
  with check (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid()
    )
  );

create policy "Users can delete own outfit items"
  on public.outfit_items for delete
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.user_id = auth.uid()
    )
  );

-- 5. Stylist Conversations & Messages
create table if not exists public.stylist_conversations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text default 'Styling Session',
  created_at timestamptz default now() not null
);

alter table public.stylist_conversations enable row level security;

create policy "Users can manage own stylist conversations"
  on public.stylist_conversations for all
  using (auth.uid() = user_id);

create table if not exists public.stylist_messages (
  id uuid default gen_random_uuid() primary key,
  conversation_id uuid references public.stylist_conversations(id) on delete cascade not null,
  sender text not null check (sender in ('user', 'stylist')),
  content text not null,
  suggested_outfit_id uuid references public.outfits(id) on delete set null,
  created_at timestamptz default now() not null
);

alter table public.stylist_messages enable row level security;

create policy "Users can manage own stylist messages"
  on public.stylist_messages for all
  using (
    exists (
      select 1 from public.stylist_conversations c
      where c.id = stylist_messages.conversation_id and c.user_id = auth.uid()
    )
  );

-- 6. Storage Bucket Configuration
insert into storage.buckets (id, name, public)
values ('wardrobe-images', 'wardrobe-images', true)
on conflict (id) do nothing;

create policy "Users can upload their own wardrobe images"
  on storage.objects for insert
  with check (bucket_id = 'wardrobe-images' and auth.role() = 'authenticated');

create policy "Public can read wardrobe images"
  on storage.objects for select
  using (bucket_id = 'wardrobe-images');
