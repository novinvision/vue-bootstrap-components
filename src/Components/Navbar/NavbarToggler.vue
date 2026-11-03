<script setup lang="ts">
import { computed } from 'vue'
import { useOverlay } from '../../core/registry'

defineOptions({ name: 'NavbarToggler' })

const props = withDefaults(defineProps<{
  /** `name` of the `Drawer` or `Collapse` this button toggles. */
  target?: string
  label?: string
}>(), { label: 'Toggle navigation' })

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const overlay = computed(() => (props.target ? useOverlay(props.target) : null))

function onClick(event: MouseEvent) {
  emit('click', event)
  overlay.value?.toggle()
}
</script>

<template>
  <button type="button" class="btn-icon navbar-toggler" :aria-controls="target" :aria-expanded="overlay?.isOpen ?? false" :aria-label="label" @click="onClick">
    <slot><span class="navbar-toggler-icon" aria-hidden="true" /></slot>
  </button>
</template>
