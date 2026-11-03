<script setup lang="ts">
import { ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'FormRange' })

const model = defineModel<number | string>({ default: 0 })

const props = defineProps<{
  min?: number | string
  max?: number | string
  step?: number | string
  disabled?: boolean
  name?: string
  /** Show a value bubble above the thumb. */
  bubble?: boolean
  /** Custom formatter for the bubble text. */
  formatter?: (value: number) => string
}>()

const emit = defineEmits<{
  /** `changed.bs.range` — payload `{ value }`. */
  (e: 'changed', event: BsEvent<{ value: number }>): void
}>()

const el = ref<HTMLElement | null>(null)

useBootstrapPlugin({
  plugin: 'range',
  el,
  config: () => ({ bubble: props.bubble || undefined, formatter: props.formatter }),
  events: ['changed'],
  emit: (name, event) => emit(name as 'changed', event),
  // Bootstrap dispatches `changed.bs.range` on the <input>, which bubbles to the wrapper
})
</script>

<template>
  <div ref="el" class="form-range">
    <input v-model="model" type="range" class="form-range-input" :min="min" :max="max" :step="step" :disabled="disabled" :name="name">
  </div>
</template>
