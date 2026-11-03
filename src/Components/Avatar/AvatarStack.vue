<script setup lang="ts">
import type { Size } from '../../core/types'

defineOptions({ name: 'AvatarStack' })

defineProps<{
  /** Size of the stacked avatars (`.avatar-stack-*`). */
  size?: Exclude<Size, 'md'>
}>()
</script>

<template>
  <div class="avatar-stack" :class="size && `avatar-stack-${size}`"><slot /></div>
</template>
