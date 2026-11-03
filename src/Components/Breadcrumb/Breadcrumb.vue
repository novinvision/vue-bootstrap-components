<script setup lang="ts">
defineOptions({ name: 'Breadcrumb' })

withDefaults(defineProps<{
  /** Accessible label of the `<nav>`. */
  label?: string
}>(), { label: 'breadcrumb' })
</script>

<template>
  <nav :aria-label="label">
    <ol class="breadcrumb"><slot /></ol>
  </nav>
</template>
