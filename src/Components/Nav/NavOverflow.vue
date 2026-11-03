<script setup lang="ts">
import { ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'NavOverflow' })

const props = withDefaults(defineProps<{
  /** Bootstrap option `collapseBelow`: pixel width or breakpoint below which everything moves into the menu. */
  collapseBelow?: number | string
  /** Bootstrap option `iconPlacement`: `start` or `end`. */
  iconPlacement?: 'start' | 'end'
  /** Bootstrap option `menuPlacement`. */
  menuPlacement?: string
  /** Bootstrap option `menuStrategy`: `absolute` or `fixed`. */
  menuStrategy?: 'absolute' | 'fixed'
  /** Bootstrap option `moreText`: label of the overflow toggle (`false` hides it). */
  moreText?: string | boolean
  /** Bootstrap option `moreIcon`: HTML (SVG) of the overflow toggle icon. */
  moreIcon?: string
  /** Bootstrap option `threshold`. */
  threshold?: number
}>(), {})

const emit = defineEmits<{
  /** `update.bs.navoverflow` — the visible/overflowing split was recalculated. */
  (e: 'update', event: BsEvent): void
  /** `overflow.bs.navoverflow` */
  (e: 'overflow', event: BsEvent): void
  /** `resize.bs.navoverflow` */
  (e: 'resize', event: BsEvent): void
}>()

const el = ref<HTMLElement | null>(null)

const plugin = useBootstrapPlugin({
  plugin: 'nav-overflow',
  el,
  config: () => ({ collapseBelow: props.collapseBelow, iconPlacement: props.iconPlacement, menuPlacement: props.menuPlacement, menuStrategy: props.menuStrategy, moreText: props.moreText, moreIcon: props.moreIcon, threshold: props.threshold }),
  events: ['update', 'overflow', 'resize'],
  emit: (name, event) => emit(name as 'update', event)
})

defineExpose({ update: () => plugin.getInstance()?.update(), getInstance: plugin.getInstance })
</script>

<template>
  <div ref="el" class="nav-overflow"><slot /></div>
</template>
