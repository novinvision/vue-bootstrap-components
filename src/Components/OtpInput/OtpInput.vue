<script setup lang="ts">
import { ref, watch } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'OtpInput' })

const props = withDefaults(defineProps<{
  /** Current code (`v-model`). */
  modelValue?: string
  /** Bootstrap option `length`: number of slots. Read from `maxlength`/`groups` when omitted. */
  length?: number | null
  /** Bootstrap option `groups`: e.g. `[3, 3]` renders two groups with a separator. */
  groups?: number[] | null
  /** Bootstrap option `mask`: hide entered characters. */
  mask?: boolean
  /** Bootstrap option `separator` between groups. */
  separator?: string
  /** Bootstrap option `type`: `numeric`, `alpha`, `alphanumeric`. */
  type?: 'numeric' | 'alpha' | 'alphanumeric'
  /** `.otp-sm` / `.otp-lg` */
  size?: 'sm' | 'lg'
  /** Connected slots (`.otp-connected`). */
  connected?: boolean
  name?: string
  disabled?: boolean
  autocomplete?: string
}>(), { modelValue: '', length: undefined, groups: undefined, mask: undefined, connected: false, disabled: false, autocomplete: 'one-time-code' })

const emit = defineEmits<{
  /** `complete.bs.otpInput` — all slots filled. Payload: `value`. */
  (e: 'complete', event: BsEvent<{ value: string }>): void
  /** `input.bs.otpInput` — payload `value`. */
  (e: 'input', event: BsEvent<{ value: string }>): void
  (e: 'update:modelValue', value: string): void
}>()

const el = ref<HTMLElement | null>(null)

const plugin = useBootstrapPlugin({
  plugin: 'otp-input',
  el,
  config: () => ({ length: props.length, groups: props.groups, mask: props.mask, separator: props.separator, type: props.type }),
  events: ['complete', 'input'],
  emit: (name, event) => {
    emit(name as 'complete', event as BsEvent<any>)
    if (name === 'input') emit('update:modelValue', (event as any).value)
  },
  onCreated: instance => { if (props.modelValue) instance.setValue(props.modelValue) }
})

watch(() => props.modelValue, value => {
  const instance = plugin.getInstance()
  if (!instance || instance.getValue() === value) return
  if (value) instance.setValue(value)
  else instance.clear()
})

defineExpose({ getValue: () => plugin.getInstance()?.getValue() ?? '', setValue: (v: string | number) => plugin.getInstance()?.setValue(v), clear: () => plugin.getInstance()?.clear(), focus: () => plugin.getInstance()?.focus(), getInstance: plugin.getInstance })
</script>

<template>
  <div ref="el" class="otp" :class="[size && `otp-${size}`, { 'otp-connected': connected }]">
    <input class="otp-input" :maxlength="length ?? undefined" :name="name" :disabled="disabled" :autocomplete="autocomplete">
  </div>
</template>
