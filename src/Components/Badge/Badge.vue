<script setup lang="ts">
import Tag from '../../core/Tag'
import type { ThemeColor } from '../../core/types'

defineOptions({ name: 'Badge' })

withDefaults(defineProps<{
  /** Theme color (`.theme-*`). */
  theme?: ThemeColor
  /** Visual variant. */
  variant?: 'solid' | 'subtle' | 'outline'
  /** Larger badge (`.badge-lg`). */
  large?: boolean
  /** Fully rounded (`.rounded-pill`). */
  pill?: boolean
  /** HTML tag. */
  as?: string
}>(), { theme: 'primary', variant: 'solid', large: false, pill: false, as: 'span' })
</script>

<template>
  <Tag :as="as" class="badge" :class="[`theme-${theme}`, { 'badge-subtle': variant === 'subtle', 'badge-outline': variant === 'outline', 'badge-lg': large, 'rounded-pill': pill }]">
    <slot />
  </Tag>
</template>
