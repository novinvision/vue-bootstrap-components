<script setup lang="ts">
import Tag from '../../core/Tag'
import { onBeforeUnmount, ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'Toggler' })

const props = withDefaults(defineProps<{
  /** CSS selector of the element(s) to toggle. Without it the component toggles itself. */
  target?: string
  /** Bootstrap option `attribute`: the attribute to toggle (default `class`; `id` is not allowed). */
  attribute?: string
  /** Bootstrap option `value`: the class/attribute value that is toggled (required for anything to happen). */
  value?: string | number | boolean | null
  as?: string
}>(), { as: 'button' })

const emit = defineEmits<{
  /** `toggle.bs.toggler` — cancelable. Fired on the toggled element. */
  (e: 'toggle', event: BsEvent): void
  /** `toggled.bs.toggler` — fired on the toggled element. */
  (e: 'toggled', event: BsEvent): void
}>()

const el = ref<HTMLElement | null>(null)
const config = () => ({ attribute: props.attribute, value: props.value })

const plugin = useBootstrapPlugin({
  plugin: 'toggler',
  el,
  config,
  events: ['toggle', 'toggled'],
  emit: (name, event) => emit(name as 'toggle', event)
})

// In `target` mode Bootstrap's instance lives on each target element (same as its data API does).
const bound = new Map<Element, Array<[string, EventListener]>>()

function toggleTargets() {
  const Toggler = plugin.getConstructor()
  if (!Toggler || !props.target) return
  for (const element of document.querySelectorAll(props.target)) {
    const cfg = Object.fromEntries(Object.entries(config()).filter(([, v]) => v !== undefined))
    const instance = (Toggler as any).getInstance(element) ?? new Toggler(element, cfg)
    if (!bound.has(element)) {
      const listeners: Array<[string, EventListener]> = (['toggle', 'toggled'] as const).map(name => {
        const handler: EventListener = event => emit(name as 'toggle', event as BsEvent)
        element.addEventListener(`${name}.bs.toggler`, handler)
        return [`${name}.bs.toggler`, handler]
      })
      bound.set(element, listeners)
    }
    instance.toggle()
  }
}

function onClick(event: Event) {
  if (props.as === 'a') event.preventDefault()
  if (props.target) toggleTargets()
  else plugin.getInstance()?.toggle()
}

onBeforeUnmount(() => {
  const Toggler = plugin.getConstructor() as any
  for (const [element, listeners] of bound) {
    for (const [type, handler] of listeners) element.removeEventListener(type, handler)
    Toggler?.getInstance(element)?.dispose()
  }
  bound.clear()
})

defineExpose({ toggle: onClick, getInstance: plugin.getInstance })
</script>

<template>
  <Tag :as="as" ref="el" :type="as === 'button' ? 'button' : undefined" :role="as === 'a' ? 'button' : undefined" @click="onClick"><slot /></Tag>
</template>
