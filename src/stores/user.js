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
    },
    setUser(user) {
      this.user = user;
    },
    async logout() {
      await supabase.auth.signOut();
      this.user = null;
    },
  },
});
