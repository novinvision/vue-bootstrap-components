<script setup lang="ts">
import { inject, onBeforeUnmount } from 'vue'
import { CarouselKey } from '../../core/keys'

defineOptions({ name: 'CarouselItem' })

defineProps<{
  /** Per-slide autoplay delay in ms (`data-bs-interval`). */
  interval?: number
}>()

const carousel = inject(CarouselKey, null)
const index = carousel?.register() ?? 0
// Bootstrap owns the `active` class after the first render.
const initiallyActive = index === 0

onBeforeUnmount(() => carousel?.unregister())
</script>

<template>
  <div class="carousel-item" :class="{ active: initiallyActive }" :data-bs-interval="interval"><slot /></div>
</template>
