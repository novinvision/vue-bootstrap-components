<script setup lang="ts">
defineOptions({ name: 'BreadcrumbItem' })

withDefaults(defineProps<{
  /** Link target. Items without `href` render a `<span class="breadcrumb-link">`. */
  href?: string
  /** Marks the current page (`aria-current="page"` and `.active` on the link). */
  active?: boolean
  /** Render a divider element before this item (omit it on the first item). */
  divider?: boolean
  /** Custom divider content (text such as `/` or `›`). Leave empty for the default chevron. */
  separator?: string
}>(), { active: false, divider: true })
</script>

<template>
  <li v-if="divider" class="breadcrumb-divider"><slot name="divider">{{ separator }}</slot></li>
  <li class="breadcrumb-item" :aria-current="active ? 'page' : undefined">
    <a v-if="href" class="breadcrumb-link" :class="{ active }" :href="href"><slot /></a>
    <span v-else class="breadcrumb-link" :class="{ active }"><slot /></span>
  </li>
</template>
