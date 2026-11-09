<script setup lang="ts">
import { inject } from 'vue'
import type { Size } from '../../core/types'

defineOptions({ name: 'MenuToggle', inheritAttrs: false })

withDefaults(defineProps<{
  size?: Exclude<Size, 'md' | 'xl'>
  /** Split-button toggle without label (`.menu-toggle-split`). */
  split?: boolean
  disabled?: boolean
  /** Render another tag/component instead of a button (e.g. `a`, `span`). */
  as?: string
}>(), { split: false, disabled: false })

const menu = inject<{ toggle: () => unknown } | null>('bsMenu', null)

function onClick(event: MouseEvent) {
  event.preventDefault()
  menu?.toggle()
}
</script>

<template>
  <button
    v-bind="$attrs"
    :size="size"
    :disabled="disabled"
    :as="as"
    :class="{ 'menu-toggle-split': split }"
    data-bs-toggle="menu"
    aria-expanded="false"
    aria-haspopup="menu"
    @click="onClick"
  >
    <slot />
  </button>
</template>
