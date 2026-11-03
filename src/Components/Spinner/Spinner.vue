<script setup lang="ts">
import Tag from '../../core/Tag'
defineOptions({ name: 'Spinner' })

withDefaults(defineProps<{
  /** `border` (default), `grow` or `rotate`. */
  type?: 'border' | 'grow' | 'rotate'
  /** Small spinner (`.spinner-sm`). */
  small?: boolean
  /** Screen-reader text. */
  label?: string
  as?: string
}>(), { type: 'border', small: false, label: 'Loading...', as: 'span' })
</script>

<template>
  <Tag :as="as" :class="[`spinner-${type}`, { 'spinner-sm': small }]" role="status">
    <span class="visually-hidden">{{ label }}</span>
  </Tag>
</template>
