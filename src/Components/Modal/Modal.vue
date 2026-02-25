<script setup>
import {ref, defineExpose, defineProps, defineEmits, onMounted, onBeforeUnmount, provide} from 'vue'
import Modal from 'bootstrap/js/dist/modal'
import {useBootstrapInstance} from '../../Composables/useBootstrapInstance'

const props = defineProps({
  name: {
    type: String,
    default: 'modalExample',
  }
})

const emit = defineEmits([
    'opened',
    'closed',
])

const el = ref(null)

const {getInstance} = useBootstrapInstance(el, Modal)

const show = () => getInstance()?.show()
const hide = () => getInstance()?.hide()

const emitOpened = (event) => emit('opened', event)
const emitClosed = (event) => emit('closed', event)

defineExpose({show, hide})

onMounted(() => {
  el.value.addEventListener('hidden.bs.modal', emitClosed)
  el.value.addEventListener('shown.bs.modal', emitOpened)
})

onBeforeUnmount(() => {
  el.value.removeEventListener('hidden.bs.modal', emitClosed)
  el.value.removeEventListener('shown.bs.modal', emitOpened)
})

provide({
  'modal': props.name,
})

</script>
<template>
  <div :id="name" ref="modal" class="modal">
    <slot/>
  </div>
</template>