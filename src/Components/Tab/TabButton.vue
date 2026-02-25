<script setup>
import {ref, defineExpose, defineEmits, defineProps, onMounted, onBeforeUnmount, provide, computed, inject} from 'vue'
import Tab from 'bootstrap/js/src/tab'
import {useBootstrapInstance} from '../../Composables/useBootstrapInstance'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const el = ref(null)

const {getInstance} = useBootstrapInstance(el, Tab)

const show = () => getInstance()?.show()

defineExpose({show})

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
  el.value.addEventListener('hide.bs.tab', emitHide)
  el.value.addEventListener('hidden.bs.tab', emitHidden)
  el.value.addEventListener('show.bs.tab', emitShow)
  el.value.addEventListener('shown.bs.tab', emitShown)
})

onBeforeUnmount(() => {
  el.value.removeEventListener('hide.bs.tab', emitHide)
  el.value.removeEventListener('hidden.bs.tab', emitHidden)
  el.value.removeEventListener('show.bs.tab', emitShow)
  el.value.removeEventListener('shown.bs.tab', emitShown)
})

const tabName = inject('tabName')
const tabBtnName = computed(() => {
  return (tabName || props.value.name) + '-btn';
})

const tabPaneName = computed(() => {
  return (tabName || props.value.name) + '-pane';
})

</script>
<template>
  <button
      :id="tabBtnName"
      data-bs-toggle="tab"
      :data-bs-target="'#' + tabPaneName"
      :aria-controls="'#' + tabPaneName"
      type="button"
      role="tab"
      ref="el">
  </button>
</template>