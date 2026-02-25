<script setup>
import { ref, defineExpose } from 'vue'
import Offcanvas from 'bootstrap/js/dist/offcanvas'
import { useBootstrapInstance } from '../../Composables/useBootstrapInstance'

const props = defineProps({
  name: {
    type: String,
    default: 'offcanvasExample',
  }
})

const el = ref(null)

const { getInstance } = useBootstrapInstance(el, Offcanvas)

const show = () => getInstance()?.show()
const hide = () => getInstance()?.hide()

defineExpose({ show, hide })
</script>
<template>
  <div class="offcanvas" tabindex="-1" :id="props.name" :aria-labelledby="props.name + 'Label'" ref="el">
    <slot/>
  </div>
</template>