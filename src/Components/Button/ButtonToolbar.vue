<script setup lang="ts">
defineOptions({ name: 'ButtonToolbar' })

defineProps<{
  /** Accessible name of the toolbar (`aria-label`). */
  label?: string
}>()
</script>

<template>
  <div class="btn-toolbar" role="toolbar" :aria-label="label"><slot /></div>
</template>
