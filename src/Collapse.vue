<script>
import 'bootstrap/js/dist/collapse.js';

export default {
  props:{
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
    <div class="collapse" :id="name + 'Collapse'">
        <slot/>
    </div>
</template>
