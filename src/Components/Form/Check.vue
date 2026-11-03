<script setup lang="ts">
import { useStableId } from '../../core/utils'

defineOptions({ name: 'Check', inheritAttrs: false })

const model = defineModel<boolean | unknown[] | null>({ default: false })

const props = withDefaults(defineProps<{
  /** Label text. Use the default slot for custom markup. */
  label?: string
  /** Value used when `v-model` is an array. */
  value?: string | number | boolean
  /** Size: `sm` or `lg`. */
  size?: 'sm' | 'lg'
  id?: string
  name?: string
  disabled?: boolean
  indeterminate?: boolean
}>(), { disabled: false, indeterminate: false })

const generatedId = useStableId('bs-field')
const inputId = () => props.id ?? generatedId
</script>

<template>
  <div class="form-field">
    <input v-bind="$attrs" :id="inputId()" v-model="model" type="checkbox" class="check" :class="size && `check-${size}`" :value="value" :name="name" :disabled="disabled" :indeterminate="indeterminate">
    <label :for="inputId()"><slot>{{ label }}</slot></label>
  </div>
</template>
