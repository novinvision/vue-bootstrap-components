<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'
import type { Breakpoint } from '../../core/types'

defineOptions({ name: 'Navbar' })

const props = withDefaults(defineProps<{
  /** `true` always expanded (`.navbar-expand`), or a breakpoint (`.md:navbar-expand`). */
  expand?: boolean | Breakpoint
  /** Translucent background (`.navbar-translucent`). */
  translucent?: boolean
  /** Dark color scheme for the navbar (`data-bs-theme="dark"`). */
  dark?: boolean
  /** Inner container: `fluid` (default), `container`, a breakpoint (`.md:container`) or `false` for none. */
  container?: 'fluid' | 'container' | Breakpoint | false
  as?: string
}>(), { expand: false, translucent: false, dark: false, container: 'fluid', as: 'nav' })

const expandClass = computed(() => (props.expand === true ? 'navbar-expand' : props.expand ? `${props.expand}:navbar-expand` : undefined))
const containerClass = computed(() => (props.container === 'fluid' ? 'container-fluid' : props.container === 'container' ? 'container' : props.container ? `${props.container}:container` : undefined))
</script>

<template>
  <Tag :as="as" class="navbar" :class="[expandClass, { 'navbar-translucent': translucent }]" :data-bs-theme="dark ? 'dark' : undefined">
    <div v-if="containerClass" :class="containerClass"><slot /></div>
    <slot v-else />
  </Tag>
</template>
