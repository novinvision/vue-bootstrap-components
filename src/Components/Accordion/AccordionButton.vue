<script>
export default {
  props: {
    name: {
      type: String,
    },
  },
  inject: ['accordionItemName'],
  computed: {
    buttonName() {
      return this.accordionItemName || this.name
    }
  }
}
</script>

<template>
  <button type="button"
          data-bs-toggle="collapse"
          :data-bs-target="'#accordion-collapse-' + buttonName"
          aria-expanded="false"
          :aria-controls="'#accordion-collapse-' + buttonName"
          class="accordion-button">
    <slot/>
  </button>
</template>
