<script setup lang="ts">
import type { Size, ThemeColor } from '../../core/types'

defineOptions({ name: 'Avatar' })

withDefaults(defineProps<{
  /** Image URL. */
  src?: string
  /** Alt text of the image. */
  alt?: string
  /** Initials / text shown when there is no image. */
  initials?: string
  /** `xs`, `sm`, `lg` or `xl` (default size when omitted). */
  size?: Exclude<Size, 'md'>
  /** Presence indicator (`.avatar-status.status-*`). */
  status?: 'online' | 'offline' | 'away' | 'busy'
  /** Subtle (tinted) background (`.avatar-subtle`). */
  subtle?: boolean
  /** Theme color for initials avatars (`.theme-*`). */
  theme?: ThemeColor
  /** Accessible label of the status dot. Defaults to the capitalized status. */
  statusLabel?: string
}>(), { alt: '', subtle: false })
</script>

<template>
  <span class="avatar" :class="[size && `avatar-${size}`, theme && `theme-${theme}`, { 'avatar-subtle': subtle }]">
    <img v-if="src" class="avatar-img" :src="src" :alt="alt">
    <slot v-else>{{ initials }}</slot>
    <span v-if="status" class="avatar-status" :class="`status-${status}`" role="img" :aria-label="statusLabel ?? status.charAt(0).toUpperCase() + status.slice(1)" />
  </span>
</template>
