<script setup lang="ts">
import Tag from '../../core/Tag'
defineOptions({ name: 'Placeholder' })

withDefaults(defineProps<{
  /** Grid width `1`-`12` (`.col-6`). */
  cols?: number
  /** `xs`, `sm` or `lg`. */
  size?: 'xs' | 'sm' | 'lg'
  /** Any CSS width, e.g. `60%`. */
  width?: string
  as?: string
}>(), { as: 'span' })
</script>

<template>
  <Tag :as="as" class="placeholder" :class="[cols && `col-${cols}`, size && `placeholder-${size}`]" :style="width ? { width } : undefined" />
</template>
