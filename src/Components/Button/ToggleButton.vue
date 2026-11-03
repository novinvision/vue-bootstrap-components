<script setup lang="ts">
import type { Size, ThemeColor } from '../../core/types'

defineOptions({ name: 'ToggleButton' })

const model = defineModel<boolean | unknown[] | string | number | null>({ default: false })

withDefaults(defineProps<{
  /** `checkbox` (default) or `radio`. */
  type?: 'checkbox' | 'radio'
  variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'styled'
  theme?: ThemeColor
  size?: Exclude<Size, 'md' | 'xl'>
  /** Value used for radio groups and checkbox arrays. */
  value?: string | number | boolean
  name?: string
  disabled?: boolean
}>(), { type: 'checkbox', variant: 'solid', theme: 'primary', disabled: false })
</script>

<template>
  <label class="btn-check" :class="[`btn-${variant}`, `theme-${theme}`, size && `btn-${size}`]">
    <input v-model="model" :type="type" :value="value" :name="name" :disabled="disabled" autocomplete="off">
    <slot />
  </label>
</template>
