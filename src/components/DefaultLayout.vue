<template>
  <div class="flex h-screen w-screen items-center justify-center bg-white text-black" v-if="loading">loading...</div>
  <template v-else>
    <nav class="border-primary/20 border-b bg-black bg-gradient-to-r from-primary/5 from-5% to-95% via-black to-primary/5">
      
      <router-link to="/" class="logo">Heroine's Dragon</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/how-to-play">How to Play</router-link>
      <router-link to="/web3">Blockchain</router-link>
      <div class="relative dropdown">
        <template v-if="userStore.user">
          <div class="cursor-pointer px-5 flex items-center min-h-[45px] h-[45px] max-h-[45px] gap-2 rounded border-x border-primary/20 justify-center" @click="showDropdown = !showDropdown">
            <img v-if="avatarOrigin == 'custom'" :src="userStore.user.avatar_url" alt="Custom Avatar" class="aw-8 ah-10 rounded-full bg-black" />
            <img v-if="avatarOrigin == 'default'" src="/icons/icon.png" alt="Default Avatar" class="aw-8 ah-8 rounded-full bg-black" />
            <img v-if="avatarOrigin == 'google'" :src="googleAvatarUrl" alt="Google Avatar" class="aw-8 ah-8 rounded-full bg-black" />
            <span class="text-sm">{{ userStore.user.email }}</span>
            <svg class="h-5 w-5" fill="#fff" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div v-if="showDropdown" class="absolute right-0 -mt-px z-50 w-full bg-black border border-primary/20">
            <router-link to="/world" class="max-h-[36px] block border-y">World</router-link>
            <router-link to="/city" class="max-h-[36px] block border-y group">City [<span class="text-primary group-hover:text-black">{{ currentCity }}</span>]</router-link>
            <router-link to="/characters" class="max-h-[36px] block border-y">Characters</router-link>
            <router-link to="/academy" class="max-h-[36px] block border-y">Academy</router-link>
            <router-link to="/treasury" class="max-h-[36px] block border-y">Treasury</router-link>
            <router-link to="/settings" class="max-h-[36px] block border-y">Settings</router-link>
            <router-link to="/profile" class="max-h-[36px] block border-y">Profile</router-link>
            <router-link to="/nft-marketplace" class="max-h-[36px] block border-y">Marketplace</router-link>
            <a class="max-h-[36px] block cursor-pointer border-y" @click="logout">Logout</a>
          </div>
        </template>
        <template v-else>
          <router-link to="/connect">Play</router-link>
        </template>
      </div>
      
    </nav>

    <main>
      <slot />
    </main>

    <footer class="relative bg-black text-white/80" :class="{ 'pt-12 pb-3': homePage }">
      <!-- <img src="/images/city01.jpg" alt="" class="inset-0 w-full h-full opacity-10 absolute z-0 object-cover" /> -->
      <div v-if="homePage" class="relative z-10 grid w-full grid-cols-1 gap-2 px-10 md:grid-cols-6">
        <div class="flex flex-col">
          <router-link to="/" class="logo !text-xl">Heroine's Dragon</router-link>
          <p class="mt-1 mb-3 text-sm">
            Enter the World of Tiamat, where legends awaken, creatures soar, and every resident shapes the fate<br />
            of unfolding realms.
          </p>
          <div class="flex items-center gap-1">
            <a href="#" aria-label="X" class="-ml-1 fill-white/80 hover:fill-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
                <path d="M26.37,26l-8.795-12.822l0.015,0.012L25.52,4h-2.65l-6.46,7.48L11.28,4H4.33l8.211,11.971L12.54,15.97L3.88,26h2.65 l7.182-8.322L19.42,26H26.37z M10.23,6l12.34,18h-2.1L8.12,6H10.23z"></path>
              </svg>
            </a>
            <a href="#" aria-label="Email" class="hover:text-[#ea4335]">
              <svg width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </a>
            <a href="#" aria-label="Discord" class="fill-white/80 hover:fill-[#5865f2]">
              <svg width="38" height="38" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.59 5.88997C17.36 5.31997 16.05 4.89997 14.67 4.65997C14.5 4.95997 14.3 5.36997 14.17 5.69997C12.71 5.47997 11.26 5.47997 9.83001 5.69997C9.69001 5.36997 9.49001 4.95997 9.32001 4.65997C7.94001 4.89997 6.63001 5.31997 5.40001 5.88997C2.92001 9.62997 2.25001 13.28 2.58001 16.87C4.23001 18.1 5.82001 18.84 7.39001 19.33C7.78001 18.8 8.12001 18.23 8.42001 17.64C7.85001 17.43 7.31001 17.16 6.80001 16.85C6.94001 16.75 7.07001 16.64 7.20001 16.54C10.33 18 13.72 18 16.81 16.54C16.94 16.65 17.07 16.75 17.21 16.85C16.7 17.16 16.15 17.42 15.59 17.64C15.89 18.23 16.23 18.8 16.62 19.33C18.19 18.84 19.79 18.1 21.43 16.87C21.82 12.7 20.76 9.08997 18.61 5.88997H18.59ZM8.84001 14.67C7.90001 14.67 7.13001 13.8 7.13001 12.73C7.13001 11.66 7.88001 10.79 8.84001 10.79C9.80001 10.79 10.56 11.66 10.55 12.73C10.55 13.79 9.80001 14.67 8.84001 14.67ZM15.15 14.67C14.21 14.67 13.44 13.8 13.44 12.73C13.44 11.66 14.19 10.79 15.15 10.79C16.11 10.79 16.87 11.66 16.86 12.73C16.86 13.79 16.11 14.67 15.15 14.67Z" />
              </svg>
            </a>
          </div>
          <div class="mt-auto flex items-center gap-2 text-xs text-white">
            <span class="text-gray">v0.0.3</span>
            <span class="bg-success aw-2 ah-2 animate-pulse rounded-full"></span>
            <span>All Systems Online</span>
          </div>
        </div>
        <div class="flex flex-col justify-start text-right">
          <h4 class="mb-2 font-semibold">About</h4>
          <ul class="space-y-1">
            <li><a href="#" class="hover:text-primary text-xs">Partners</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Tokenomics</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Roadmap</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Litepaper</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Investors</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Careers</a></li>
          </ul>
        </div>
        <div class="flex flex-col justify-start text-right">
          <h4 class="mb-2 font-semibold">Web3</h4>
          <ul class="space-y-1">
            <li><a href="#" class="hover:text-primary text-xs">GameFi Features</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Defi Protocols</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Play to Earn (P2E)</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Play and Own (PAO)</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Cryptocurrency (Token)</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Collectibles (NFTs)</a></li>
          </ul>
        </div>
        <div class="flex flex-col justify-start text-right">
          <h4 class="mb-2 font-semibold">Zeraphiora</h4>
          <ul class="space-y-1">
            <li><a href="#" class="hover:text-primary text-xs">Demographics</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Government (DAO)</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Geography</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Economy</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Culture</a></li>
            <li><a href="#" class="hover:text-primary text-xs">History</a></li>
          </ul>
        </div>
        <div class="flex flex-col justify-start text-right">
          <h4 class="mb-2 font-semibold">How to Play</h4>
          <ul class="space-y-1">
            <li><a href="#" class="hover:text-primary text-xs">Getting Started</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Gameplay Mechanics</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Tips and Tricks</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Resources</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Strategies</a></li>
            <li><a href="#" class="hover:text-primary text-xs">FAQs</a></li>
          </ul>
        </div>

        <div class="flex flex-col justify-start text-right">
          <h4 class="mb-2 font-semibold">Community</h4>
          <ul class="space-y-1">
            <li><a href="#" class="hover:text-primary text-xs">Backlog</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Creator Program</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Community Guidelines</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Seasons and Events</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Referral Program</a></li>
            <li><a href="#" class="hover:text-primary text-xs">Support</a></li>
          </ul>
        </div>
      </div>
      <p class="text-gray w-full text-center text-xs" :class="homePage ? 'pt-12' : 'py-2'">&copy; {{ year }} Tiamat. All rights reserved.</p>
    </footer>
  </template>
</template>

<script setup>
import { onMounted, onUnmounted, watch, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();
const avatarOrigin = ref("default");
const loading = ref(true);
const year = new Date().getFullYear();
const homePage = ref(false);
const showDropdown = ref(false);
const currentCity = ref("Zeraphiora");

function handleClickOutside(event) {
  const dropdown = document.querySelector(".relative.dropdown");
  if (dropdown && !dropdown.contains(event.target)) {
    showDropdown.value = false;
  }
}

const googleAvatarUrl = computed(() => {
  if (userStore.user && Array.isArray(userStore.user.identities)) {
    const googleIdentity = userStore.user.identities.find((id) => id.provider === "google");
    if (googleIdentity && googleIdentity.identity_data && googleIdentity.identity_data.avatar_url) {
      return googleIdentity.identity_data.avatar_url;
    }
  }
  return "";
});

function getAvatarOrigin(user) {
  if (user && user.avatar_url && user.avatar_url.trim() !== "") {
    return "custom";
  }

  if (user && Array.isArray(user.identities) && user.identities.some((id) => id.provider === "google") && (!user.avatar_url || user.avatar_url.trim() === "")) {
    return "google";
  }

  return "default";
}

onMounted(async () => {
  await userStore.fetchUser();
  avatarOrigin.value = getAvatarOrigin(userStore.user);
  // console.log("User fetched:", userStore.user);
  loading.value = false;
  homePage.value = router.currentRoute.value.path === "/";
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

async function logout() {
  await userStore.logout();
  router.push("/");
}

watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    showDropdown.value = false;
    homePage.value = newPath === "/";
  },
);
</script>
