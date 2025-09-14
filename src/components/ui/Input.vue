<template>
  <div class="input-group">
    <label v-if="label" :for="id" class="input-label">
      <Typography variant="label" size="sm">{{ label }}</Typography>
      <span v-if="required" class="input-required">*</span>
    </label>
    
    <div class="input-wrapper">
      <span v-if="prefixIcon" class="input-icon input-prefix">{{ prefixIcon }}</span>
      
      <component
        :is="inputComponent"
        :id="id"
        :value="modelValue"
        @input="handleInput"
        @change="handleInput"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :rows="multiline ? rows : undefined"
        :class="[
          'input-field',
          {
            'input-error': error,
            'input-disabled': disabled,
            'input-with-prefix': prefixIcon,
            'input-with-suffix': suffixIcon || suffix
          }
        ]"
        v-bind="$attrs"
      />
      
      <span v-if="suffixIcon" class="input-icon input-suffix">{{ suffixIcon }}</span>
      <span v-if="suffix" class="input-suffix-text">{{ suffix }}</span>
    </div>
    
    <div v-if="error || helper" class="input-feedback">
      <Typography 
        v-if="error" 
        variant="caption" 
        size="sm"
        class="input-error-text"
      >
        {{ error }}
      </Typography>
      <Typography 
        v-else-if="helper" 
        variant="caption" 
        size="sm"
        class="input-helper-text"
      >
        {{ helper }}
      </Typography>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Typography from './Typography.vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  label: {
    type: String,
    default: null
  },
  placeholder: {
    type: String,
    default: ''
  },
  helper: {
    type: String,
    default: null
  },
  error: {
    type: String,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  prefixIcon: {
    type: String,
    default: null
  },
  suffixIcon: {
    type: String,
    default: null
  },
  suffix: {
    type: String,
    default: null
  },
  multiline: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:modelValue'])

const id = ref(`input-${Math.random().toString(36).substr(2, 9)}`)

const inputComponent = computed(() => {
  return props.multiline ? 'textarea' : 'input'
})

const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.input-group {
  width: 100%;
}

.input-label {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.input-required {
  color: var(--destructive);
  margin-left: 0.25rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background-color: var(--background);
  color: var(--foreground);
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(var(--primary), 0.1);
}

.input-field::placeholder {
  color: var(--muted-foreground);
}

.input-with-prefix {
  padding-left: 3rem;
}

.input-with-suffix {
  padding-right: 3rem;
}

.input-icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  pointer-events: none;
  z-index: 1;
}

.input-prefix {
  left: 1rem;
}

.input-suffix {
  right: 1rem;
}

.input-suffix-text {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground);
  font-size: 0.875rem;
  pointer-events: none;
}

.input-error {
  border-color: var(--destructive);
}

.input-error:focus {
  border-color: var(--destructive);
  box-shadow: 0 0 0 2px rgba(var(--destructive), 0.1);
}

.input-disabled {
  background-color: var(--muted);
  color: var(--muted-foreground);
  cursor: not-allowed;
}

.input-feedback {
  margin-top: 0.5rem;
}

.input-error-text {
  color: var(--destructive);
}

.input-helper-text {
  color: var(--muted-foreground);
}

textarea.input-field {
  resize: vertical;
  min-height: 4rem;
}
</style>
