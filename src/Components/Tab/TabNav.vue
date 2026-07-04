<script>
export default {
  props: {
    name: {
      type: String,
      default: 'nav'
    },
  },
  inject: ['tabName'],
  computed: {
    tabNavName() {
      return (this.tabName || this.name) + '-tab'
    },
  }
}
</script>

<template>
  <div
      :id="tabNavName"
      role="tablist"
      :class="['nav nav-tabs']">
    <slot/>
  </div>
</template>