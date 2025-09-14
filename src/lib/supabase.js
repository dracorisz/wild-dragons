import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Authentication functions
export const auth = {
  // Sign up with email
  async signUp(email, password, username, referralCode = null) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          referral_code: referralCode
        },
        emailRedirectTo: `${window.location.origin}/auth?confirmed=true`
      }
    })

    if (authError) throw authError
    
    // Email confirmation is required if user exists but no session
    // This is normal behavior for email confirmation flow
    return {
      user: authData.user,
      session: authData.session,
      needsEmailConfirmation: !!(authData.user && !authData.session)
    }
  },

  // Sign in
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
}

// Game functions
export const game = {
  // Award XP
  async awardXP(userId, amount, reason, metadata = null) {
    const { data, error } = await supabase.rpc('award_xp', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: reason,
      p_metadata: metadata
    })
    
    if (error) throw error
    return data
  },

  // Award points
  async awardPoints(userId, amount, reason, metadata = null) {
    const { data, error } = await supabase.rpc('award_points', {
      p_user_id: userId,
      p_amount: amount,
      p_reason: reason,
      p_metadata: metadata
    })
    
    if (error) throw error
    return data
  },

  // Get user profile
  async getUserProfile(userId) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  // Get user heroes (theme-agnostic)
  async getUserHeroes(userId) {
    const { data, error } = await supabase
      .from('heroes') // theme-agnostic table name
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  // Get user inventory
  async getUserInventory(userId) {
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('user_id', userId)
      .order('acquired_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  // Log battle result
  async logBattle(userId, enemyName, enemyLevel, battleResult, xpGained, pointsGained, lootGained = [], battleData = {}) {
    const { data, error } = await supabase
      .from('battle_logs')
      .insert({
        user_id: userId,
        enemy_name: enemyName,
        enemy_level: enemyLevel,
        battle_result: battleResult,
        xp_gained: xpGained,
        points_gained: pointsGained,
        loot_gained: lootGained,
        battle_data: battleData
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
