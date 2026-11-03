<script setup lang="ts">
defineOptions({ name: 'CardImg' })

withDefaults(defineProps<{
  src: string
  alt?: string
  /** Where the image sits in the card. */
  position?: 'top' | 'bottom' | 'start' | 'end' | 'none'
}>(), { alt: '', position: 'top' })
</script>

<template>
  <img :src="src" :alt="alt" :class="position === 'none' ? 'card-img' : `card-img-${position}`">
</template>
