<script setup lang="ts">
import type { ThemeColor } from '../../core/types'

defineOptions({ name: 'Chip' })

withDefaults(defineProps<{
  theme?: ThemeColor
  /** Show a remove button; emits `dismiss`. */
  dismissible?: boolean
  dismissLabel?: string
}>(), { dismissible: false, dismissLabel: 'Remove' })

defineEmits<{ (e: 'dismiss', event: MouseEvent): void }>()
</script>

<template>
  <span class="chip" :class="theme && `theme-${theme}`">
    <slot />
    <button v-if="dismissible" type="button" class="chip-dismiss" :aria-label="dismissLabel" @click="$emit('dismiss', $event)">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="4" y1="4" x2="12" y2="12" /><line x1="12" y1="4" x2="4" y2="12" /></svg>
    </button>
  </span>
</template>
