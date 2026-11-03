<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'
import type { Breakpoint } from '../../core/types'

defineOptions({ name: 'ListGroup' })

const props = withDefaults(defineProps<{
  /** Remove outer borders (`.list-group-flush`). */
  flush?: boolean
  /** Numbered list (`.list-group-numbered`). */
  numbered?: boolean
  /** Horizontal layout; pass a breakpoint for `.md:list-group-horizontal`. Needs a query container. */
  horizontal?: boolean | Breakpoint
  as?: string
}>(), { flush: false, numbered: false, horizontal: false, as: 'ul' })

const horizontalClass = computed(() => {
  if (!props.horizontal) return undefined
  return props.horizontal === true ? 'list-group-horizontal' : `${props.horizontal}:list-group-horizontal`
})
</script>

<template>
  <Tag :as="as" class="list-group" :class="[horizontalClass, { 'list-group-flush': flush, 'list-group-numbered': numbered }]"><slot /></Tag>
</template>
