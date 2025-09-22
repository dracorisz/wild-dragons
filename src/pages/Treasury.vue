<template>
  <div class="page">
    <h2>Treasure</h2>
    <p>Find and manage your treasures here.</p>
    <img src="../assets/images/heroine0001.png" alt="Treasure Image" class="absolute bottom-0 left-0 h-[540px] -scale-x-100 brightness-125" />
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
