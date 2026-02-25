<script setup>
import {ref, defineExpose, defineEmits, onMounted, onBeforeUnmount} from 'vue'
import Offcanvas from 'bootstrap/js/dist/offcanvas'
import { useBootstrapInstance } from '../../Composables/useBootstrapInstance'

const emit = defineEmits([
  'hide',
  'hidden',
  'hidePrevented',
  'show',
  'shown',
])

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

const emitHide = (event) => emit('hide', event)
const emitHidden = (event) => emit('hidden', event)
const emitHidePrevented = (event) => emit('hidePrevented', event)
const emitShow = (event) => emit('show', event)
const emitShown = (event) => emit('shown', event)

onMounted(() => {
  el.value.addEventListener('hide.bs.offcanvas', emitHide)
  el.value.addEventListener('hidden.bs.offcanvas', emitHidden)
  el.value.addEventListener('hidePrevented.bs.offcanvas', emitHidePrevented)
  el.value.addEventListener('show.bs.offcanvas', emitShow)
  el.value.addEventListener('shown.bs.offcanvas', emitShown)
})

onBeforeUnmount(() => {
  el.value.removeEventListener('hide.bs.offcanvas', emitHide)
  el.value.removeEventListener('hidden.bs.offcanvas', emitHidden)
  el.value.removeEventListener('hidePrevented.bs.offcanvas', emitHidePrevented)
  el.value.removeEventListener('show.bs.offcanvas', emitShow)
  el.value.removeEventListener('shown.bs.offcanvas', emitShown)
})

</script>
<template>
  <div class="offcanvas" tabindex="-1" :id="props.name" :aria-labelledby="props.name + 'Label'" ref="el">
    <slot/>
  </div>
</template>