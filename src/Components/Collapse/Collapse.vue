<script setup lang="ts">
import { provide, ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { useOverlayControl } from '../../core/useOverlayControl'
import { CollapseKey } from '../../core/keys'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'Collapse' })

const props = withDefaults(defineProps<{
  /** Id of the element; also lets `useOverlay(name)` and `CollapseTrigger` find it. */
  name?: string
  /** Open state (`v-model`). */
  modelValue?: boolean
  /** Bootstrap option `parent`: CSS selector of a container; opening this collapse closes the open ones inside it. */
  parent?: string
  /** Collapse the inline size instead of the block size (`.collapse-horizontal`); give the child a fixed `width`. */
  horizontal?: boolean
}>(), { modelValue: false, horizontal: false })

const emit = defineEmits<{
  /** `show.bs.collapse` — cancelable. */
  (e: 'show', event: BsEvent): void
  (e: 'shown', event: BsEvent): void
  /** `hide.bs.collapse` — cancelable. */
  (e: 'hide', event: BsEvent): void
  (e: 'hidden', event: BsEvent): void
  (e: 'update:modelValue', open: boolean): void
}>()

const el = ref<HTMLElement | null>(null)
// Rendered open on first paint; Bootstrap owns the `show` class afterwards.
const initiallyOpen = props.modelValue

let control!: ReturnType<typeof useOverlayControl>

const plugin = useBootstrapPlugin({
  plugin: 'collapse',
  el,
  config: () => ({ parent: props.parent }),
  events: ['show', 'shown', 'hide', 'hidden'],
  emit: (name, event) => {
    emit(name as 'show', event)
    control.sync(name)
  }
})

control = useOverlayControl({
  name: () => props.name,
  model: () => props.modelValue,
  setModel: value => emit('update:modelValue', value),
  plugin
})

provide(CollapseKey, control)
defineExpose({ show: control.show, hide: control.hide, toggle: control.toggle, getInstance: plugin.getInstance })
</script>

<template>
  <div :id="name" ref="el" class="collapse" :class="{ show: initiallyOpen, 'collapse-horizontal': horizontal }">
    <slot :hide="control.hide" :toggle="control.toggle" />
  </div>
</template>
