<template>
  <div class="page">
    <h2>World</h2>
    <p>Welcome to the World of Wild Dragons.</p>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../stores/user";
const router = useRouter();
const userStore = useUserStore();

onMounted(async () => {
  const isAuth = await userStore.fetchUser();
  if (!isAuth) {
    router.push("/connect");
    return;
  }
  await userStore.syncUserProfile();
});
</script>