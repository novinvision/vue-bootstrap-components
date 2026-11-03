<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'
import type { Breakpoint } from '../../core/types'

defineOptions({ name: 'Container' })

const props = withDefaults(defineProps<{
  /** Full-width container (`.container-fluid`). */
  fluid?: boolean
  /** Responsive container: `md` renders `.md:container`. */
  breakpoint?: Breakpoint
  as?: string
}>(), { fluid: false, as: 'div' })

const cls = computed(() => (props.fluid ? 'container-fluid' : props.breakpoint ? `${props.breakpoint}:container` : 'container'))
</script>

<template>
  <Tag :as="as" :class="cls"><slot /></Tag>
</template>
