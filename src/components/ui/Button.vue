<template>
  <component 
    :is="tag"
    class="btn"
    :class="[
      `btn-${variant}`,
      `btn-${size}`,
      {
        'btn-loading': loading,
        'btn-disabled': disabled
      }
    ]"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-spinner">⟳</span>
    <span v-if="icon && !loading" class="btn-icon">{{ icon }}</span>
    <span class="btn-content">
      <slot />
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline', 'ghost', 'destructive'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: null
  },
  tag: {
    type: String,
    default: 'button'
  },
  href: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['click'])

const computedTag = computed(() => {
  if (props.href) return 'a'
  return props.tag
})

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
