<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'Chips' })

const props = withDefaults(defineProps<{
  /** Chip values (`v-model`). */
  modelValue?: string[]
  /** Bootstrap option `separator`: character that creates a chip while typing/pasting (`null` disables). */
  separator?: string | null
  /** Bootstrap option `allowDuplicates`. */
  allowDuplicates?: boolean
  /** Bootstrap option `maxChips` (`null` = unlimited). */
  maxChips?: number | null
  /** Bootstrap option `placeholder` of the text input. */
  placeholder?: string
  /** Bootstrap option `dismissible`: show a remove button on every chip. */
  dismissible?: boolean
  /** Bootstrap option `dismissIcon`: HTML (SVG) of the remove button. */
  dismissIcon?: string
  /** Bootstrap option `createOnBlur`: turn the typed text into a chip when the input loses focus. */
  createOnBlur?: boolean
}>(), { modelValue: () => [], separator: undefined, allowDuplicates: undefined, maxChips: undefined, dismissible: undefined, createOnBlur: undefined })

const emit = defineEmits<{
  /** `add.bs.chips` — cancelable. Payload: `value`. */
  (e: 'add', event: BsEvent<{ value: string }>): void
  /** `remove.bs.chips` — cancelable. Payload: `value`, `chip`. */
  (e: 'remove', event: BsEvent<{ value: string; chip: HTMLElement }>): void
  /** `change.bs.chips` — payload `values`. */
  (e: 'change', event: BsEvent<{ values: string[] }>): void
  /** `select.bs.chips` — payload `selected`. */
  (e: 'select', event: BsEvent<{ selected: string[] }>): void
  (e: 'update:modelValue', values: string[]): void
}>()

const el = ref<HTMLElement | null>(null)
let syncing = false

const same = (a: string[], b: string[]) => a.length === b.length && a.every((value, index) => value === b[index])

function applyValues(instance: any, values: string[]) {
  syncing = true
  try {
    instance.clear()
    for (const value of values) instance.add(value)
  } finally {
    syncing = false
  }
}

const plugin = useBootstrapPlugin({
  plugin: 'chips',
  el,
  config: () => ({
    separator: props.separator, allowDuplicates: props.allowDuplicates, maxChips: props.maxChips,
    placeholder: props.placeholder, dismissible: props.dismissible, dismissIcon: props.dismissIcon, createOnBlur: props.createOnBlur
  }),
  events: ['add', 'remove', 'change', 'select'],
  emit: (name, event) => {
    emit(name as 'add', event as BsEvent<any>)
    if (name === 'change' && !syncing) {
      const values = (event as any).values as string[]
      if (!same(values, props.modelValue)) emit('update:modelValue', [...values])
    }
  },
  onCreated: instance => applyValues(instance, props.modelValue)
})

watch(() => props.modelValue, values => {
  const instance = plugin.getInstance()
  if (instance && !same(instance.getValues(), values)) applyValues(instance, values)
}, { deep: true })

defineExpose({
  add: (value: string) => plugin.getInstance()?.add(value),
  remove: (value: string) => plugin.getInstance()?.remove(value),
  clear: () => plugin.getInstance()?.clear(),
  focus: () => plugin.getInstance()?.focus(),
  getValues: () => plugin.getInstance()?.getValues() ?? [],
  getInstance: plugin.getInstance
})
</script>

<template>
  <div ref="el" class="chip-input" />
</template>
