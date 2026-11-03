<script setup lang="ts">
import { inject } from 'vue'
import { AlertKey, DialogKey, DismissKey, DrawerKey, ToastKey } from '../../core/keys'
import { useOverlay } from '../../core/registry'

defineOptions({ name: 'CloseButton' })

const props = withDefaults(defineProps<{
  /**
   * What to close, like Bootstrap's `data-bs-dismiss`: `alert`, `toast`, `dialog` or `drawer`.
   * When omitted, the nearest parent Alert / Toast / Dialog / Drawer is closed automatically.
   */
  dismiss?: 'alert' | 'toast' | 'dialog' | 'drawer'
  /** Close another component by its `name` (Dialog, Drawer, Toast, Collapse ...) instead of the parent. */
  target?: string
  /** Accessible label. */
  label?: string
  disabled?: boolean
}>(), { label: 'Close', disabled: false })

const emit = defineEmits<{
  /** Fired before the parent is closed. Call `event.preventDefault()` to keep it open. */
  (e: 'click', event: MouseEvent): void
}>()

const nearest = inject(DismissKey, null)
const dialog = inject(DialogKey, null)
const drawer = inject(DrawerKey, null)
const toast = inject(ToastKey, null)
const alert = inject(AlertKey, null)

function onClick(event: MouseEvent) {
  if (props.disabled) return
  emit('click', event)
  if (event.defaultPrevented) return

  if (props.target) return void useOverlay(props.target).hide()
  switch (props.dismiss) {
    case 'dialog': return void dialog?.hide()
    case 'drawer': return void drawer?.hide()
    case 'toast': return void toast?.hide()
    case 'alert': return void alert?.close()
    default: nearest?.close()
  }
}
</script>

<template>
  <button type="button" class="btn-close" :aria-label="label" :disabled="disabled" @click="onClick" />
</template>
