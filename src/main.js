import { createApp } from 'vue';
import App from './App.vue';
import pinia from './stores';
import router from './router';
import './assets/css/styles.css';

import { supabase } from './lib/supabase';
import { useUserStore } from './stores/user';

const app = createApp(App);
app.use(pinia);
const userStore = useUserStore(pinia);
if (supabase) {
  supabase.auth.onAuthStateChange((event, session) => {
    userStore.setUser(session?.user ?? null);
    // Defer navigation so auth callbacks do not await another auth operation.
    if (event === 'PASSWORD_RECOVERY') setTimeout(() => router.replace('/reset-password'), 0);
    if (event === 'SIGNED_OUT' && router.currentRoute.value.meta.requiresAuth) {
      setTimeout(() => router.replace('/connect'), 0);
    }
  });
}
app.use(router);
app.mount('#app');