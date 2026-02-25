<script>
export default {
  props: {
    name: {
      type: String,
      default: 'myTab'
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