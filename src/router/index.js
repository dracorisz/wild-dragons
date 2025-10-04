import { createRouter, createWebHistory } from 'vue-router';

// Define all application routes
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomePage.vue'),
    meta: {
      title: "Heroine's Dragon - Home"
    }
  },
  {
    path: '/marketplace',
    name: 'Marketplace',
    component: () => import('../views/HomePage.vue'),
    meta: {
      title: "Heroine's Dragon - Marketplace"
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ProfilePage.vue'),
    meta: { 
      title: "Heroine's Dragon - Profile", 
      requiresAuth: true 
    }
  },
  {
    path: '/leaderboard',
    name: 'Leaderboard',
    component: () => import('../views/LeaderboardPage.vue'),
    meta: { 
      title: "Heroine's Dragon - Leaderboard" 
    }
  },
  {
    path: "/landing", 
    name: "Landing", 
    component: () => import('../views/LandingPage.vue')
  },
  {
    path: "/connect", 
    name: "Connect", 
    component: () => import('../views/ConnectPage.vue')
  },
  {
    path: "/web3", 
    name: "Web3", 
    component: () => import('../views/Web3Page.vue')
  },
  {
    path: "/how-to-play", 
    name: "HowToPlay", 
    component: () => import('../views/HowToPlayPage.vue')
  },
  {
    path: "/about", 
    name: "About", 
    component: () => import('../views/AboutPage.vue')
  },
  {
    path: "/nft-marketplace", 
    name: "NFTMarketplace", 
    component: () => import('../views/NFTMarketplacePage.vue')
  },
  {
    path: "/marketplace/mint", 
    name: "Mint", 
    component: () => import('../views/MintPage.vue'), 
    meta: { requiresAuth: true }
  },
  {
    path: "/marketplace/my", 
    name: "MyNFTs", 
    component: () => import('../views/MyNFTsPage.vue'), 
    meta: { requiresAuth: true }
  },
  {
    path: "/game",
    name: "Game",
    component: () => import('../views/GamePage.vue'),
    meta: { title: "Heroine's Dragon - Play" }
  },
  {
    path: "/minting",
    name: "Minting",
    component: () => import('../views/MintingPage.vue'),
    meta: { 
      title: "Heroine's Dragon - Minting Hub", 
      requiresAuth: true, 
      requiresMintingMode: true 
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Update document title based on route
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Heroine\'s Dragon';
  next();
});

export default router;
  // Check authentication requirements
  if (to.meta.requiresAuth) {
    try {
      // Use supabase if available, otherwise use mock authentication
      if (typeof window.supabase !== 'undefined') {
        const { data } = await window.supabase.auth.getSession();
        if (!data.session) {
          console.log('🔐 Redirecting to connect (authentication required)');
          next({ path: "/connect" });
          return;
        }
      } else {
        // Mock authentication for development
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
          console.log('🔐 Redirecting to connect (mock authentication)');
          next({ path: "/connect" });
          return;
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      next({ path: "/connect" });
      return;
    }
  }
  
  // Check minting mode requirements
  if (to.meta.requiresMintingMode) {
    const isMintingMode = localStorage.getItem('mintingMode') === 'true' || 
                        window.location.search.includes('branch=minting');
    if (!isMintingMode) {
      console.log('💎 Redirecting to home (minting mode required)');
      next('/');
      return;
    }
  }
  
  next();
});

export default router;

