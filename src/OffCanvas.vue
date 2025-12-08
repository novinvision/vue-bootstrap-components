<template>
  <div
      class="offcanvas"
      tabindex="-1" :id="name" :aria-labelledby="name + 'Label'">
    <slot/>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  async mounted() {
    if(window && !window.bsOffcanvasLoaded){
      await import("bootstrap/js/src/offcanvas.js");

      window.bsOffcanvasLoaded = true;
    }
  }
};
</script>