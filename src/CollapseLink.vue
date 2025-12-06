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
  <a role="button"
          data-bs-toggle="collapse"
          :href="'#'+name+'Collapse'"
          :data-bs-target="'#'+name+'Collapse'"
          aria-expanded="false"
          :aria-controls="name+'Collapse'">
    <slot />
  </a>
</template>
