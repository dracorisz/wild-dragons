<template>
  <div class="bg-background text-foreground min-h-screen">
    <!-- Navigation Header -->
    <nav class="bg-primary border-border border-b shadow-lg">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2">
              <div class="text-primary-foreground text-2xl font-bold">{{ gameIcon }}</div>
              <span class="text-primary-foreground text-xl font-bold">{{ gameTitle }}</span>
            </router-link>
          </div>

          <!-- Navigation Links & Auth Status -->
          <div class="hidden items-center space-x-4 md:flex">
            <div class="flex items-baseline space-x-4">
              <router-link to="/play" class="nav-link" active-class="nav-link-active">
                {{ navPlay }}
              </router-link>
              <router-link v-if="authStore.isAuthenticated" to="/profile" class="nav-link" active-class="nav-link-active">
                {{ navProfile }}
              </router-link>
            </div>

            <!-- User Status -->
            <div class="flex items-center space-x-2">
              <!-- Offline Indicator -->
              <div v-if="!isOnline" class="text-warning flex items-center space-x-1">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
                <span class="text-xs">Offline</span>
              </div>

              <div v-if="authStore.isAuthenticated" class="flex items-center space-x-3">
                <div class="text-right">
                  <div class="text-primary-foreground/80 text-sm">{{ authStore.profile?.username }}</div>
                  <div class="text-primary-foreground/60 text-xs">Player • Level {{ authStore.currentLevel }}</div>
                </div>
                <div class="text-right">
                  <div class="text-accent text-sm font-bold">{{ authStore.totalPoints.toLocaleString() }}</div>
                  <div class="text-primary-foreground/60 text-xs">Points</div>
                </div>
                <Button @click="handleSignOut" variant="ghost" size="sm" class="text-primary-foreground/80 hover:text-primary-foreground"> Sign Out </Button>
              </div>
              <div v-else>
                <router-link to="/auth"  class="nav-link" active-class="nav-link-active"> Sign In </router-link>
              </div>
            </div>
          </div>

          <!-- Mobile menu button -->
          <div class="md:hidden">
            <Button @click="toggleMobileMenu" variant="ghost" size="sm" class="text-primary-foreground hover:bg-primary-hover focus:ring-accent focus:ring-2">
              <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path :class="{ hidden: showMobileMenu, 'inline-flex': !showMobileMenu }" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                <path :class="{ hidden: !showMobileMenu, 'inline-flex': showMobileMenu }" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div :class="{ block: showMobileMenu, hidden: !showMobileMenu }" class="md:hidden">
        <div class="bg-primary-dark space-y-1 px-2 pt-2 pb-3 sm:px-3">
          <router-link to="/" class="mobile-nav-link" active-class="mobile-nav-link-active" @click="closeMobileMenu">
            {{ navHome }}
          </router-link>
          <router-link to="/play" class="mobile-nav-link" active-class="mobile-nav-link-active" @click="closeMobileMenu">
            {{ navPlay }}
          </router-link>
          <router-link v-if="authStore.isAuthenticated" to="/profile" class="mobile-nav-link" active-class="mobile-nav-link-active" @click="closeMobileMenu">
            {{ navProfile }}
          </router-link>

          <!-- Mobile Auth Section -->
          <div class="border-primary-foreground/20 mt-3 border-t pt-3">
            <!-- Offline Indicator -->
            <div v-if="!isOnline" class="text-warning mb-3 flex items-center justify-center space-x-1">
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs">Offline</span>
            </div>

            <div v-if="authStore.isAuthenticated" class="space-y-2 text-center">
              <div class="text-primary-foreground/80 text-sm">{{ authStore.profile?.username }}</div>
              <div class="text-primary-foreground/60 text-xs">Player • Level {{ authStore.currentLevel }}</div>
              <div class="text-accent text-sm font-bold">{{ authStore.totalPoints.toLocaleString() }} Points</div>
              <Button @click="handleSignOut" variant="ghost" size="sm" class="w-full text-center"> Sign Out </Button>
            </div>
            <div v-else>
              <router-link to="/auth" class="mobile-nav-link w-full text-center"> Sign In </router-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="bg-muted border-border border-t">
      <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div class="text-muted-foreground text-center">
          <p>&copy; 2025 {{ gameTitle }}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores";
import { Button } from "../components/ui";
import { pwaManager } from "../lib/pwa.js";
import themeManager from "../lib/themeManager.js";

const router = useRouter();
const authStore = useAuthStore();
const showMobileMenu = ref(false);
const isOnline = ref(navigator.onLine);

// Update online status
const updateOnlineStatus = () => {
  isOnline.value = navigator.onLine;
};

// Set up online/offline listeners
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

// Dynamic theme-aware content
const gameTitle = computed(() => themeManager.getText("ui.game_title"));
const gameIcon = computed(() => themeManager.getAsset("hero_icon"));
const navHome = computed(() => themeManager.getText("ui.nav_home"));
const navPlay = computed(() => themeManager.getText("ui.nav_play"));
const navProfile = computed(() => themeManager.getText("ui.nav_profile"));

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const closeMobileMenu = () => {
  showMobileMenu.value = false;
};

const handleSignOut = async () => {
  try {
    await authStore.signOut();
    router.push("/");
  } catch (error) {
    console.error("Sign out failed:", error);
  }
};
</script>

<style scoped>
.nav-link {
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--primary-foreground);
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: var(--primary-hover);
  color: white;
}

.nav-link-active {
  background-color: var(--accent);
  color: var(--accent-foreground);
}

.mobile-nav-link {
  display: block;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary-foreground);
  transition: all 0.2s;
}

.mobile-nav-link:hover {
  background-color: var(--primary-hover);
  color: white;
}

.mobile-nav-link-active {
  background-color: var(--accent);
  color: var(--accent-foreground);
}
</style>
