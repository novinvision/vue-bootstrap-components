<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    }
  }
}
</script>

<template>
  <button type="button"
          data-bs-toggle="collapse"
          :data-bs-target="'#'+name+'Collapse'"
          aria-expanded="false"
          :aria-controls="name+'Collapse'">
    <slot />
  </button>
</template>
