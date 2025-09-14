<template>
  <div 
    class="card"
    :class="[
      `card-${variant}`,
      {
        'card-hoverable': hoverable,
        'card-clickable': clickable
      }
    ]"
    @click="handleClick"
  >
    <!-- Card Header -->
    <div v-if="$slots.header || title" class="card-header">
      <slot name="header">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </slot>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <slot />
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'outlined', 'elevated', 'filled', 'muted'].includes(value)
  },
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const handleClick = (event) => {
  if (props.clickable) {
    emit('click', event)
  }
}
</script>
