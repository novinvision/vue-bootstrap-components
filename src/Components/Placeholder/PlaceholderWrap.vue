<script setup lang="ts">
import Tag from '../../core/Tag'
defineOptions({ name: 'PlaceholderWrap' })

withDefaults(defineProps<{
  /** Animation: `glow`, `wave` or `pulse`. */
  animation?: 'glow' | 'wave' | 'pulse'
  as?: string
}>(), { animation: 'glow', as: 'div' })
</script>

<template>
  <Tag :as="as" :class="`placeholder-${animation}`" aria-hidden="true"><slot /></Tag>
</template>
