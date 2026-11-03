<script setup lang="ts">
import { computed } from 'vue'
import Button from '../Button/Button.vue'
import { useOverlay } from '../../core/registry'
import type { Size, ThemeColor } from '../../core/types'

defineOptions({ name: 'DrawerButton' })

const props = withDefaults(defineProps<{
  /** `name` of the `Drawer` to open (the drawer's `name` prop = its `id`). */
  name: string
  /** `toggle` (default, like `data-bs-toggle="drawer"`), `show` or `hide`. */
  action?: 'toggle' | 'show' | 'hide'
  variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'styled' | 'link'
  theme?: ThemeColor
  size?: Exclude<Size, 'md' | 'xl'>
  icon?: boolean
  disabled?: boolean
  active?: boolean
}>(), { action: 'toggle', variant: 'solid', theme: 'primary', icon: false, disabled: false, active: false })

const emit = defineEmits<{
  /** Fired before the drawer is opened; `event.preventDefault()` cancels it. */
  (e: 'click', event: MouseEvent): void
}>()

const overlay = computed(() => useOverlay(props.name))

function onClick(event: MouseEvent) {
  emit('click', event)
  if (!event.defaultPrevented) overlay.value[props.action]()
}
</script>

<template>
  <Button :variant="variant" :theme="theme" :size="size" :icon="icon" :disabled="disabled" :active="active" :aria-controls="name" :aria-expanded="overlay.isOpen" @click="onClick">
    <slot />
  </Button>
</template>
