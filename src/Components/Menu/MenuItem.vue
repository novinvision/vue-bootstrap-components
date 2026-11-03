<script setup lang="ts">
import Tag from '../../core/Tag'
import { computed } from 'vue'
import type { ThemeColor } from '../../core/types'

defineOptions({ name: 'MenuItem' })

const props = withDefaults(defineProps<{
  /** Renders `<a>` when set, otherwise `<button>`. */
  href?: string
  /** `.active` — current page/item (`aria-current`). */
  active?: boolean
  /** `.selected` — current selection; shows the check mark. */
  selected?: boolean
  disabled?: boolean
  /** Theme color (`.theme-*`), e.g. `danger` for destructive actions. */
  theme?: ThemeColor
  /** Secondary text below the label (`.menu-item-description`). */
  description?: string
  /** Always render the check mark slot (use together with `selected`). */
  check?: boolean
  as?: string
}>(), { active: false, selected: false, disabled: false, check: false })

defineEmits<{ (e: 'click', event: MouseEvent): void }>()

const tag = computed(() => props.as ?? (props.href ? 'a' : 'button'))
</script>

<template>
  <Tag
    :as="tag"
    class="menu-item"
    :class="[theme && `theme-${theme}`, { active, selected, disabled: disabled && tag !== 'button' }]"
    :href="tag === 'a' ? href : undefined"
    :type="tag === 'button' ? 'button' : undefined"
    :disabled="tag === 'button' ? disabled : undefined"
    :aria-current="active ? 'true' : undefined"
    :aria-disabled="disabled && tag !== 'button' ? 'true' : undefined"
    @click="$emit('click', $event)"
  >
    <slot name="icon" />
    <span v-if="description" class="menu-item-content">
      <span><slot /></span>
      <small class="menu-item-description">{{ description }}</small>
    </span>
    <slot v-else />
    <svg v-if="check || selected" class="menu-item-check" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 16 16" aria-hidden="true"><path d="m2 7 4 5 8-8" /></svg>
  </Tag>
</template>
