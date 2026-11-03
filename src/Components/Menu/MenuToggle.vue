<script setup lang="ts">
import { inject } from 'vue'
import Button from '../Button/Button.vue'
import type { Size, ThemeColor } from '../../core/types'

defineOptions({ name: 'MenuToggle', inheritAttrs: false })

withDefaults(defineProps<{
  variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'styled' | 'link'
  theme?: ThemeColor
  size?: Exclude<Size, 'md' | 'xl'>
  /** Split-button toggle without label (`.menu-toggle-split`). */
  split?: boolean
  disabled?: boolean
  /** Render another tag/component instead of a button (e.g. `a`, `span`). */
  as?: string
}>(), { variant: 'solid', theme: 'secondary', split: false, disabled: false })

const menu = inject<{ toggle: () => unknown } | null>('bsMenu', null)

function onClick(event: MouseEvent) {
  event.preventDefault()
  menu?.toggle()
}
</script>

<template>
  <Button
    v-bind="$attrs"
    :variant="variant"
    :theme="theme"
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
  </Button>
</template>
