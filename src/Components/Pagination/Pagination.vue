<script setup lang="ts">
import { computed } from 'vue'
import type { Size } from '../../core/types'

defineOptions({ name: 'Pagination' })

import type { PaginationLink } from './types'

const props = withDefaults(defineProps<{
  /** Laravel/Inertia paginator `links` (labels may contain HTML entities). */
  links?: PaginationLink[]
  /** Alternative to `links`: current page (1-based). */
  currentPage?: number
  /** Alternative to `links`: last page. */
  lastPage?: number
  /** Number of pages shown around the current one (only with `currentPage`/`lastPage`). */
  siblings?: number
  size?: Exclude<Size, 'md' | 'xs' | 'xl'>
  /** Keep the pager hidden when there is a single page. */
  hideSinglePage?: boolean
  /** Accessible label. */
  label?: string
  /** Add `rel="nofollow"` to page links. */
  nofollow?: boolean
}>(), { siblings: 2, hideSinglePage: true, label: 'Page navigation', nofollow: true })

const emit = defineEmits<{
  /** Fired for every click on a page. `page` is the 1-based number (when known) and `url` the link URL. */
  (e: 'page', payload: { page: number | null; url: string | null; event: MouseEvent }): void
}>()

interface Item { label: string; page: number | null; url: string | null; active: boolean; disabled: boolean }

const items = computed<Item[]>(() => {
  if (props.links) {
    return props.links
      .filter(link => link.url || link.label === '...')
      .map(link => ({
        label: link.label,
        url: link.url,
        page: Number(new URL(link.url ?? 'http://x', 'http://x').searchParams.get('page')) || null,
        active: link.active,
        disabled: !link.url
      }))
  }
  const current = props.currentPage ?? 1
  const last = props.lastPage ?? 1
  const from = Math.max(1, current - props.siblings)
  const to = Math.min(last, current + props.siblings)
  const list: Item[] = [{ label: '&laquo;', page: current - 1, url: null, active: false, disabled: current <= 1 }]
  for (let page = from; page <= to; page++) list.push({ label: String(page), page, url: null, active: page === current, disabled: false })
  list.push({ label: '&raquo;', page: current + 1, url: null, active: false, disabled: current >= last })
  return list
})

const total = computed(() => props.lastPage ?? (props.links ? props.links.length - 2 : 1))
const visible = computed(() => !props.hideSinglePage || total.value > 1)

function onClick(event: MouseEvent, item: Item) {
  if (item.disabled) { event.preventDefault(); return }
  emit('page', { page: item.page, url: item.url, event })
}
</script>

<template>
  <nav v-if="visible" :aria-label="label">
    <ul class="pagination flex-wrap justify-content-center" :class="size && `pagination-${size}`">
      <li v-for="(item, index) in items" :key="index" class="page-item" :class="{ active: item.active, disabled: item.disabled }">
        <a v-if="!item.disabled && !item.active" class="page-link" :href="item.url ?? '#'" :rel="nofollow ? 'nofollow' : undefined" @click="onClick($event, item)" v-html="item.label" />
        <span v-else class="page-link" :class="{ active: item.active, disabled: item.disabled }" :aria-current="item.active ? 'page' : undefined" v-html="item.label" />
      </li>
    </ul>
  </nav>
</template>
