<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'Datepicker', inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** Selected date(s) as `YYYY-MM-DD` strings (`v-model`): a string for `single`, an array otherwise. */
  modelValue?: string | string[] | null
  /** Bootstrap option `selectionMode`: `single`, `multiple` or `multiple-ranged`. */
  selectionMode?: 'single' | 'multiple' | 'multiple-ranged'
  /** Bootstrap option `inline`: render the calendar in place instead of a popup. */
  inline?: boolean
  /** Bootstrap option `locale`, e.g. `fa-IR`, `en-US`. */
  locale?: string
  /** Bootstrap option `firstWeekday` (0 = Sunday ... 6 = Saturday). */
  firstWeekday?: number
  /** Bootstrap option `dateMin`. */
  dateMin?: string | number | Date | null
  /** Bootstrap option `dateMax`. */
  dateMax?: string | number | Date | null
  /** Bootstrap option `dateFormat`: `Intl.DateTimeFormat` options or a formatter function. */
  dateFormat?: Record<string, unknown> | ((date: Date) => string) | null
  /** Bootstrap option `displayElement`. */
  displayElement?: string | HTMLElement | boolean | null
  /** Bootstrap option `displayMonthsCount`. */
  displayMonthsCount?: number
  /** Bootstrap option `positionElement`. */
  positionElement?: string | HTMLElement | null
  /** Bootstrap option `placement`: `left`, `center`, `right`, `top`, `bottom`, `auto`. */
  placement?: string
  /** Bootstrap option `datepickerTheme`: `light`, `dark` or `auto`. */
  datepickerTheme?: string | null
  /** Bootstrap option `vcpOptions`: extra options passed to vanilla-calendar-pro. */
  vcpOptions?: Record<string, unknown>
  placeholder?: string
  name?: string
  disabled?: boolean
}>(), { modelValue: null, inline: false, disabled: false })

const emit = defineEmits<{
  /** `change.bs.datepicker` */
  (e: 'change', event: BsEvent): void
  /** `show.bs.datepicker` — cancelable. */
  (e: 'show', event: BsEvent): void
  (e: 'shown', event: BsEvent): void
  /** `hide.bs.datepicker` — cancelable. */
  (e: 'hide', event: BsEvent): void
  (e: 'hidden', event: BsEvent): void
  (e: 'update:modelValue', value: string | string[] | null): void
}>()

const el = ref<HTMLElement | null>(null)

const toList = (value: string | string[] | null | undefined) => (value ? (Array.isArray(value) ? value : [value]) : [])
const same = (a: string[], b: string[]) => a.length === b.length && a.every((v, i) => v === b[i])

const plugin = useBootstrapPlugin({
  plugin: 'datepicker',
  el,
  config: () => ({
    selectionMode: props.selectionMode, inline: props.inline, locale: props.locale, firstWeekday: props.firstWeekday,
    dateMin: props.dateMin, dateMax: props.dateMax, dateFormat: props.dateFormat, displayElement: props.displayElement,
    displayMonthsCount: props.displayMonthsCount, positionElement: props.positionElement, placement: props.placement,
    datepickerTheme: props.datepickerTheme, vcpOptions: props.vcpOptions, selectedDates: toList(props.modelValue)
  }),
  events: ['change', 'show', 'shown', 'hide', 'hidden'],
  emit: (name, event) => {
    emit(name as 'change', event)
    if (name === 'change') {
      const dates: string[] = plugin.getInstance()?.getSelectedDates() ?? []
      if (!same(dates, toList(props.modelValue))) {
        emit('update:modelValue', props.selectionMode && props.selectionMode !== 'single' ? dates : (dates[0] ?? null))
      }
    }
  }
})

watch(() => props.modelValue, value => {
  const instance = plugin.getInstance()
  if (instance && !same(instance.getSelectedDates(), toList(value))) instance.setSelectedDates(toList(value))
})

defineExpose({
  show: () => plugin.getInstance()?.show(), hide: () => plugin.getInstance()?.hide(), toggle: () => plugin.getInstance()?.toggle(),
  getSelectedDates: () => plugin.getInstance()?.getSelectedDates() ?? [], getInstance: plugin.getInstance
})
</script>

<template>
  <div v-if="inline" ref="el" v-bind="$attrs" />
  <input v-else ref="el" v-bind="$attrs" type="text" class="form-control" autocomplete="off" :placeholder="placeholder" :name="name" :disabled="disabled">
</template>
