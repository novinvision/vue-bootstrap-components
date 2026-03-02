<template>
  <button type="button" data-bs-toggle="offcanvas" :data-bs-target="'#' + name">
      <slot/>
  </button>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: 'offcanvas',
    },
  },
};
</script>
