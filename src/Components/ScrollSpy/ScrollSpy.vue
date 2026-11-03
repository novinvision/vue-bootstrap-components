<script setup lang="ts">
import Tag from '../../core/Tag'
import { ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'ScrollSpy' })

const props = withDefaults(defineProps<{
  /** Bootstrap option `target`: CSS selector of the nav/list-group whose links follow the scroll position. */
  target: string
  /** Bootstrap option `rootMargin`. */
  rootMargin?: string | null
  /** Bootstrap option `smoothScroll`. */
  smoothScroll?: boolean
  /** Bootstrap option `threshold`. */
  threshold?: number[]
  /** Bootstrap option `topMargin`. */
  topMargin?: string
  as?: string
}>(), { as: 'div', smoothScroll: undefined })

const emit = defineEmits<{
  /** `activate.bs.scrollspy` — payload `relatedTarget` (the newly active link). */
  (e: 'activate', event: BsEvent<{ relatedTarget: HTMLElement }>): void
}>()

const el = ref<HTMLElement | null>(null)

const plugin = useBootstrapPlugin({
  plugin: 'scrollspy',
  el,
  config: () => ({ target: props.target, rootMargin: props.rootMargin, smoothScroll: props.smoothScroll, threshold: props.threshold, topMargin: props.topMargin }),
  events: ['activate'],
  emit: (name, event) => emit(name as 'activate', event as BsEvent<any>)
})

defineExpose({ refresh: () => plugin.getInstance()?.refresh(), getInstance: plugin.getInstance })
</script>

<template>
  <Tag :as="as" ref="el" tabindex="0"><slot /></Tag>
</template>
