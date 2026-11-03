<script setup lang="ts">
import { inject, type ComputedRef } from 'vue'
import type { BsEvent, ThemeColor } from '../../core/types'

defineOptions({ name: 'AccordionItem' })

const props = defineProps<{
  /** Header text. Use the `title` slot for custom markup. */
  title?: string
  /** Open state (`v-model`). */
  modelValue?: boolean
  /** Override the group name of the parent accordion. */
  name?: string
  /** Theme color for the open item (`.theme-*`). */
  theme?: ThemeColor
}>()

const emit = defineEmits<{
  /** Native `toggle` event of the `<details>` element (fires after open/close). */
  (e: 'toggle', event: BsEvent<{ newState?: string; oldState?: string }>): void
  (e: 'update:modelValue', open: boolean): void
}>()

const group = inject<ComputedRef<string | undefined> | null>('bsAccordionGroup', null)

function onToggle(event: Event) {
  emit('toggle', event as BsEvent)
  emit('update:modelValue', (event.target as HTMLDetailsElement).open)
}
</script>

<template>
  <details class="accordion-item" :class="theme && `theme-${theme}`" :name="props.name ?? group ?? undefined" :open="modelValue" @toggle="onToggle">
    <summary class="accordion-header">
      <slot name="title">{{ title }}</slot>
      <svg class="accordion-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 5 6 6 6-6" /></svg>
    </summary>
    <div class="accordion-body"><slot /></div>
  </details>
</template>
