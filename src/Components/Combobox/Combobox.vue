<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'Combobox' })

import type { ComboboxOption } from './types'

type Value = string | number | null | Array<string | number>

const props = withDefaults(defineProps<{
  /** Selectable options. */
  options: ComboboxOption[]
  /** Selected value (`v-model`); an array when `multiple`. */
  modelValue?: Value
  /** Bootstrap option `multiple`. */
  multiple?: boolean
  /** Bootstrap option `search`: show a search box inside the menu. */
  search?: boolean
  /** Bootstrap option `searchNormalize`: ignore accents/case while searching. */
  searchNormalize?: boolean
  /** Bootstrap option `name`: creates a hidden input with the selected value(s) for plain form posts. */
  name?: string
  /** Bootstrap option `placeholder`. */
  placeholder?: string
  /** Bootstrap option `placement`. */
  placement?: string
  /** Bootstrap option `offset`. */
  offset?: [number, number]
  /** Bootstrap option `boundary`. */
  boundary?: string | HTMLElement
  disabled?: boolean
  searchPlaceholder?: string
  noResultsText?: string
}>(), { modelValue: null, multiple: false, search: false, searchNormalize: undefined, disabled: false, searchPlaceholder: 'Search...', noResultsText: 'No results' })

const emit = defineEmits<{
  /** `change.bs.combobox` — payload `value` (string, or string[] when `multiple`) and `item`. */
  (e: 'change', event: BsEvent<{ value: string | string[]; item: HTMLElement }>): void
  /** `show.bs.combobox` — cancelable. */
  (e: 'show', event: BsEvent): void
  (e: 'shown', event: BsEvent): void
  /** `hide.bs.combobox` — cancelable. */
  (e: 'hide', event: BsEvent): void
  (e: 'hidden', event: BsEvent): void
  (e: 'update:modelValue', value: Value): void
}>()

const toggle = ref<HTMLElement | null>(null)
let lastEmitted: string | null = null

const selectedList = (value: Value | undefined): string[] =>
  value === null || value === undefined ? [] : (Array.isArray(value) ? value : [value]).map(String)

const isSelected = (option: ComboboxOption) => selectedList(props.modelValue).includes(String(option.value))

function toModel(raw: string | string[]): Value {
  const lookup = (text: string) => props.options.find(option => String(option.value) === text)?.value ?? text
  return Array.isArray(raw) ? raw.map(lookup) : lookup(raw)
}

const plugin = useBootstrapPlugin({
  plugin: 'combobox',
  el: toggle,
  config: () => ({
    multiple: props.multiple, search: props.search, searchNormalize: props.searchNormalize, name: props.name,
    placeholder: props.placeholder, placement: props.placement, offset: props.offset, boundary: props.boundary
  }),
  events: ['change', 'show', 'shown', 'hide', 'hidden'],
  emit: (name, event) => {
    emit(name as 'change', event as BsEvent<any>)
    if (name === 'change') {
      const value = toModel((event as any).value)
      lastEmitted = JSON.stringify(selectedList(value))
      emit('update:modelValue', value)
    }
  }
})

// Selection changed from outside: Bootstrap reads the selected state from the DOM at creation, so re-create it.
watch(() => [props.modelValue, props.options], async () => {
  if (JSON.stringify(selectedList(props.modelValue)) === lastEmitted) return
  await nextTick()
  await plugin.recreate()
}, { deep: true })

defineExpose({ show: () => plugin.getInstance()?.show(), hide: () => plugin.getInstance()?.hide(), toggle: () => plugin.getInstance()?.toggle(), getInstance: plugin.getInstance })
</script>

<template>
  <div>
    <button ref="toggle" type="button" class="combobox-toggle" data-bs-toggle="combobox" :disabled="disabled" aria-haspopup="listbox">
      <span class="combobox-value" />
      <span class="combobox-caret" aria-hidden="true" />
    </button>
    <div class="menu" role="listbox" :aria-multiselectable="multiple || undefined">
      <div v-if="search" class="combobox-search">
        <input type="search" class="combobox-search-input" :placeholder="searchPlaceholder" autocomplete="off">
      </div>
      <button
        v-for="option in options"
        :key="String(option.value)"
        type="button"
        class="menu-item"
        :class="{ selected: isSelected(option) }"
        role="option"
        :data-bs-value="String(option.value)"
        :aria-selected="isSelected(option) ? 'true' : 'false'"
        :disabled="option.disabled"
      >
        <span class="menu-item-content">
          <span>{{ option.label ?? option.value }}</span>
          <span v-if="option.description" class="menu-item-description">{{ option.description }}</span>
        </span>
      </button>
      <div v-if="search" class="combobox-no-results" hidden>{{ noResultsText }}</div>
    </div>
  </div>
</template>
