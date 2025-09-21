import { defineStore } from 'pinia';
import { supabase } from '../main';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser() {
      const { data } = await supabase.auth.getUser();
      this.user = data.user;
      return !!this.user;
    },
    setUser(user) {
      this.user = user;
    },
    isAuthenticated() {
      return !!this.user;
    },
    async syncUserProfile() {
      if (!this.user) return;

      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .eq('id', this.user.id)
        .single();

      let avatarUrl = this.user.avatar_url || null;
      let avatarOrigin = 'default';
      let username = this.user.user_metadata?.username || null;
      let displayName = this.user.user_metadata?.full_name || null;
      let emailVerified = this.user.email_confirmed_at ? true : false;
      let phoneVerified = this.user.phone_confirmed_at ? true : false;
      let createdAt = this.user.created_at || null;
      let updatedAt = this.user.updated_at || null;
      let lastLogin = this.user.last_sign_in_at || null;
      let isActive = true;

      if (this.user.identities) {
        const googleIdentity = this.user.identities.find(i => i.provider === 'google');
        if (googleIdentity && googleIdentity.identity_data && googleIdentity.identity_data.avatar_url) {
          avatarUrl = googleIdentity.identity_data.avatar_url;
          avatarOrigin = 'google';
        }
      }

      const userRecord = {
        id: this.user.id,
        email: this.user.email,
        avatar_url: avatarUrl,
        avatar_origin: avatarOrigin,
        username,
        display_name: displayName,
        email_verified: emailVerified,
        phone_verified: phoneVerified,
        created_at: createdAt,
        updated_at: updatedAt,
        last_login: lastLogin,
        is_active: isActive
      };

      if (!existing) {
        await supabase.from('users').insert([userRecord]);
      } else {
        await supabase.from('users').update(userRecord).eq('id', this.user.id);
      }
    },
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
    },
  },
});
