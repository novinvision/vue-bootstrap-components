<script>
export default {
  async mounted() {
    if (window && !window.bsDropdownLoaded) {
      // await import("bootstrap/js/src/util/index.js");
      await import("bootstrap/js/src/dropdown.js");

      window.bsDropdownLoaded = true;
    }
  }
}
</script>

<template>
  <div class="dropdown">
    <slot/>
  </div>
</template>