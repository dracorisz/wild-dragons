<template>
  <div class="progress-container">
    <div v-if="label" class="progress-label">
      <Typography variant="caption" size="sm">{{ label }}</Typography>
      <Typography v-if="showValue" variant="caption" size="sm">
        {{ current }}/{{ max }}
      </Typography>
    </div>
    
    <div 
      class="progress-track"
      :class="`progress-${variant}`"
    >
      <div 
        class="progress-fill"
        :class="`progress-fill-${variant}`"
        :style="{ 
          width: `${percentage}%`,
          transition: animated ? 'width 0.3s ease' : 'none'
        }"
      >
        <div v-if="showPercentage" class="progress-text">
          {{ Math.round(percentage) }}%
        </div>
      </div>
    </div>
    
    <div v-if="description" class="progress-description">
      <Typography variant="caption" size="xs">{{ description }}</Typography>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Typography from './Typography.vue'

const props = defineProps({
  current: {
    type: Number,
    required: true
  },
  max: {
    type: Number,
    required: true
  },
  label: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
  },
  showValue: {
    type: Boolean,
    default: true
  },
  showPercentage: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: true
  }
})

const percentage = computed(() => {
  if (props.max === 0) return 0
  return Math.min(100, Math.max(0, (props.current / props.max) * 100))
})
</script>

<style scoped>
.progress-container {
  width: 100%;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-track {
  width: 100%;
  height: 0.75rem;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-primary {
  background-color: var(--muted);
}

.progress-secondary {
  background-color: var(--muted);
}

.progress-success {
  background-color: var(--muted);
}

.progress-warning {
  background-color: var(--muted);
}

.progress-danger {
  background-color: var(--muted);
}

.progress-fill {
  height: 100%;
  border-radius: 9999px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-fill-primary {
  background-color: var(--primary);
}

.progress-fill-secondary {
  background-color: var(--secondary);
}

.progress-fill-success {
  background-color: var(--success);
}

.progress-fill-warning {
  background-color: var(--warning);
}

.progress-fill-danger {
  background-color: var(--destructive);
}

.progress-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.progress-description {
  margin-top: 0.25rem;
}
</style>
