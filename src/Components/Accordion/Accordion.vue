<script setup>
import {ref, defineExpose, defineEmits, defineProps, onMounted, onBeforeUnmount, provide} from 'vue'
import Collapse from 'bootstrap/js/src/collapse'
import {useBootstrapInstance} from '../../Composables/useBootstrapInstance'

const props = defineProps({
  name: {
    type: String,
    default: 'accordionExample'
  }
})

const el = ref(null)

const {getInstance} = useBootstrapInstance(el, Collapse)

const show = () => getInstance()?.show()
const hide = () => getInstance()?.hide()
const toggle = () => getInstance()?.toggle()

defineExpose({show, hide, toggle})


const emit = defineEmits([
  'hide',
  'hidden',
  'show',
  'shown',
])

const emitHide = (event) => emit('hide', event)
const emitHidden = (event) => emit('hidden', event)
const emitShow = (event) => emit('show', event)
const emitShown = (event) => emit('shown', event)

onMounted(() => {
  el.value.addEventListener('hide.bs.collapse', emitHide)
  el.value.addEventListener('hidden.bs.collapse', emitHidden)
  el.value.addEventListener('show.bs.collapse', emitShow)
  el.value.addEventListener('shown.bs.collapse', emitShown)
})

onBeforeUnmount(() => {
  el.value.removeEventListener('hide.bs.collapse', emitHide)
  el.value.removeEventListener('hidden.bs.collapse', emitHidden)
  el.value.removeEventListener('show.bs.collapse', emitShow)
  el.value.removeEventListener('shown.bs.collapse', emitShown)
})

provide({
  'accordionName': props.value.name,
})

</script>
<template>
  <div :id="name" class="accordion">
    <slot/>
  </div>
</template>