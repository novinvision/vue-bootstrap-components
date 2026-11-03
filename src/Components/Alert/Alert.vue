<script setup lang="ts">
import { nextTick, provide, ref, watch } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { AlertKey, DismissKey } from '../../core/keys'
import type { BsEvent, ThemeColor } from '../../core/types'

defineOptions({ name: 'Alert', inheritAttrs: false })

const props = withDefaults(defineProps<{
  /** Theme color (`.theme-*`). */
  theme?: ThemeColor
  /** Show a close button. */
  dismissible?: boolean
  /** Visibility (`v-model`). */
  modelValue?: boolean
  /** Disable the fade transition (`.alert-instant`). */
  instant?: boolean
  /** Accessible label of the close button. */
  closeLabel?: string
}>(), { theme: 'warning', dismissible: false, modelValue: true, instant: false, closeLabel: 'Close' })

const emit = defineEmits<{
  /** `close.bs.alert` — cancelable. */
  (e: 'close', event: BsEvent): void
  /** `closed.bs.alert` */
  (e: 'closed', event: BsEvent): void
  (e: 'update:modelValue', visible: boolean): void
}>()

const el = ref<HTMLElement | null>(null)
const visible = ref(props.modelValue)

const plugin = useBootstrapPlugin({
  plugin: 'alert',
  el,
  events: ['close', 'closed'],
  emit: (name, event) => {
    emit(name as 'close', event)
    if (name === 'closed') {
      // Bootstrap removes the element itself; let Vue drop its vnode as well.
      visible.value = false
      emit('update:modelValue', false)
    }
  }
})

watch(() => props.modelValue, async value => {
  if (value && !visible.value) {
    visible.value = true
    await nextTick()
    await plugin.recreate()
  } else if (!value && visible.value) {
    plugin.getInstance()?.close()
  }
})

const close = () => plugin.getInstance()?.close()

provide(AlertKey, { close })
provide(DismissKey, { type: 'alert', close })
defineExpose({ close })
</script>

<template>
  <!-- Stable host: Bootstrap removes the alert element itself, Vue needs a parent to keep its v-if anchor in. -->
  <div style="display: contents">
    <div v-if="visible" ref="el" v-bind="$attrs" class="alert" :class="[`theme-${theme}`, { 'alert-instant': instant }]" role="alert">
      <slot :close="close" />
      <button v-if="dismissible" type="button" class="btn-close ms-auto" :aria-label="closeLabel" @click="close" />
    </div>
  </div>
</template>
