<script setup lang="ts">
import { inject } from 'vue'
import { DialogKey } from '../../core/keys'

defineOptions({ name: 'DialogClose' })

withDefaults(defineProps<{
  /** Render a plain close icon button (`.btn-close`) when there is no slot content. */
  label?: string
}>(), { label: 'Close' })

const dialog = inject(DialogKey, null)
</script>

<template>
  <button v-if="!$slots.default" type="button" class="btn-close" :aria-label="label" @click="dialog?.hide()" />
  <button v-else type="button" @click="dialog?.hide()"><slot /></button>
</template>
