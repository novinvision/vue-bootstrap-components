<script setup lang="ts">
import Tag from '../../core/Tag'
defineOptions({ name: 'FormField' })

withDefaults(defineProps<{
  /** Card-like field (`.form-field-card`). */
  card?: boolean
  as?: string
}>(), { card: false, as: 'div' })
</script>

<template>
  <Tag :as="as" class="form-field" :class="{ 'form-field-card': card }"><slot /></Tag>
</template>
