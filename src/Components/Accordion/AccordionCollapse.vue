<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  },
  inject: ['accordionName'],
  computed: {
    isActive(){
      return false;
    }
  }
}
</script>

<template>
  <div :id="'accordion-collapse-' + name" class="accordion-collapse collapse" :class="{'show': isActive}" v-if="isActive" :data-bs-parent="'#' + accordionName">
      <slot/>
  </div>
</template>
