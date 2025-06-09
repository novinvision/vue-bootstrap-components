<script>
export default {
    props: {
      name: {
        type: String,
        required: true,
      },
      selected: {
        type: Boolean,
        default: false,
      }
    },
    data() {
        return {
        }
    }
}
</script>

<template>
    <button
        :id="name + '-tab'"
        data-bs-toggle="tab"
        :data-bs-target="'#'+name + '-tab-pane'"
        :aria-controls="name + '-tab-pane'"
        :aria-selected="selected"
        type="button"
        role="tab">
        <slot/>
    </button>
</template>
