<template>
  <div
      class="offcanvas"
      tabindex="-1" :id="name" :aria-labelledby="name + 'Label'">
    <slot/>
  </div>
</template>
<script>
import 'bootstrap/js/src/offcanvas.js';

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
};
</script>
<style>
.vfm__content.offcanvas-button {
  width: 100%;
  right: 0;
  left: 0;
  margin: 0 auto;
}
</style>
