-- Wild Dragons Game Database Schema
-- Complete production-ready schema with all game features
-- Run this in Supabase SQL Editor

-- Drop existing tables if they exist (for clean restart)
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS environments CASCADE;
DROP TABLE IF EXISTS equipment CASCADE;
DROP TABLE IF EXISTS actions_log CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS battle_logs CASCADE;
DROP TABLE IF EXISTS user_quest_progress CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS heroes CASCADE;
DROP TABLE IF EXISTS points_transactions CASCADE;
DROP TABLE IF EXISTS xp_transactions CASCADE;
DROP TABLE IF EXISTS wallets CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop existing functions
DROP FUNCTION IF EXISTS get_user_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS process_referral_reward(UUID, UUID) CASCADE;
DROP FUNCTION IF EXISTS generate_referral_code() CASCADE;
DROP FUNCTION IF EXISTS xp_to_next_level(INTEGER) CASCADE;
DROP FUNCTION IF EXISTS level_from_xp(BIGINT) CASCADE;
DROP FUNCTION IF EXISTS award_xp(UUID, BIGINT, VARCHAR, JSONB) CASCADE;
DROP FUNCTION IF EXISTS award_points(UUID, BIGINT, VARCHAR, JSONB) CASCADE;
DROP FUNCTION IF EXISTS create_guest_user_bypass_rls(VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS create_email_user_profile(UUID, VARCHAR, VARCHAR, VARCHAR) CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS test_user_creation() CASCADE;

-- Drop existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;

-- ====================================
-- CORE TABLES
-- ====================================

-- Users table (with enhanced game tracking)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    current_level INTEGER DEFAULT 1,
    total_xp BIGINT DEFAULT 0,
    total_points BIGINT DEFAULT 0,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referred_by UUID REFERENCES users(id),
    
    -- Game progression tracking
    consecutive_wins INTEGER DEFAULT 0,
    total_battles INTEGER DEFAULT 0,
    total_victories INTEGER DEFAULT 0,
    highest_damage INTEGER DEFAULT 0,
    last_battle_date TIMESTAMP WITH TIME ZONE,
    last_login_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    login_streak_days INTEGER DEFAULT 1,
    
    -- Wallet integration
    wallet_address VARCHAR(42),
    wallet_type VARCHAR(20), -- 'metamask', 'walletconnect', etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Heroes table (enhanced with equipment and status effects)
CREATE TABLE heroes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    xp BIGINT DEFAULT 0,
    current_hp INTEGER DEFAULT 100,
    max_hp INTEGER DEFAULT 100,
    attack INTEGER DEFAULT 10,
    defense INTEGER DEFAULT 5,
    speed INTEGER DEFAULT 50,
    crit_rate DECIMAL(5,4) DEFAULT 0.05,
    dodge_rate DECIMAL(5,4) DEFAULT 0.03,
    is_active BOOLEAN DEFAULT true,
    
    -- Equipment slots
    weapon_id UUID,
    armor_id UUID,
    accessory_id UUID,
    
    -- Status effects and abilities
    abilities JSONB DEFAULT '[]',
    status_effects JSONB DEFAULT '[]',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a unique partial index for active heroes instead of constraint
CREATE UNIQUE INDEX idx_one_active_hero_per_user 
ON heroes(user_id) WHERE is_active = true;

-- Equipment table for weapons, armor, accessories
CREATE TABLE equipment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'weapon', 'armor', 'accessory'
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    
    -- Stat bonuses
    attack_bonus INTEGER DEFAULT 0,
    defense_bonus INTEGER DEFAULT 0,
    hp_bonus INTEGER DEFAULT 0,
    speed_bonus INTEGER DEFAULT 0,
    crit_rate_bonus DECIMAL(5,4) DEFAULT 0,
    dodge_rate_bonus DECIMAL(5,4) DEFAULT 0,
    
    -- Special properties
    special_effects JSONB DEFAULT '{}',
    requirements JSONB DEFAULT '{}', -- level requirements, etc.
    
    is_equipped BOOLEAN DEFAULT false,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- XP Transactions
CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Points Transactions
CREATE TABLE points_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount BIGINT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Battle Logs (enhanced with environment and battle type tracking)
CREATE TABLE battle_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    enemy_name VARCHAR(100) NOT NULL,
    enemy_level INTEGER NOT NULL,
    enemy_type VARCHAR(30) NOT NULL, -- 'normal', 'elite', 'boss', 'legendary'
    battle_result VARCHAR(20) NOT NULL, -- 'victory', 'defeat', 'timeout'
    
    -- Battle details
    battle_seed VARCHAR(50) NOT NULL,
    environment_id UUID,
    environment_name VARCHAR(100),
    duration_seconds INTEGER DEFAULT 0,
    turns_taken INTEGER DEFAULT 0,
    
    -- Player performance
    damage_dealt INTEGER DEFAULT 0,
    damage_taken INTEGER DEFAULT 0,
    max_damage_hit INTEGER DEFAULT 0,
    critical_hits INTEGER DEFAULT 0,
    dodges INTEGER DEFAULT 0,
    
    -- Rewards
    xp_gained BIGINT DEFAULT 0,
    points_gained BIGINT DEFAULT 0,
    loot_gained JSONB DEFAULT '[]',
    
    -- Battle data for analysis
    battle_log JSONB DEFAULT '[]',
    player_stats JSONB DEFAULT '{}',
    enemy_stats JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inventory table
CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id VARCHAR(100) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'weapon', 'armor', 'consumable', 'treasure'
    quantity INTEGER DEFAULT 1,
    rarity VARCHAR(20) DEFAULT 'common', -- 'common', 'rare', 'epic', 'legendary'
    metadata JSONB DEFAULT '{}',
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, item_id)
);

-- Referrals table
CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'expired'
    reward_claimed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(referrer_id, referred_id)
);

-- Achievement system
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    achievement_key VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(30) NOT NULL, -- 'battle', 'progression', 'collection', 'special'
    xp_reward BIGINT DEFAULT 0,
    points_reward BIGINT DEFAULT 0,
    requirements JSONB NOT NULL, -- conditions to unlock
    icon VARCHAR(10) DEFAULT '🏆',
    is_hidden BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievement tracking
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    progress JSONB DEFAULT '{}',
    unlocked_at TIMESTAMP WITH TIME ZONE,
    claimed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, achievement_id)
);

-- Battle environments for enhanced battles
CREATE TABLE environments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    player_damage_multiplier DECIMAL(3,2) DEFAULT 1.0,
    enemy_damage_multiplier DECIMAL(3,2) DEFAULT 1.0,
    xp_bonus DECIMAL(3,2) DEFAULT 1.0,
    points_bonus DECIMAL(3,2) DEFAULT 1.0,
    special_effects JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ====================================
-- UTILITY FUNCTIONS
-- ====================================

-- XP calculation functions
CREATE OR REPLACE FUNCTION xp_to_next_level(current_level INTEGER)
RETURNS BIGINT 
LANGUAGE plpgsql IMMUTABLE
AS $$
BEGIN
    RETURN FLOOR(100 * POWER(current_level, 2.1));
END;
$$;

CREATE OR REPLACE FUNCTION level_from_xp(total_xp BIGINT)
RETURNS INTEGER 
LANGUAGE plpgsql IMMUTABLE
AS $$
DECLARE
    level INTEGER := 1;
    xp_accumulated BIGINT := 0;
    xp_needed BIGINT;
BEGIN
    WHILE true LOOP
        xp_needed := xp_to_next_level(level);
        IF xp_accumulated + xp_needed > total_xp THEN
            RETURN level;
        END IF;
        xp_accumulated := xp_accumulated + xp_needed;
        level := level + 1;
    END LOOP;
    RETURN level;
END;
$$;

-- Award XP and handle level ups
CREATE OR REPLACE FUNCTION award_xp(
    p_user_id UUID,
    p_amount BIGINT,
    p_reason VARCHAR(100),
    p_metadata JSONB DEFAULT NULL
)
RETURNS JSONB 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
    new_total_xp BIGINT;
    new_level INTEGER;
    old_level INTEGER;
    level_up_bonus BIGINT;
    result JSONB;
BEGIN
    -- Get current user data
    SELECT total_xp, current_level INTO user_record
    FROM users WHERE id = p_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    old_level := user_record.current_level;
    new_total_xp := user_record.total_xp + p_amount;
    new_level := level_from_xp(new_total_xp);
    
    -- Update user totals
    UPDATE users 
    SET total_xp = new_total_xp,
        current_level = new_level,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    -- Record XP transaction
    INSERT INTO xp_transactions (user_id, amount, reason, metadata)
    VALUES (p_user_id, p_amount, p_reason, p_metadata);
    
    -- Handle level up rewards
    IF new_level > old_level THEN
        level_up_bonus := FLOOR(5 * new_level * SQRT(new_level));
        
        -- Award level up bonus points
        PERFORM award_points(p_user_id, level_up_bonus, 'Level up bonus', 
                           jsonb_build_object('old_level', old_level, 'new_level', new_level));
    END IF;
    
    -- Build result
    result := jsonb_build_object(
        'xp_awarded', p_amount,
        'total_xp', new_total_xp,
        'old_level', old_level,
        'new_level', new_level,
        'level_up', new_level > old_level,
        'bonus_points', CASE WHEN new_level > old_level THEN level_up_bonus ELSE 0 END
    );
    
    RETURN result;
END;
$$;

-- Award points
CREATE OR REPLACE FUNCTION award_points(
    p_user_id UUID,
    p_amount BIGINT,
    p_reason VARCHAR(100),
    p_metadata JSONB DEFAULT NULL
)
RETURNS BIGINT 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_total BIGINT;
BEGIN
    -- Update user points
    UPDATE users 
    SET total_points = total_points + p_amount,
        updated_at = NOW()
    WHERE id = p_user_id
    RETURNING total_points INTO new_total;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
    
    -- Record transaction
    INSERT INTO points_transactions (user_id, amount, reason, metadata)
    VALUES (p_user_id, p_amount, p_reason, p_metadata);
    
    RETURN new_total;
END;
$$;

-- User profile creation trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_username VARCHAR(50);
    user_referral_code VARCHAR(20);
    hero_name VARCHAR(100);
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    attempt_count INTEGER := 0;
BEGIN
    -- Skip if profile already exists
    IF EXISTS (SELECT 1 FROM public.users WHERE id = NEW.id) THEN
        RETURN NEW;
    END IF;
    
    -- Generate username from email or metadata
    user_username := COALESCE(
        (NEW.raw_user_meta_data->>'username'),
        SPLIT_PART(NEW.email, '@', 1)
    );
    
    -- Make username unique if needed
    WHILE EXISTS (SELECT 1 FROM public.users WHERE username = user_username) LOOP
        user_username := SPLIT_PART(NEW.email, '@', 1) || '_' || FLOOR(RANDOM() * 1000)::TEXT;
    END LOOP;
    
    -- Generate unique referral code inline
    LOOP
        user_referral_code := '';
        
        -- Generate 8-character code
        FOR i IN 1..8 LOOP
            user_referral_code := user_referral_code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
        END LOOP;
        
        -- Check if unique
        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = user_referral_code);
        
        -- Safety check
        attempt_count := attempt_count + 1;
        IF attempt_count > 100 THEN
            user_referral_code := 'USER' || EXTRACT(EPOCH FROM NOW())::bigint::text;
            EXIT;
        END IF;
    END LOOP;
    
    -- Create user profile
    INSERT INTO public.users (id, email, username, referral_code)
    VALUES (NEW.id, NEW.email, user_username, user_referral_code);
    
    -- Create default hero
    hero_name := user_username || '''s Dragon';
    INSERT INTO public.heroes (user_id, name, level, xp, current_hp, max_hp, attack, defense, speed, crit_rate, dodge_rate)
    VALUES (NEW.id, hero_name, 1, 0, 100, 100, 10, 5, 50, 0.05, 0.03);
    
    RETURN NEW;
END;
$$;

-- ====================================
-- ROW LEVEL SECURITY POLICIES
-- ====================================

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE heroes ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE battle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE environments ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Heroes policies
CREATE POLICY "Users can manage own heroes" ON heroes
    FOR ALL USING (auth.uid() = user_id);

-- Equipment policies
CREATE POLICY "Users can manage own equipment" ON equipment
    FOR ALL USING (auth.uid() = user_id);

-- Inventory policies
CREATE POLICY "Users can manage own inventory" ON inventory
    FOR ALL USING (auth.uid() = user_id);

-- Transaction policies
CREATE POLICY "Users can view own XP transactions" ON xp_transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own points transactions" ON points_transactions
    FOR SELECT USING (auth.uid() = user_id);

-- Battle logs policies
CREATE POLICY "Users can view own battle logs" ON battle_logs
    FOR ALL USING (auth.uid() = user_id);

-- Referrals policies
CREATE POLICY "Users can view their referrals" ON referrals
    FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can create referrals" ON referrals
    FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Achievement policies
CREATE POLICY "Everyone can read achievements" ON achievements
    FOR SELECT USING (true);

CREATE POLICY "Users can view own achievement progress" ON user_achievements
    FOR ALL USING (auth.uid() = user_id);

-- Environment policies
CREATE POLICY "Everyone can read environments" ON environments
    FOR SELECT USING (true);

-- ====================================
-- TRIGGERS
-- ====================================

-- Create the trigger for insert only
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ====================================
-- PERMISSIONS
-- ====================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated, anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated, anon;

-- ====================================
-- PERFORMANCE INDEXES
-- ====================================

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_level ON users(current_level);
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address) WHERE wallet_address IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_login_streak ON users(login_streak_days);

CREATE INDEX IF NOT EXISTS idx_heroes_user_id ON heroes(user_id);
CREATE INDEX IF NOT EXISTS idx_heroes_level ON heroes(level);
CREATE INDEX IF NOT EXISTS idx_heroes_active ON heroes(user_id, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_equipment_user_id ON equipment(user_id);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON equipment(user_id, type);
CREATE INDEX IF NOT EXISTS idx_equipment_rarity ON equipment(user_id, rarity);
CREATE INDEX IF NOT EXISTS idx_equipment_equipped ON equipment(user_id, is_equipped) WHERE is_equipped = true;

CREATE INDEX IF NOT EXISTS idx_inventory_user_id ON inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_inventory_type ON inventory(user_id, item_type);
CREATE INDEX IF NOT EXISTS idx_inventory_rarity ON inventory(user_id, rarity);

CREATE INDEX IF NOT EXISTS idx_battle_logs_user_id ON battle_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_battle_logs_result ON battle_logs(user_id, battle_result);
CREATE INDEX IF NOT EXISTS idx_battle_logs_type ON battle_logs(user_id, enemy_type);
CREATE INDEX IF NOT EXISTS idx_battle_logs_date ON battle_logs(user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id ON xp_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_points_transactions_user_id ON points_transactions(user_id);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON referrals(referred_id);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_unlocked ON user_achievements(user_id, unlocked_at) WHERE unlocked_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_achievements_category ON achievements(category);
CREATE INDEX IF NOT EXISTS idx_achievements_key ON achievements(achievement_key);

-- ====================================
-- DEFAULT DATA
-- ====================================

-- Insert default achievements
INSERT INTO achievements (achievement_key, name, description, category, xp_reward, points_reward, requirements, icon) VALUES
('first_victory', 'First Blood', 'Win your first battle', 'battle', 100, 25, '{"victories": 1}', '⚔️'),
('win_streak_5', 'Unstoppable', 'Win 5 battles in a row', 'battle', 500, 100, '{"consecutive_wins": 5}', '🔥'),
('win_streak_10', 'Legendary Warrior', 'Win 10 battles in a row', 'battle', 1000, 200, '{"consecutive_wins": 10}', '👑'),
('heavy_hitter', 'Heavy Hitter', 'Deal over 200 damage in a single attack', 'battle', 250, 50, '{"max_damage": 200}', '💥'),
('level_10', 'Getting Stronger', 'Reach level 10', 'progression', 500, 100, '{"level": 10}', '📈'),
('level_25', 'Experienced Fighter', 'Reach level 25', 'progression', 1000, 250, '{"level": 25}', '🎯'),
('collector', 'Collector', 'Obtain 50 items', 'collection', 300, 75, '{"total_items": 50}', '📦'),
('social_butterfly', 'Social Butterfly', 'Refer 5 friends', 'social', 1000, 200, '{"referrals": 5}', '👥');

-- Insert default battle environments
INSERT INTO environments (name, description, player_damage_multiplier, enemy_damage_multiplier, xp_bonus, points_bonus, special_effects) VALUES
('Burning Battlefield', 'Flames engulf the arena, increasing damage output', 1.2, 1.1, 1.15, 1.1, '{"fire_damage": true}'),
('Frozen Wasteland', 'Ice slows all movements but provides defensive bonuses', 0.9, 0.9, 1.1, 1.2, '{"ice_resistance": true}'),
('Lightning Storm', 'Electric energy crackles, greatly amplifying damage', 1.5, 1.3, 1.25, 1.15, '{"lightning_strikes": true}'),
('Shadow Realm', 'Darkness obscures vision, reducing accuracy', 0.8, 1.4, 1.3, 1.25, '{"shadow_bonus": true}');