<script setup lang="ts">
import { onBeforeUnmount, provide, ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { useOverlayControl } from '../../core/useOverlayControl'
import { DialogKey, DismissKey, OverlayContainerKey } from '../../core/keys'
import type { Breakpoint, BsEvent } from '../../core/types'

defineOptions({ name: 'Dialog' })

const props = withDefaults(defineProps<{
  /** Id of the `<dialog>`; also lets `useOverlay(name)` and `DialogTrigger` find it. */
  name?: string
  /** Open state (`v-model`). */
  modelValue?: boolean
  /** Bootstrap option `backdrop`: `true`, `false` or `'static'` (does not close on backdrop click). */
  backdrop?: boolean | 'static'
  /** Bootstrap option `keyboard`: close with Escape. */
  keyboard?: boolean
  /** Bootstrap option `modal`: `false` opens a non-modal dialog. */
  modal?: boolean
  /** `sm` (280px), `lg` (800px), `xl` (1140px) or `fullscreen`. */
  size?: 'sm' | 'lg' | 'xl' | 'fullscreen'
  /** Fullscreen below a breakpoint (`.md-down:dialog-fullscreen`). */
  fullscreenBelow?: Exclude<Breakpoint, '2xl' | 'xl'>
  /** Scroll the body instead of the page (`.dialog-scrollable`). */
  scrollable?: boolean
  /** Entry animation: `slide-up`, `slide-down`. */
  animation?: 'slide-up' | 'slide-down'
  /** Disable animations (`.dialog-instant`). */
  instant?: boolean
  /** Shortcut for a header with title and close button. */
  title?: string
  /** Accessible label of the close button of the `title` header. */
  closeLabel?: string
  /** Hide the dialog on Inertia.js GET visits. */
  closeOnInertia?: boolean
}>(), { modelValue: false, backdrop: true, keyboard: true, modal: true, scrollable: false, instant: false, closeLabel: 'Close', closeOnInertia: true })

const emit = defineEmits<{
  /** `show.bs.dialog` — cancelable. */
  (e: 'show', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  /** `shown.bs.dialog` */
  (e: 'shown', event: BsEvent): void
  /** `hide.bs.dialog` — cancelable. */
  (e: 'hide', event: BsEvent): void
  /** `hidden.bs.dialog` */
  (e: 'hidden', event: BsEvent): void
  /** `hidePrevented.bs.dialog` — a close attempt was blocked (static backdrop or `hide` was cancelled). */
  (e: 'hidePrevented', event: BsEvent): void
  /** `cancel.bs.dialog` — Escape / native cancel. */
  (e: 'cancel', event: BsEvent): void
  (e: 'update:modelValue', open: boolean): void
}>()

const el = ref<HTMLDialogElement | null>(null)

let control!: ReturnType<typeof useOverlayControl>

const plugin = useBootstrapPlugin({
  plugin: 'dialog',
  el,
  config: () => ({ backdrop: props.backdrop, keyboard: props.keyboard, modal: props.modal }),
  events: ['show', 'shown', 'hide', 'hidden', 'hidePrevented', 'cancel'],
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

/** Delegated replacement for Bootstrap's `data-bs-dismiss="dialog"` data API. */
function onClick(event: MouseEvent) {
  if ((event.target as HTMLElement | null)?.closest?.('[data-bs-dismiss="dialog"]')) control.hide()
}

onBeforeUnmount(() => {
  // Do not leave the page scroll-locked when a dialog is removed while open.
  if (el.value?.open) el.value.close()
  if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('dialog-open')
})

provide(DialogKey, control)
provide(DismissKey, { type: 'dialog', close: control.hide })
provide(OverlayContainerKey, { get value() { return el.value } })
defineExpose({ show: control.show, hide: control.hide, toggle: control.toggle, getInstance: plugin.getInstance })
</script>

<template>
  <dialog
    :id="name"
    ref="el"
    class="dialog"
    :class="[size && `dialog-${size}`, fullscreenBelow && `${fullscreenBelow}-down:dialog-fullscreen`, animation && `dialog-${animation}`, { 'dialog-scrollable': scrollable, 'dialog-instant': instant }]"
    @click="onClick"
  >
    <div v-if="title" class="dialog-header">
      <h1 class="dialog-title">{{ title }}</h1>
      <button type="button" class="btn-close" :aria-label="closeLabel" data-bs-dismiss="dialog" />
    </div>
    <slot :hide="control.hide" />
  </dialog>
</template>
