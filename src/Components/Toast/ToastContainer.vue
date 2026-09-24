<script setup>
import {computed} from 'vue'
import Toast from './Toast.vue'
import {useToastStore} from '../../Composables/useToastStore'

const {toasts, removeToast} = useToastStore()

const placementClasses = {
  'top-start': 'top-0 start-0',
  'top-center': 'top-0 start-50 translate-middle-x',
  'top-end': 'top-0 end-0',
  'middle-start': 'top-50 start-0 translate-middle-y',
  'middle-center': 'top-50 start-50 translate-middle',
  'middle-end': 'top-50 end-0 translate-middle-y',
  'bottom-start': 'bottom-0 start-0',
  'bottom-center': 'bottom-0 start-50 translate-middle-x',
  'bottom-end': 'bottom-0 end-0',
}

const groups = computed(() => {
  const map = {}
  for (const toast of toasts) {
    if (!map[toast.placement]) map[toast.placement] = []
    map[toast.placement].push(toast)
  }
  return map
})
</script>

<template>
  <div
      v-for="(items, placement) in groups"
      :key="placement"
      class="toast-container position-fixed p-3"
      :class="placementClasses[placement]"
      style="z-index: 1090;"
  >
    <Toast
        v-for="toast in items"
        :key="toast.id"
        :toast="toast"
        @hidden="removeToast"
    />
  </div>
</template>