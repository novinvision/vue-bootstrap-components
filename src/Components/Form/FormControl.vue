<script setup lang="ts">
defineOptions({ name: 'FormControl', inheritAttrs: false })

const model = defineModel<string | number | string[] | null>()

withDefaults(defineProps<{
  /** Rendered element. `select` uses `.form-control` too in Bootstrap 6. */
  as?: 'input' | 'textarea' | 'select'
  /** Input `type` (only for `as="input"`). */
  type?: string
  /** Show the native validation styling immediately (`.is-invalid`). */
  invalid?: boolean
  /** `.is-valid`. */
  valid?: boolean
}>(), { as: 'input', type: 'text', invalid: false, valid: false })
</script>

<template>
  <select v-if="as === 'select'" v-bind="$attrs" v-model="model" class="form-control" :class="{ 'is-invalid': invalid, 'is-valid': valid }"><slot /></select>
  <textarea v-else-if="as === 'textarea'" v-bind="$attrs" v-model="model as string" class="form-control" :class="{ 'is-invalid': invalid, 'is-valid': valid }" />
  <input v-else v-bind="$attrs" v-model="model as string" :type="type" class="form-control" :class="{ 'is-invalid': invalid, 'is-valid': valid }">
</template>
