<template>
  <div v-if="visible" class="toast">{{ message }}</div>
</template>

<script setup>
import { ref, watch } from "vue";
const props = defineProps({ message: String, show: Boolean });
const visible = ref(props.show);
watch(
  () => props.show,
  (val) => {
    visible.value = val;
    if (val) setTimeout(() => (visible.value = false), 3000);
  },
);
</script>
