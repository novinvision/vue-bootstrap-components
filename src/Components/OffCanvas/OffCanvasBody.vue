<template>
  <div class="offcanvas-body">
    <slot />
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
