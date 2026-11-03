<script setup lang="ts">
import Tag from '../../core/Tag'
defineOptions({ name: 'MenuContent' })

withDefaults(defineProps<{
  /** Limit the height and scroll (`.menu-scrollable`). */
  scrollable?: boolean
  /** Translucent background (`.menu-translucent`). */
  translucent?: boolean
  as?: string
}>(), { scrollable: false, translucent: false, as: 'div' })
</script>

<template>
  <Tag :as="as" class="menu" :class="{ 'menu-scrollable': scrollable, 'menu-translucent': translucent }"><slot /></Tag>
</template>
