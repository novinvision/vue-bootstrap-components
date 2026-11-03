<script setup lang="ts">
import Tag from '../../core/Tag'
import { useOverlay } from '../../core/registry'

defineOptions({ name: 'DrawerTrigger' })

const props = withDefaults(defineProps<{
  /** `name` of the `Drawer` to open. */
  name: string
  action?: 'show' | 'hide' | 'toggle'
  as?: string
}>(), { action: 'toggle', as: 'button' })

function onClick() {
  useOverlay(props.name)[props.action]()
}
</script>

<template>
  <Tag :as="as" :type="as === 'button' ? 'button' : undefined" aria-haspopup="dialog" @click="onClick"><slot /></Tag>
</template>
