<script setup lang="ts">
import { useStableId } from '../../core/utils'

defineOptions({ name: 'Radio', inheritAttrs: false })

const model = defineModel<unknown>()

const props = withDefaults(defineProps<{
  label?: string
  /** Value assigned to `v-model` when selected. */
  value: string | number | boolean
  size?: 'sm' | 'lg'
  id?: string
  name?: string
  disabled?: boolean
}>(), { disabled: false })

const generatedId = useStableId('bs-field')
const inputId = () => props.id ?? generatedId
</script>

<template>
  <div class="form-field">
    <input v-bind="$attrs" :id="inputId()" v-model="model" type="radio" class="radio" :class="size && `radio-${size}`" :value="value" :name="name" :disabled="disabled">
    <label :for="inputId()"><slot>{{ label }}</slot></label>
  </div>
</template>
