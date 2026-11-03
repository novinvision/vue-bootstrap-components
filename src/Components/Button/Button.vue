<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'
import type { Size, ThemeColor } from '../../core/types'

defineOptions({ name: 'Button' })

const props = withDefaults(defineProps<{
  /** Button style: `solid`, `outline`, `subtle`, `text`, `styled` or `link`. */
  variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'styled' | 'link'
  /** Theme color (`.theme-*`). */
  theme?: ThemeColor
  /** `xs`, `sm`, `lg`. */
  size?: Exclude<Size, 'md' | 'xl'>
  /** Icon-only button (`.btn-icon`). */
  icon?: boolean
  /** `button`, `submit` or `reset`. */
  type?: 'button' | 'submit' | 'reset'
  /** Renders an `<a>` when set. */
  href?: string
  /** Force a tag (`button`, `a`, `span` ...). */
  as?: string
  active?: boolean
  disabled?: boolean
  /** Toggle button: `v-model:pressed` follows the active state. */
  toggle?: boolean
  pressed?: boolean
}>(), { variant: 'solid', theme: 'primary', type: 'button', active: false, disabled: false, toggle: false, pressed: false })

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
  (e: 'update:pressed', pressed: boolean): void
}>()

const tag = computed(() => props.as ?? (props.href ? 'a' : 'button'))
const isActive = computed(() => props.active || (props.toggle && props.pressed))

function onClick(event: MouseEvent) {
  if (props.disabled) { event.preventDefault(); return }
  if (props.toggle) emit('update:pressed', !props.pressed)
  emit('click', event)
}
</script>

<template>
  <Tag
    :as="tag"
    :class="['btn' + (variant === 'link' ? '-link' : `-${variant}`), `theme-${theme}`, size && `btn-${size}`, { 'btn-icon': icon, active: isActive, disabled: disabled && tag !== 'button' }]"
    :type="tag === 'button' ? type : undefined"
    :href="tag === 'a' ? href : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :role="tag !== 'button' && !href ? 'button' : (tag === 'a' && disabled ? 'button' : undefined)"
    :tabindex="tag !== 'button' && disabled ? -1 : undefined"
    :aria-pressed="toggle ? String(pressed) : undefined"
    :aria-disabled="disabled && tag !== 'button' ? 'true' : undefined"
    @click="onClick"
  >
    <slot />
  </Tag>
</template>
