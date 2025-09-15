
-- DROP ALL ROUTINES, FUNCTIONS, TABLES, VIEWS, SEQUENCES
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = current_schema()) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    -- Drop all sequences
    FOR r IN (SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = current_schema()) LOOP
        EXECUTE 'DROP SEQUENCE IF EXISTS ' || quote_ident(r.sequence_name) || ' CASCADE';
    END LOOP;
    -- Drop all views
    FOR r IN (SELECT table_name FROM information_schema.views WHERE table_schema = current_schema()) LOOP
        EXECUTE 'DROP VIEW IF EXISTS ' || quote_ident(r.table_name) || ' CASCADE';
    END LOOP;
    -- Drop all functions
    FOR r IN (SELECT routine_name, routine_type FROM information_schema.routines WHERE specific_schema = current_schema()) LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || quote_ident(r.routine_name) || ' CASCADE';
    END LOOP;
END $$;

-- EXTENSIONS
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- USERS TABLE
create table users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  address text,
  wallets jsonb,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  last_login timestamp with time zone,
  is_active boolean default true,
  username text unique,
  display_name text,
  country text,
  city text,
  birthdate date,
  gender text,
  email_verified boolean default false,
  phone_verified boolean default false
);

-- HEROES TABLE
create table heroes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  bio text,
  image_url text,
  model_url text,
  skills jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- DRAGONS TABLE
create table dragons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  name text not null,
  bio text,
  image_url text,
  model_url text,
  skills jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- SUPABASE AUTH USERS VIEW
create or replace view app_users as
  select
    u.id,
    u.email,
    u.username,
    u.display_name,
    u.avatar_url,
    u.created_at,
    u.is_active
  from users u;

-- POLICIES (EXAMPLES, ADJUST AS NEEDED)
alter table users enable row level security;
create policy "Users can view their own data" on users for select using (auth.uid() = id);
create policy "Users can insert their own data" on users for insert with check (auth.uid() = id);
create policy "Users can update their own data" on users for update using (auth.uid() = id);
create policy "Users can delete their own data" on users for delete using (auth.uid() = id);
