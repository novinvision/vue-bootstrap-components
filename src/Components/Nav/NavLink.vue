<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'

defineOptions({ name: 'NavLink' })

const props = withDefaults(defineProps<{
  href?: string
  active?: boolean
  disabled?: boolean
  as?: string
}>(), { active: false, disabled: false })

defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const tag = computed(() => props.as ?? (props.href ? 'a' : 'button'))
</script>

<template>
  <Tag
    :as="tag"
    class="nav-link"
    :class="{ active, disabled }"
    :href="tag === 'a' ? href : undefined"
    :type="tag === 'button' ? 'button' : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-current="active ? 'page' : undefined"
    :aria-disabled="disabled && tag !== 'button' ? 'true' : undefined"
    @click="$emit('click', $event)"
  >
    <slot />
  </Tag>
</template>
