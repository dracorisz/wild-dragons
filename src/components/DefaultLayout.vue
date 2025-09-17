<template>
  <nav>
    <router-link to="/" class="font-nav color-primary">Heroine's Dragons</router-link>
    <router-link to="/hero">Hero</router-link>
    <router-link to="/academy">Academy</router-link>
    <router-link to="/treasure">Treasure</router-link>
    <template v-if="userStore.user">
      <router-link class="fixed top-20 left-10 bg-black" :to="'/game'">{{ userStore.user.username || userStore.user.email }}</router-link>
      <a class="cursor-pointer" @click="logout">Logout</a>
    </template>
    <template v-else>
      <router-link to="/connect">Connect</router-link>
    </template>
  </nav>
  <main>
    <slot />
  </main>
  <footer class="bg-black">
    <p class="mt-auto py-2 text-center text-xs text-gray-300">&copy; 2025 Wild Dragons. All rights reserved.</p>
  </footer>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
const router = useRouter();
const userStore = useUserStore();
onMounted(() => {
  userStore.fetchUser();
});
async function logout() {
  await userStore.logout();
  router.push("/");
}
</script>
