
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
CREATE TABLE users (
  id uuid PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  wallets JSONB,
  bio TEXT,
  avatar_url TEXT,
  avatar_origin TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  username TEXT UNIQUE,
  display_name TEXT,
  country TEXT,
  city TEXT,
  birthdate DATE,
  gender TEXT,
  email_verified BOOLEAN DEFAULT false,
  phone_verified BOOLEAN DEFAULT false
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

-- POLICIES (EXAMPLES, ADJUST AS NEEDED)
alter table users enable row level security;
create policy "Users can view their own data" on users for select using (auth.uid() = id);
create policy "Users can insert their own data" on users for insert with check (auth.uid() = id);
create policy "Users can update their own data" on users for update using (auth.uid() = id);
create policy "Users can delete their own data" on users for delete using (auth.uid() = id);
