<script setup lang="ts">
import { computed, provide } from 'vue'
import { uniqueId } from '../../core/utils'

defineOptions({ name: 'Accordion' })

const props = withDefaults(defineProps<{
  /** Only one item can be open at a time (native `<details name>` group). */
  exclusive?: boolean
  /** Compact padding and type (`.accordion-sm`). */
  small?: boolean
  /** Space the items apart as separate rounded cards (`.accordion-gap`). */
  gap?: boolean
  /** Remove outer borders and rounded corners (`.accordion-flush`). */
  flush?: boolean
  /** Custom group name for exclusive mode. Generated when omitted. */
  name?: string
}>(), { exclusive: false, small: false, gap: false, flush: false })

const generated = uniqueId('accordion')
const groupName = computed(() => (props.exclusive ? props.name ?? generated : undefined))

provide('bsAccordionGroup', groupName)
</script>

<template>
  <div class="accordion" :class="{ 'accordion-sm': small, 'accordion-gap': gap, 'accordion-flush': flush }">
    <slot />
  </div>
</template>
