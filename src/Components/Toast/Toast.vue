<script setup lang="ts">
import { provide, ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { useOverlayControl } from '../../core/useOverlayControl'
import { DismissKey, ToastKey } from '../../core/keys'
import type { BsEvent, ThemeColor } from '../../core/types'

defineOptions({ name: 'Toast' })

const props = withDefaults(defineProps<{
  /** Id of the element; also lets `useOverlay(name)` find it. */
  name?: string
  /** Visibility (`v-model`). A toast is hidden until it is set to `true`. */
  modelValue?: boolean
  /** Bootstrap option `animation`. */
  animation?: boolean
  /** Bootstrap option `autohide`. */
  autohide?: boolean
  /** Bootstrap option `delay` (ms). */
  delay?: number
  /** Theme color (`.theme-*`). */
  theme?: ThemeColor
  /** Header title. When set (or when the `header` slot is used) a header is rendered. */
  title?: string
  /** Small text on the right side of the header (time ago ...). */
  meta?: string
  /** Show a close button. */
  closable?: boolean
  /** Translucent background (`.toast-translucent`). */
  translucent?: boolean
  /** No animation (`.toast-instant`). */
  instant?: boolean
  closeLabel?: string
}>(), { modelValue: false, animation: true, autohide: true, delay: 5000, closable: true, translucent: false, instant: false, closeLabel: 'Close' })

const emit = defineEmits<{
  /** `show.bs.toast` — cancelable. */
  (e: 'show', event: BsEvent): void
  (e: 'shown', event: BsEvent): void
  /** `hide.bs.toast` — cancelable. */
  (e: 'hide', event: BsEvent): void
  (e: 'hidden', event: BsEvent): void
  (e: 'update:modelValue', visible: boolean): void
}>()

const el = ref<HTMLElement | null>(null)

let control!: ReturnType<typeof useOverlayControl>

const plugin = useBootstrapPlugin({
  plugin: 'toast',
  el,
  config: () => ({ animation: props.animation, autohide: props.autohide, delay: props.delay }),
  events: ['show', 'shown', 'hide', 'hidden'],
  emit: (name, event) => {
    emit(name as 'show', event)
    control.sync(name)
  },
  onCreated: instance => control.applyInitial(instance)
})

control = useOverlayControl({
  name: () => props.name,
  model: () => props.modelValue,
  setModel: value => emit('update:modelValue', value),
  plugin
})

provide(ToastKey, control)
provide(DismissKey, { type: 'toast', close: control.hide })
defineExpose({ show: control.show, hide: control.hide, toggle: control.toggle, getInstance: plugin.getInstance })
</script>

<template>
  <div :id="name" ref="el" class="toast" :class="[theme && `theme-${theme}`, { 'toast-translucent': translucent, 'toast-instant': instant || !animation }]" role="alert" aria-live="assertive" aria-atomic="true">
    <div v-if="title || $slots.header" class="toast-header">
      <slot name="header"><strong class="me-auto">{{ title }}</strong></slot>
      <small v-if="meta">{{ meta }}</small>
      <button v-if="closable" type="button" class="btn-close" :aria-label="closeLabel" @click="control.hide()" />
    </div>
    <div v-if="title || $slots.header" class="toast-body"><slot /></div>
    <div v-else class="d-flex">
      <div class="toast-body"><slot /></div>
      <button v-if="closable" type="button" class="btn-close me-2 m-auto" :aria-label="closeLabel" @click="control.hide()" />
    </div>
  </div>
</template>
