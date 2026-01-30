import { createApp } from 'vue';
import App from './App.vue';
import pinia from './stores';
import router from './router';
import './assets/css/styles.css';

// import { createClient } from '@supabase/supabase-js';
// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
// const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
// export const supabase = createClient(supabaseUrl, supabaseKey);

const app = createApp(App);
app.use(pinia);
app.use(router);
app.mount('#app');