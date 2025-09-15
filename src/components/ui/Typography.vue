<template>
  <component 
    :is="tag"
    :class="[
      'typography',
      `typography-${variant}`,
      `typography-${size}`,
      {
        [`typography-${weight}`]: weight,
        [`typography-${align}`]: align !== 'left',
        'typography-gradient': gradient
      }
    ]"
  >
    <slot />
  </component>
</template>

<script setup>
const props = defineProps({
  tag: {
    type: String,
    default: 'p',
    validator: (value) => ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'label'].includes(value)
  },
  variant: {
    type: String,
    default: 'body',
    validator: (value) => ['display', 'title', 'subtitle', 'body', 'caption', 'label'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'].includes(value)
  },
  weight: {
    type: String,
    default: null,
    validator: (value) => !value || ['light', 'normal', 'medium', 'semibold', 'bold'].includes(value)
  },
  align: {
    type: String,
    default: 'left',
    validator: (value) => ['left', 'center', 'right', 'justify'].includes(value)
  },
  gradient: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.typography {
  color: var(--foreground);
}

/* Variants */
.typography-display {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  line-height: 1.1;
}

.typography-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  line-height: 1.2;
}

.typography-subtitle {
  font-weight: 500;
  line-height: 1.3;
  color: var(--muted-foreground);
}

.typography-body {
  font-weight: 400;
  line-height: 1.5;
}

.typography-caption {
  font-weight: 400;
  line-height: 1.4;
  color: var(--muted-foreground);
}

.typography-label {
  font-weight: 500;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Sizes */
.typography-xs { font-size: 0.75rem; }
.typography-sm { font-size: 0.875rem; }
.typography-md { font-size: 1rem; }
.typography-lg { font-size: 1.125rem; }
.typography-xl { font-size: 1.25rem; }
.typography-2xl { font-size: 1.5rem; }
.typography-3xl { font-size: 2rem; }
.typography-4xl { font-size: 2.25rem; line-height: 2.5rem; }
.typography-5xl { font-size: 3rem; line-height: 1; }
.typography-6xl { font-size: 3.75rem; line-height: 1; }
.typography-7xl { font-size: 4.5rem; line-height: 1; }

/* Weights */
.typography-light { font-weight: 300; }
.typography-normal { font-weight: 400; }
.typography-medium { font-weight: 500; }
.typography-semibold { font-weight: 600; }
.typography-bold { font-weight: 700; }

/* Alignment */
.typography-center { text-align: center; }
.typography-right { text-align: right; }
.typography-justify { text-align: justify; }

/* Gradient text */
.typography-gradient {
  background: linear-gradient(135deg, var(--foreground) 0%, var(--muted-foreground) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
