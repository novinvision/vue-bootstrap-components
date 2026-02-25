<template>
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" :id="name+'Label'">
      <slot/>
    </h5>
    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
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
