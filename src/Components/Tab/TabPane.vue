<script>
export default {
  props: {
    name: {
      type: String,
      default: 'tab1'
    },
    animation: {
      type: Number,
      default: 'fade',
    }
  },
  inject: ['tabName'],
  computed: {
    tabPaneName() {
      return (this.tabName || this.name) + '-pane'
    },
    tabBtnName() {
      return (this.tabName || this.name) + '-btn';
    },
  }
}
</script>

<template>
  <div
      :id="tabPaneName"
      role="tabpanel"
      :aria-labelledby="tabPaneNames"
      tabindex="0"
      :class="['tab-pane', animation]">
    <slot/>
  </div>
</template>