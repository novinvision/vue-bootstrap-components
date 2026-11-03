<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'
import type { ThemeColor } from '../../core/types'

defineOptions({ name: 'ListGroupItem' })

const props = withDefaults(defineProps<{
  /** Makes the item interactive (`.list-group-item-action`); renders `<a>` with `href`, otherwise `<button>`. */
  action?: boolean
  href?: string
  active?: boolean
  disabled?: boolean
  theme?: ThemeColor
  as?: string
}>(), { action: false, active: false, disabled: false })

defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const tag = computed(() => props.as ?? (props.action ? (props.href ? 'a' : 'button') : 'li'))
</script>

<template>
  <Tag
    :as="tag"
    class="list-group-item"
    :class="[theme && `theme-${theme}`, { 'list-group-item-action': action, active, disabled: disabled && tag !== 'button' }]"
    :href="tag === 'a' ? href : undefined"
    :type="tag === 'button' ? 'button' : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-current="active ? 'true' : undefined"
    :aria-disabled="disabled && tag !== 'button' ? 'true' : undefined"
    @click="$emit('click', $event)"
  >
    <slot />
  </Tag>
</template>
