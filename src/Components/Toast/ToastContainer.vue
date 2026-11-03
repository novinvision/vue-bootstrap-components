<script setup lang="ts">
import { computed } from 'vue'
import Toast from './Toast.vue'
import { useToastStore, type ToastItem } from './toastApi'

defineOptions({ name: 'ToastContainer' })

const { toasts, removeToast } = useToastStore()

const placementClasses: Record<string, string> = {
  'top-start': 'top-0 start-0',
  'top-center': 'top-0 start-50 translate-middle-x',
  'top-end': 'top-0 end-0',
  'middle-start': 'top-50 start-0 translate-middle-y',
  'middle-center': 'top-50 start-50 translate-middle',
  'middle-end': 'top-50 end-0 translate-middle-y',
  'bottom-start': 'bottom-0 start-0',
  'bottom-center': 'bottom-0 start-50 translate-middle-x',
  'bottom-end': 'bottom-0 end-0'
}

const groups = computed(() => {
  const map: Record<string, ToastItem[]> = {}
  for (const toast of toasts) (map[toast.placement] ??= []).push(toast)
  return map
})
</script>

<template>
  <div v-for="(items, placement) in groups" :key="placement" class="toast-container position-fixed p-3" :class="placementClasses[placement]">
    <Toast
      v-for="toast in items"
      :key="toast.id"
      :model-value="true"
      :theme="toast.theme ?? undefined"
      :title="toast.title ?? undefined"
      :meta="toast.meta ?? undefined"
      :animation="toast.options.animation"
      :autohide="toast.options.autohide"
      :delay="toast.options.delay"
      @hidden="removeToast(toast.id)"
    >
      {{ toast.message }}
    </Toast>
  </div>
</template>
