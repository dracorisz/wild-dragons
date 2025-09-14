import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores'
import { setupSEORouting } from '../lib/seo.js'
import Default from '../layouts/Default.vue'
import Home from '../pages/Home.vue'
import Play from '../pages/Play.vue'
import Profile from '../pages/Profile.vue'
import Auth from '../pages/Auth.vue'

const routes = [
  {
    path: '/',
    component: Default,
    children: [
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: { 
          title: 'Home',
          description: 'Epic adventure game - play for free in your browser'
        }
      },
      {
        path: '/play',
        name: 'Play',
        component: Play,
        meta: { 
          requiresAuth: true,
          title: 'Adventure Arena',
          description: 'Enter the adventure arena and face legendary challenges'
        }
      },
      {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { 
          requiresAuth: true,
          title: 'Player Profile',
          description: 'View your game statistics, achievements, and progress'
        }
      },
    ]
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
    meta: {
      title: 'Sign In',
      description: 'Sign in to save your progress and compete on leaderboards'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth')
  } else {
    next()
  }
})

// Initialize SEO routing with auth store access
let authStore = null
router.beforeResolve(() => {
  if (!authStore) {
    authStore = useAuthStore()
    setupSEORouting(router, authStore)
  }
})

export default router
