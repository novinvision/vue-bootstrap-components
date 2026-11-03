<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'
import type { Breakpoint } from '../../core/types'

defineOptions({ name: 'Stepper' })

const props = withDefaults(defineProps<{
  /** Horizontal layout: `true` (`.stepper-horizontal`) or from a breakpoint (`.sm:stepper-horizontal`, needs a `.contains-inline` parent). */
  horizontal?: boolean | Breakpoint
  /** Wrap in `.stepper-overflow` so a horizontal stepper scrolls instead of overflowing. */
  overflow?: boolean
  as?: string
}>(), { horizontal: false, overflow: false, as: 'ol' })

const horizontalClass = computed(() => (props.horizontal === true ? 'stepper-horizontal' : props.horizontal ? `${props.horizontal}:stepper-horizontal` : undefined))
</script>

<template>
  <div v-if="overflow" class="stepper-overflow">
    <Tag :as="as" class="stepper" :class="horizontalClass"><slot /></Tag>
  </div>
  <Tag :as="as" v-else class="stepper" :class="horizontalClass"><slot /></Tag>
</template>
