
<template>
  <DefaultLayout ref="layoutRef">
    <router-view @auth-change="onAuthChange" />
  </DefaultLayout>
</template>

<script setup>
import { ref } from 'vue';
import DefaultLayout from './components/DefaultLayout.vue';
const layoutRef = ref();
function onAuthChange() {
  if (layoutRef.value && layoutRef.value.fetchUser) {
    layoutRef.value.fetchUser();
  }
}
</script>
