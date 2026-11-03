<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeColor } from '../../core/types'

defineOptions({ name: 'Progress' })

const props = withDefaults(defineProps<{
  /** Current value. */
  value?: number
  min?: number
  max?: number
  theme?: ThemeColor
  striped?: boolean
  animated?: boolean
  /** Text inside the bar. `true` shows the percentage. */
  label?: string | boolean
  /** Accessible label. */
  ariaLabel?: string
  /** Bar height (any CSS length). */
  height?: string
  /** Use inside `ProgressStacked`: the width is set on the `.progress` element instead of the bar. */
  stacked?: boolean
}>(), { value: 0, min: 0, max: 100, striped: false, animated: false, stacked: false })

const percent = computed(() => Math.min(100, Math.max(0, ((props.value - props.min) / (props.max - props.min)) * 100)))
</script>

<template>
  <div class="progress" role="progressbar" :aria-label="ariaLabel" :aria-valuenow="value" :aria-valuemin="min" :aria-valuemax="max" :style="{ height: height || undefined, width: stacked ? percent + '%' : undefined }">
    <div class="progress-bar" :class="[stacked && 'w-100', theme && `theme-${theme}`, { 'progress-bar-striped': striped || animated, 'progress-bar-animated': animated }]" :style="stacked ? undefined : { width: percent + '%' }">
      <slot>{{ label === true ? Math.round(percent) + '%' : label }}</slot>
    </div>
  </div>
</template>
