<script setup lang="ts">
import Tag from '../../core/Tag'
defineOptions({ name: 'Nav' })

withDefaults(defineProps<{
  variant?: 'tabs' | 'pills' | 'underline' | 'none'
  fill?: boolean
  justified?: boolean
  vertical?: boolean
  as?: string
}>(), { variant: 'none', fill: false, justified: false, vertical: false, as: 'ul' })
</script>

<template>
  <Tag :as="as" class="nav" :class="[variant !== 'none' && `nav-${variant}`, { 'nav-fill': fill, 'nav-justified': justified, 'nav-pills-vertical': vertical }]"><slot /></Tag>
</template>
