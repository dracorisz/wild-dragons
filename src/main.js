import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/css/styles.css'

// Mock Supabase client for MVP
const supabase = {
  auth: {
    signInWithPassword: async () => ({ error: null }),
    signUp: async () => ({ error: null }),
    signInWithOAuth: async () => ({ error: null }),
    resetPasswordForEmail: async () => ({ error: null })
  }
}

// Create the app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(router)

// Mount the app
app.mount('#app')

// Export for components that need it
export { supabase }
