<script setup lang="ts">
import { onBeforeUnmount, onMounted, provide, ref, watch } from 'vue'
import { TabsKey } from '../../core/keys'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'Tabs' })

const props = withDefaults(defineProps<{
  /** Name of the active tab (`v-model`). Defaults to the first tab. */
  modelValue?: string
  /** Fade transition between panes. */
  fade?: boolean
  /** Use list-group items as tab triggers (`TabList` renders `.list-group`). */
  listGroup?: boolean
}>(), { fade: true, listGroup: false })

const emit = defineEmits<{
  /** `show.bs.tab` — cancelable. `relatedTarget` is the previously active tab button. */
  (e: 'show', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  (e: 'shown', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  /** `hide.bs.tab` — cancelable. */
  (e: 'hide', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  (e: 'hidden', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  (e: 'update:modelValue', name: string): void
}>()

const root = ref<HTMLElement | null>(null)
const order: string[] = []
const showers = new Map<string, () => unknown>()

provide(TabsKey, {
  fade: props.fade,
  listGroup: props.listGroup,
  initialActive: () => props.modelValue ?? order[0] ?? null,
  register: (name, show) => { if (!order.includes(name)) order.push(name); showers.set(name, show) },
  unregister: name => { order.splice(order.indexOf(name), 1); showers.delete(name) }
})

watch(() => props.modelValue, name => { if (name) showers.get(name)?.() })

const names = ['show', 'shown', 'hide', 'hidden'] as const
const handlers = names.map(name => {
  const handler = (event: Event) => {
    emit(name as 'show', event as BsEvent)
    const tab = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-tab-name]')
    if (name === 'shown' && tab?.dataset.tabName && tab.dataset.tabName !== props.modelValue) emit('update:modelValue', tab.dataset.tabName)
  }
  return [`${name}.bs.tab`, handler] as const
})

onMounted(() => handlers.forEach(([type, handler]) => root.value?.addEventListener(type, handler)))
onBeforeUnmount(() => handlers.forEach(([type, handler]) => root.value?.removeEventListener(type, handler)))

defineExpose({ show: (name: string) => showers.get(name)?.() })
</script>

<template>
  <div ref="root"><slot /></div>
</template>
