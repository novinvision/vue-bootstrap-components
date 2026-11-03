<script setup lang="ts">
import { onBeforeUnmount, provide, ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { useOverlayControl } from '../../core/useOverlayControl'
import { DismissKey, DrawerKey } from '../../core/keys'
import type { Breakpoint, BsEvent } from '../../core/types'

defineOptions({ name: 'Drawer' })

const props = withDefaults(defineProps<{
  /** Id of the `<dialog>`; also lets `useOverlay(name)` and `DrawerTrigger` find it. */
  name?: string
  /** Open state (`v-model`). */
  modelValue?: boolean
  /** Edge the drawer slides from. */
  placement?: 'start' | 'end' | 'top' | 'bottom' | 'fullscreen'
  /** Bootstrap option `backdrop`: `true`, `false` or `'static'`. */
  backdrop?: boolean | 'static'
  /** Bootstrap option `keyboard`: close with Escape. */
  keyboard?: boolean
  /** Bootstrap option `scroll`: allow page scrolling while open. */
  scroll?: boolean
  /** Responsive drawer: becomes regular inline content from this breakpoint (`.md:drawer`). */
  responsive?: Breakpoint
  /** `.drawer-sheet` */
  sheet?: boolean
  /** `.drawer-fit-content` */
  fitContent?: boolean
  /** `.drawer-translucent` */
  translucent?: boolean
  /** `.drawer-instant` — no animation. */
  instant?: boolean
  /** Shortcut for a header with title and close button. */
  title?: string
  closeLabel?: string
  /** Hide the drawer on Inertia.js GET visits. */
  closeOnInertia?: boolean
}>(), { modelValue: false, placement: 'start', backdrop: true, keyboard: true, scroll: false, sheet: false, fitContent: false, translucent: false, instant: false, closeLabel: 'Close', closeOnInertia: true })

const emit = defineEmits<{
  /** `show.bs.drawer` — cancelable. */
  (e: 'show', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  (e: 'shown', event: BsEvent): void
  /** `hide.bs.drawer` — cancelable. */
  (e: 'hide', event: BsEvent): void
  (e: 'hidden', event: BsEvent): void
  /** `hidePrevented.bs.drawer` */
  (e: 'hidePrevented', event: BsEvent): void
  (e: 'update:modelValue', open: boolean): void
}>()

const el = ref<HTMLDialogElement | null>(null)

let control!: ReturnType<typeof useOverlayControl>

const plugin = useBootstrapPlugin({
  plugin: 'drawer',
  el,
  config: () => ({ backdrop: props.backdrop, keyboard: props.keyboard, scroll: props.scroll }),
  events: ['show', 'shown', 'hide', 'hidden', 'hidePrevented'],
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

function onClick(event: MouseEvent) {
  if ((event.target as HTMLElement | null)?.closest?.('[data-bs-dismiss="drawer"]')) control.hide()
}

onBeforeUnmount(() => {
  if (el.value?.open) el.value.close()
  if (!document.querySelector('dialog[open]')) document.documentElement.classList.remove('dialog-open')
})

provide(DrawerKey, control)
provide(DismissKey, { type: 'drawer', close: control.hide })
defineExpose({ show: control.show, hide: control.hide, toggle: control.toggle, getInstance: plugin.getInstance })
</script>

<template>
  <dialog
    :id="name"
    ref="el"
    :class="[responsive ? `${responsive}:drawer` : 'drawer', `drawer-${placement}`, { 'drawer-sheet': sheet, 'drawer-fit-content': fitContent, 'drawer-translucent': translucent, 'drawer-instant': instant }]"
    tabindex="-1"
    :aria-labelledby="title && name ? `${name}-title` : undefined"
    @click="onClick"
  >
    <div v-if="title" class="drawer-header">
      <h5 :id="name ? `${name}-title` : undefined" class="drawer-title">{{ title }}</h5>
      <button type="button" class="btn-close" :aria-label="closeLabel" data-bs-dismiss="drawer" />
    </div>
    <slot :hide="control.hide" />
  </dialog>
</template>
