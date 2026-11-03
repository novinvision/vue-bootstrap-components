<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'
import { useOverlay } from '../../core/registry'

defineOptions({ name: 'CollapseTrigger' })

const props = withDefaults(defineProps<{
  /** `name` of the `Collapse` it controls. */
  name: string
  action?: 'show' | 'hide' | 'toggle'
  as?: string
}>(), { action: 'toggle', as: 'button' })

const overlay = computed(() => useOverlay(props.name))

function onClick(event: Event) {
  if (props.as === 'a') event.preventDefault()
  useOverlay(props.name)[props.action]()
}
</script>

<template>
  <Tag :as="as" :type="as === 'button' ? 'button' : undefined" :role="as === 'a' ? 'button' : undefined" :aria-expanded="String(overlay.isOpen)" :aria-controls="name" @click="onClick"><slot /></Tag>
</template>
