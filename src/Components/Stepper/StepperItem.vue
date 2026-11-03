<script setup lang="ts">
import Tag from '../../core/Tag'
import type { ThemeColor } from '../../core/types'

defineOptions({ name: 'StepperItem' })

withDefaults(defineProps<{
  /** Completed/current step (`.active`). */
  active?: boolean
  /** Theme color (`.theme-*`). */
  theme?: ThemeColor
  as?: string
}>(), { active: false, as: 'li' })
</script>

<template>
  <Tag :as="as" class="stepper-item" :class="[theme && `theme-${theme}`, { active }]" :aria-current="active ? 'step' : undefined"><slot /></Tag>
</template>
