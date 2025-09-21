<template>
  <div class="flex h-screen w-screen items-center justify-center bg-white text-black" v-if="loading">loading...</div>
  <template v-else>
    <nav>
      <router-link to="/" class="font-nav text-primary">Heroine's Dragon</router-link>
      <router-link to="/characters">Characters</router-link>
      <router-link to="/city">City</router-link>
      <router-link to="/world">World</router-link>
      <router-link to="/academy">Academy</router-link>
      <router-link to="/treasure">Treasure</router-link>
      <template v-if="userStore.user">
        <router-link class="flex items-center justify-center gap-3 !pl-2" :to="'/game'">
          <img v-if="avatarOrigin == 'custom'" :src="userStore.user.avatar_url" alt="Custom Avatar" class="aw-10 ah-10 rounded-full bg-black" />
          <img v-if="avatarOrigin == 'default'" src="/icons/icon.png" alt="Default Avatar" class="aw-10 ah-10 rounded-full bg-black" />
          <img v-if="avatarOrigin == 'google'" :src="googleAvatarUrl" alt="Google Avatar" class="aw-10 ah-10 rounded-full bg-black" />
          <span class="text-xs">{{ userStore.user.email }}</span>
        </router-link>
        <a class="cursor-pointer" @click="logout">Logout</a>
      </template>
      <template v-else>
        <router-link to="/connect">Play</router-link>
      </template>
    </nav>
    <main>
      <slot />
    </main>
    <footer class="bg-black">
      <p class="text-gray mt-auto py-2 text-center text-xs">&copy; 2025 Wild Dragons. All rights reserved.</p>
    </footer>
  </template>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();
const avatarOrigin = ref("default");
const loading = ref(true);

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
  console.log("User fetched:", userStore.user);
  loading.value = false;
});

async function logout() {
  await userStore.logout();
  router.push("/");
}
</script>
