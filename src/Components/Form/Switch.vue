<script setup lang="ts">
import { useStableId } from '../../core/utils'

defineOptions({ name: 'Switch', inheritAttrs: false })

const model = defineModel<boolean | unknown[] | null>({ default: false })

const props = withDefaults(defineProps<{
  label?: string
  value?: string | number | boolean
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
    <div class="switch" :class="size && `switch-${size}`">
      <input v-bind="$attrs" :id="inputId()" v-model="model" type="checkbox" role="switch" switch :value="value" :name="name" :disabled="disabled">
    </div>
    <label :for="inputId()"><slot>{{ label }}</slot></label>
  </div>
</template>
