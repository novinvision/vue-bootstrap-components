<script setup lang="ts">
import Tag from '../../core/Tag'
import { inject, ref, watch } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { useOverlayControl } from '../../core/useOverlayControl'
import { OverlayContainerKey } from '../../core/keys'
import type { BsEvent, FloatingPlacement } from '../../core/types'

defineOptions({ name: 'Tooltip' })

const props = withDefaults(defineProps<{
  /** Tooltip text (or HTML when `html` is set). */
  title: string
  /** Id used by `useOverlay(name)`. */
  name?: string
  /** Visibility (`v-model`). */
  modelValue?: boolean
  /** Disable the tooltip without unmounting it. */
  disabled?: boolean
  /** Bootstrap option `placement`. */
  placement?: string
  /** Bootstrap option `trigger`: any of `hover`, `focus`, `click`, `manual`, space separated. */
  trigger?: string
  /** Bootstrap option `html`: render `title` as HTML (sanitized unless `sanitize` is `false`). */
  html?: boolean
  /** Bootstrap option `animation`. */
  animation?: boolean
  /** Bootstrap option `delay`: ms or `{ show, hide }`. */
  delay?: number | { show: number; hide: number }
  /** Bootstrap option `offset`: `[skidding, distance]`. */
  offset?: [number, number]
  /** Bootstrap option `container`: CSS selector or `false`. */
  container?: string | false
  /** Bootstrap option `boundary`. */
  boundary?: string | HTMLElement
  /** Bootstrap option `customClass`. */
  customClass?: string | (() => string)
  /** Bootstrap option `fallbackPlacements`. */
  fallbackPlacements?: string[]
  /** Bootstrap option `sanitize`. */
  sanitize?: boolean
  /** Bootstrap option `sanitizeFn`. */
  sanitizeFn?: ((content: string) => string) | null
  /** Bootstrap option `allowList` for the sanitizer. */
  allowList?: Record<string, unknown>
  /** Bootstrap option `template`. */
  template?: string
  /** Bootstrap option `floatingConfig` (Floating UI middleware config). */
  floatingConfig?: Record<string, unknown> | ((defaults: Record<string, unknown>) => Record<string, unknown>) | null
  /** Wrapper tag. */
  as?: string
  /** Hide the tooltip on Inertia.js GET visits. */
  closeOnInertia?: boolean
}>(), { modelValue: false, disabled: false, as: 'span', closeOnInertia: true, html: undefined, animation: undefined, sanitize: undefined })

const emit = defineEmits<{
  /** `show.bs.tooltip` — cancelable. */
  (e: 'show', event: BsEvent): void
  /** `shown.bs.tooltip` */
  (e: 'shown', event: BsEvent): void
  /** `hide.bs.tooltip` — cancelable. */
  (e: 'hide', event: BsEvent): void
  /** `hidden.bs.tooltip` */
  (e: 'hidden', event: BsEvent): void
  /** `inserted.bs.tooltip` — the tooltip element was added to the DOM. */
  (e: 'inserted', event: BsEvent): void
  (e: 'update:modelValue', open: boolean): void
}>()

const el = ref<HTMLElement | null>(null)
// Inside a Dialog/Drawer (browser top layer) the overlay must be appended to that element to be visible.
const overlayContainer = inject(OverlayContainerKey, null)

let control!: ReturnType<typeof useOverlayControl>

const plugin = useBootstrapPlugin({
  plugin: 'tooltip',
  el,
  config: () => ({
    title: props.title, placement: props.placement, trigger: props.trigger, html: props.html, animation: props.animation,
    delay: props.delay, offset: props.offset, container: props.container ?? overlayContainer?.value ?? undefined, boundary: props.boundary,
    customClass: props.customClass, fallbackPlacements: props.fallbackPlacements, sanitize: props.sanitize,
    sanitizeFn: props.sanitizeFn, allowList: props.allowList, template: props.template, floatingConfig: props.floatingConfig
  }),
  events: ['show', 'shown', 'hide', 'hidden', 'inserted'],
  emit: (name, event) => {
    emit(name as 'show', event)
    control.sync(name)
  },
  onCreated: instance => {
    if (props.disabled) instance.disable()
    control.applyInitial(instance)
  },
  closeOnInertiaVisit: props.closeOnInertia
})

control = useOverlayControl({
  name: () => props.name,
  model: () => props.modelValue,
  setModel: value => emit('update:modelValue', value),
  plugin
})

watch(() => props.disabled, disabled => {
  const instance = plugin.getInstance()
  if (!instance) return
  if (disabled) instance.disable()
  else instance.enable()
})

defineExpose({ show: control.show, hide: control.hide, toggle: control.toggle, getInstance: plugin.getInstance })
</script>

<template>
  <Tag :as="as" ref="el"><slot /></Tag>
</template>
