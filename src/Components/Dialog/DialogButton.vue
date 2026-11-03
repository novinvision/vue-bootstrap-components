<script setup lang="ts">
import Button from '../Button/Button.vue'
import { useOverlay } from '../../core/registry'
import type { Size, ThemeColor } from '../../core/types'

defineOptions({ name: 'DialogButton' })

const props = withDefaults(defineProps<{
  /** `name` of the `Dialog` to open (the dialog's `name` prop = its `id`). */
  name: string
  /** `toggle` (default, like `data-bs-toggle="dialog"`), `show` or `hide`. */
  action?: 'toggle' | 'show' | 'hide'
  /** Button style, same as `Button`. */
  variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'styled' | 'link'
  theme?: ThemeColor
  size?: Exclude<Size, 'md' | 'xl'>
  icon?: boolean
  disabled?: boolean
  active?: boolean
}>(), { action: 'toggle', variant: 'solid', theme: 'primary', icon: false, disabled: false, active: false })

const emit = defineEmits<{
  /** Fired before the dialog is opened; `event.preventDefault()` cancels it. */
  (e: 'click', event: MouseEvent): void
}>()

function onClick(event: MouseEvent) {
  emit('click', event)
  if (!event.defaultPrevented) useOverlay(props.name)[props.action]()
}
</script>

<template>
  <Button :variant="variant" :theme="theme" :size="size" :icon="icon" :disabled="disabled" :active="active" aria-haspopup="dialog" :aria-controls="name" @click="onClick">
    <slot />
  </Button>
</template>
