<script setup lang="ts">
import { inject } from 'vue'
import { DrawerKey } from '../../core/keys'

defineOptions({ name: 'DrawerClose' })

withDefaults(defineProps<{ label?: string }>(), { label: 'Close' })

const drawer = inject(DrawerKey, null)
</script>

<template>
  <button v-if="!$slots.default" type="button" class="btn-close" :aria-label="label" @click="drawer?.hide()" />
  <button v-else type="button" @click="drawer?.hide()"><slot /></button>
</template>
