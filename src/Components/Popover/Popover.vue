<script setup lang="ts">
import Tag from '../../core/Tag'
import { inject, ref, watch } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { useOverlayControl } from '../../core/useOverlayControl'
import { OverlayContainerKey } from '../../core/keys'
import type { BsEvent, FloatingPlacement } from '../../core/types'

defineOptions({ name: 'Popover' })

const props = withDefaults(defineProps<{
  /** Popover header text. */
  title?: string
  /** Popover body text (or HTML when `html` is set). */
  content?: string
  /** Id used by `useOverlay(name)`. */
  name?: string
  /** Visibility (`v-model`). */
  modelValue?: boolean
  disabled?: boolean
  /** Bootstrap option `placement` (default `right`). */
  placement?: string
  /** Bootstrap option `trigger` (default `click`). */
  trigger?: string
  html?: boolean
  animation?: boolean
  delay?: number | { show: number; hide: number }
  offset?: [number, number]
  container?: string | false
  boundary?: string | HTMLElement
  customClass?: string | (() => string)
  fallbackPlacements?: string[]
  sanitize?: boolean
  sanitizeFn?: ((content: string) => string) | null
  allowList?: Record<string, unknown>
  template?: string
  floatingConfig?: Record<string, unknown> | ((defaults: Record<string, unknown>) => Record<string, unknown>) | null
  as?: string
  closeOnInertia?: boolean
}>(), { modelValue: false, disabled: false, as: 'span', closeOnInertia: true, html: undefined, animation: undefined, sanitize: undefined })

const emit = defineEmits<{
  /** `show.bs.popover` — cancelable. */
  (e: 'show', event: BsEvent): void
  (e: 'shown', event: BsEvent): void
  /** `hide.bs.popover` — cancelable. */
  (e: 'hide', event: BsEvent): void
  (e: 'hidden', event: BsEvent): void
  (e: 'inserted', event: BsEvent): void
  (e: 'update:modelValue', open: boolean): void
}>()

const el = ref<HTMLElement | null>(null)
// Inside a Dialog/Drawer (browser top layer) the overlay must be appended to that element to be visible.
const overlayContainer = inject(OverlayContainerKey, null)

let control!: ReturnType<typeof useOverlayControl>

const plugin = useBootstrapPlugin({
  plugin: 'popover',
  el,
  config: () => ({
    title: props.title, content: props.content, placement: props.placement, trigger: props.trigger, html: props.html,
    animation: props.animation, delay: props.delay, offset: props.offset, container: props.container ?? overlayContainer?.value ?? undefined,
    boundary: props.boundary, customClass: props.customClass, fallbackPlacements: props.fallbackPlacements,
    sanitize: props.sanitize, sanitizeFn: props.sanitizeFn, allowList: props.allowList, template: props.template,
    floatingConfig: props.floatingConfig
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
