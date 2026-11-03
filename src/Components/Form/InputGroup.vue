<script setup lang="ts">
defineOptions({ name: 'InputGroup' })

defineProps<{
  /** `sm` or `lg`. */
  size?: 'sm' | 'lg'
}>()
</script>

<template>
  <div class="input-group" :class="size && `input-group-${size}`"><slot /></div>
</template>
