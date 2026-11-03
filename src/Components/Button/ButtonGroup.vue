<script setup lang="ts">
defineOptions({ name: 'ButtonGroup' })

withDefaults(defineProps<{
  /** Stack buttons vertically (`.btn-group-vertical`). */
  vertical?: boolean
  /** Add a divider between buttons (`.btn-group-divider`). */
  divider?: boolean
  /** `xs`, `sm` (default size when omitted). Sizing classes go on the group (`.btn-group-sm`). */
  size?: 'xs' | 'sm' | 'lg'
  /** Accessible name of the group (`aria-label`). */
  label?: string
  /** `group` (default) or `toolbar`. */
  role?: 'group' | 'toolbar'
}>(), { vertical: false, divider: false, role: 'group' })
</script>

<template>
  <div :class="[vertical ? 'btn-group-vertical' : 'btn-group', size && `btn-group-${size}`, { 'btn-group-divider': divider }]" :role="role" :aria-label="label">
    <slot />
  </div>
</template>
