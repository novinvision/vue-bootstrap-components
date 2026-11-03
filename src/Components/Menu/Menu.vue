<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed, provide, ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { useOverlayControl } from '../../core/useOverlayControl'
import type { BsEvent, FloatingPlacement } from '../../core/types'

defineOptions({ name: 'Menu' })

const props = withDefaults(defineProps<{
  /** Id used by `useOverlay(name)`. */
  name?: string
  /** Open state (`v-model`). */
  modelValue?: boolean
  /** Bootstrap option `autoClose`: `true`, `false`, `'inside'` or `'outside'`. */
  autoClose?: boolean | 'inside' | 'outside'
  /** Bootstrap option `boundary`. */
  boundary?: string | HTMLElement
  /** Bootstrap option `container`: CSS selector or `false`. */
  container?: string | false
  /** Bootstrap option `display`: `dynamic` or `static`. */
  display?: 'dynamic' | 'static'
  /** Bootstrap option `offset`: `[skidding, distance]`. */
  offset?: [number, number]
  /** Bootstrap option `floatingConfig`. */
  floatingConfig?: Record<string, unknown> | ((defaults: Record<string, unknown>) => Record<string, unknown>) | null
  /** Bootstrap option `placement`, e.g. `bottom-start` or responsive `bottom-start md:top-end`. */
  placement?: string
  /** Bootstrap option `reference`: `toggle`, `parent`, an element or a rect object. */
  reference?: 'toggle' | 'parent' | HTMLElement | Record<string, unknown>
  /** Bootstrap option `strategy`: `absolute` or `fixed`. */
  strategy?: 'absolute' | 'fixed'
  /** Bootstrap option `submenuTrigger`: `hover`, `click` or `both`. */
  submenuTrigger?: 'hover' | 'click' | 'both'
  /** Bootstrap option `submenuDelay` (ms). */
  submenuDelay?: number
  /** Wrapper tag (use `li` inside navs). */
  as?: string
  /** Hide the menu on Inertia.js GET visits. */
  closeOnInertia?: boolean
}>(), { modelValue: false, as: 'div', closeOnInertia: true, autoClose: undefined })

const emit = defineEmits<{
  /** `show.bs.menu` — cancelable. Payload: `relatedTarget` (the toggle). */
  (e: 'show', event: BsEvent<{ relatedTarget: HTMLElement }>): void
  (e: 'shown', event: BsEvent<{ relatedTarget: HTMLElement }>): void
  /** `hide.bs.menu` — cancelable. May carry `clickEvent`. */
  (e: 'hide', event: BsEvent<{ relatedTarget: HTMLElement; clickEvent?: MouseEvent }>): void
  (e: 'hidden', event: BsEvent<{ relatedTarget: HTMLElement }>): void
  (e: 'update:modelValue', open: boolean): void
}>()

const wrapper = ref<HTMLElement | null>(null)
// Bootstrap's Menu binds to the toggle element, which is a child (`MenuToggle`).
const toggle = computed(() => wrapper.value?.querySelector<HTMLElement>(':scope > [data-bs-toggle="menu"], [data-bs-toggle="menu"]') ?? null)

let control!: ReturnType<typeof useOverlayControl>

const plugin = useBootstrapPlugin({
  plugin: 'menu',
  el: toggle as unknown as typeof wrapper,
  config: () => ({
    autoClose: props.autoClose, boundary: props.boundary, container: props.container, display: props.display,
    offset: props.offset, floatingConfig: props.floatingConfig, placement: props.placement, reference: props.reference,
    strategy: props.strategy, submenuTrigger: props.submenuTrigger, submenuDelay: props.submenuDelay
  }),
  events: ['show', 'shown', 'hide', 'hidden'],
  emit: (name, event) => {
    emit(name as 'show', event)
    control.sync(name)
  },
  onCreated: instance => control.applyInitial(instance),
  closeOnInertiaVisit: props.closeOnInertia
})

control = useOverlayControl({
  name: () => props.name,
  model: () => props.modelValue,
  setModel: value => emit('update:modelValue', value),
  plugin
})

provide('bsMenu', control)
defineExpose({ show: control.show, hide: control.hide, toggle: control.toggle, update: () => plugin.getInstance()?.update(), getInstance: plugin.getInstance })
</script>

<template>
  <Tag :as="as" ref="wrapper"><slot :hide="control.hide" :toggle="control.toggle" /></Tag>
</template>
