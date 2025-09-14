<template>
  <div 
    v-if="visible"
    :class="type === 'auth' ? 'modal-auth' : 'modal-overlay'"
    @click="handleOverlayClick"
  >
    <div 
      class="modal-container"
      :class="[
        `modal-${size}`,
        {
          'modal-fullscreen': fullscreen
        }
      ]"
      @click.stop
    >
      <!-- Modal Header -->
      <div v-if="!hideHeader" class="modal-header">
        <div class="modal-title-section">
          <Typography v-if="title" tag="h2" variant="title" size="lg">
            {{ title }}
          </Typography>
          <Typography v-if="subtitle" variant="subtitle" size="sm">
            {{ subtitle }}
          </Typography>
        </div>
        
        <Button
          v-if="closable"
          variant="ghost"
          size="sm"
          @click="close"
          class="modal-close-btn"
        >
          ✕
        </Button>
      </div>

      <!-- Modal Content -->
      <div class="modal-content">
        <slot />
      </div>

      <!-- Modal Footer -->
      <div v-if="$slots.footer" class="modal-footer">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch } from 'vue'
import Button from './Button.vue'
import Typography from './Typography.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'standard',
  },
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closable: {
    type: Boolean,
    default: true
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  hideHeader: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'update:visible'])

const close = () => {
  emit('close')
  emit('update:visible', false)
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    close()
  }
}

// Handle escape key
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleEscape)
    document.body.style.overflow = ''
  }
})

const handleEscape = (event) => {
  if (event.key === 'Escape' && props.closable) {
    close()
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background-color: var(--background);
  border-radius: 0.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
}

.modal-sm {
  width: 100%;
  max-width: 24rem;
}

.modal-md {
  width: 100%;
  max-width: 32rem;
}

.modal-lg {
  width: 100%;
  max-width: 48rem;
}

.modal-xl {
  width: 100%;
  max-width: 64rem;
}

.modal-fullscreen {
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  border-radius: 0;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem 1.5rem 0 1.5rem;
  border-bottom: 1px solid var(--border);
  padding-bottom: 1rem;
}

.modal-title-section {
  flex: 1;
}

.modal-close-btn {
  margin-left: 1rem;
  flex-shrink: 0;
}

.modal-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem 1.5rem 1.5rem 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Mobile responsiveness */
@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
  }
  
  .modal-container:not(.modal-fullscreen) {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}
</style>
