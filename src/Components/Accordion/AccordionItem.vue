<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  provide() {
      return {
        'accordionItemName': this.name,
      }
  }
}
</script>

<template>
  <div class="accordion-item" :data-item-id="'accordion-collapse-' + name">
    <slot/>
  </div>
</template>
