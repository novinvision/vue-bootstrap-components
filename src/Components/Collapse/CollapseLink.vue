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
  <a type="button"
          data-bs-toggle="collapse"
          :href="'#'+name+'Collapse'"
          aria-expanded="false"
          role="button"
          :aria-controls="name+'Collapse'">
    <slot />
  </a>
</template>
