<script setup lang="ts">
import Tag from '../../core/Tag'
import type { ThemeColor } from '../../core/types'

defineOptions({ name: 'Card' })

withDefaults(defineProps<{
  /** Tinted background (`.card-subtle`). */
  subtle?: boolean
  /** Translucent background (`.card-translucent`). */
  translucent?: boolean
  /** Horizontal layout (`.card-row`). */
  row?: boolean
  /** Theme color (`.theme-*`). Combine with `subtle` for a softer look. */
  theme?: ThemeColor
  as?: string
}>(), { subtle: false, translucent: false, row: false, as: 'div' })
</script>

<template>
  <Tag :as="as" class="card" :class="[theme && `theme-${theme}`, { 'card-subtle': subtle, 'card-translucent': translucent, 'card-row': row }]">
    <slot />
  </Tag>
</template>
