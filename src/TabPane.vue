<script>
import "bootstrap/js/src/tab.js";

export default {
    props: {
      name: {
        type: String,
        required: true,
      }
    },
    data() {
        return {
        }
    }
}
</script>

<template>
    <div
        :id="name + '-tab-pane'"
        :aria-labelledby="name + '-tab'"
        class="tab-pane fade"
        role="tabpanel"
        tabindex="0">
        <slot />
    </div>
</template>
