<script setup lang="ts">
import { inject } from 'vue'
import { TabsKey } from '../../core/keys'

defineOptions({ name: 'TabList' })

withDefaults(defineProps<{
  /** Visual style of the nav. */
  variant?: 'tabs' | 'pills' | 'underline' | 'none'
  fill?: boolean
  justified?: boolean
  /** Vertical pills (`.nav-pills-vertical`, with `aria-orientation="vertical"`). */
  vertical?: boolean
  /** Accessible label of the tablist. */
  label?: string
}>(), { variant: 'tabs', fill: false, justified: false, vertical: false })

const tabs = inject(TabsKey, null)
</script>

<template>
  <div v-if="tabs?.listGroup" class="list-group" role="tablist" :aria-label="label" :aria-orientation="vertical ? 'vertical' : undefined"><slot /></div>
  <ul v-else class="nav" :class="[variant !== 'none' && `nav-${variant}`, { 'nav-fill': fill, 'nav-justified': justified, 'nav-pills-vertical': vertical }]" role="tablist" :aria-label="label" :aria-orientation="vertical ? 'vertical' : undefined">
    <slot />
  </ul>
</template>
