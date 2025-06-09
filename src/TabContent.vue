<script>
import "bootstrap/js/src/tab.js";

export default {
  name: "TabContent",
  data() {
    return {}
  }
}
</script>

<template>
  <div class="tab-content">
    <slot/>
  </div>
</template>
