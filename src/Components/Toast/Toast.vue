<script setup>
import {ref, onMounted, onBeforeUnmount} from 'vue'

const props = defineProps({
  toast: {
    type: Object,
    required: true,
  }
})

const emit = defineEmits(['hidden'])

const el = ref(null)
let instance = null

const emitHidden = () => emit('hidden', props.toast.id)

onMounted(async () => {
  const {default: BsToast} = await import('bootstrap/js/dist/toast')

  instance = BsToast.getOrCreateInstance(el.value, props.toast.toastOptions)

  el.value.addEventListener('hidden.bs.toast', emitHidden)
  instance.show()
})

onBeforeUnmount(() => {
  el.value?.removeEventListener('hidden.bs.toast', emitHidden)
  instance?.dispose()
  instance = null
})
</script>

<template>
  <div
      ref="el"
      class="toast"
      :class="toast.type ? `text-bg-${toast.type} border-0` : ''"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
  >
    <template v-if="toast.title">
      <div class="toast-header">
        <strong class="me-auto">{{ toast.title }}</strong>
        <small v-if="toast.meta">{{ toast.meta }}</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body">{{ toast.message }}</div>
    </template>

    <div v-else class="d-flex">
      <div class="toast-body">{{ toast.message }}</div>
      <button
          type="button"
          class="btn-close me-2 m-auto"
          :class="toast.type ? 'btn-close-white' : ''"
          data-bs-dismiss="toast"
          aria-label="Close"
      ></button>
    </div>
  </div>
</template>