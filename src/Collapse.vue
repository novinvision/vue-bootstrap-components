<script>
export default {
  props:{
    name: {
      type: String,
      required: true
    }
  },
  async mounted() {
    if (window && !window.bsCollapseLoaded) {
      await import("bootstrap/js/dist/collapse.js");

      window.bsCollapseLoaded = true;
    }
  }
}
</script>

<template>
    <div class="collapse" :id="name + 'Collapse'">
        <slot/>
    </div>
</template>
