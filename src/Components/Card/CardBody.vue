<script setup lang="ts">
import Tag from '../../core/Tag'
defineOptions({ name: 'CardBody' })

withDefaults(defineProps<{
  /** Horizontal body (`.flex-row`). */
  row?: boolean
  as?: string
}>(), { row: false, as: 'div' })
</script>

<template>
  <Tag :as="as" class="card-body" :class="{ 'flex-row': row }"><slot /></Tag>
</template>
