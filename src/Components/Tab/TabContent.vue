<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  inject: ['tabName'],
  computed: {
    tabContentName() {
      return (this.tabName || this.name) + 'Content'
    }
  }
}
</script>

<template>
  <div :id="tabContentName" class="tab-content">
    <slot/>
  </div>
</template>