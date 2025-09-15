<template>
  <nav>
    <router-link to="/">Landing</router-link>
    <router-link to="/academy">Academy</router-link>
    <router-link to="/treasure">Treasure</router-link>
    <template v-if="userStore.user">
      <router-link :to="'/game'">{{ userStore.user.username || userStore.user.email }}</router-link>
      <a class="cursor-pointer" @click="logout">Logout</a>
    </template>
    <template v-else>
      <router-link to="/connect">Connect</router-link>
    </template>
  </nav>
  <main>
    <slot />
  </main>
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
