<template>
  <div class="checkbox-wrapper flex items-center space-x-2">
    <div class="relative">
      <input
        :id="inputId"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
        class="sr-only"
      />
      <label
        :for="inputId"
        class="checkbox-custom flex items-center justify-center w-5 h-5 rounded border-2 border-border cursor-pointer transition-all duration-200 hover:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        :class="[
          modelValue 
            ? 'bg-primary border-primary text-background' 
            : 'bg-background hover:bg-muted',
          disabled && 'opacity-50 cursor-not-allowed'
        ]"
      >
        <svg
          v-if="modelValue"
          class="w-3 h-3 text-background"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </label>
    </div>
    
    <Typography
      v-if="label"
      tag="label"
      :for="inputId"
      variant="body"
      :size="size === 'sm' ? 'sm' : 'base'"
      class="cursor-pointer select-none"
      :class="[
        disabled && 'opacity-50 cursor-not-allowed'
      ]"
    >
      {{ label }}
    </Typography>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Typography from './Typography.vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'base',
    validator: (value) => ['sm', 'base', 'lg'].includes(value)
  },
  id: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const inputId = computed(() => props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`)

const handleChange = (event) => {
  if (!props.disabled) {
    emit('update:modelValue', event.target.checked)
  }
}
</script>

<style scoped>
.checkbox-custom {
  transition: all 0.2s ease-in-out;
}

.checkbox-custom:focus-within {
  box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
}

.checkbox-wrapper:hover .checkbox-custom {
  transform: scale(1.05);
}

.checkbox-wrapper:active .checkbox-custom {
  transform: scale(0.95);
}
</style>