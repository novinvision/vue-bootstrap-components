<template>
  <nav class="fanum" aria-label="Page navigation" v-if="last_page > 1">
    <ul class="pagination pagination-com m-0 justify-content-center flex-wrap">
      <li class="page-item page-item-num" :class="{'active': item.active}" v-for="item in rangLinks">
        <a :href="item.url" :only="only" rel="nofollow" class="page-link" v-if="item.url" v-html="item.label"></a>
        <span class="page-link" v-html="item.label" v-else></span>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  emits: ['page'],
  computed: {
    rangLinks() {
      return this.links?.filter(item => item.url || item.label === '...');
    }
  },
  props: {
    only: Array,
    first_page_url: String,
    last_page_url: String,
    links: Array,
    range_links: Array,
    current_page: Number,
    to: Number,
    total: Number,
    total_pages: Number,
    last_page: Number,
  },
}
</script>
<style>
.pagination .page-item.page-item-num .page-link {
  min-width: 45px;
  text-align: center;
}

@media (max-width: 480px) {
  .pagination .page-item {
    margin: 2px 0;
  }
}
</style>
