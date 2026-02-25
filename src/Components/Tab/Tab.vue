<script setup>
import {ref, defineEmits, defineProps, provide} from 'vue'
import Tab from 'bootstrap/js/src/tab'
import {useBootstrapInstance} from '../../Composables/useBootstrapInstance'

const props = defineProps({
  name: {
    type: String,
    default: 'tabExample'
  }
})

const el = ref(null)

const {getInstance} = useBootstrapInstance(el, Tab)

const emit = defineEmits([
  'hide',
  'hidden',
  'show',
  'shown',
])


provide({
  'tabName': props.value.name,
})

</script>
<template>
  <div :id="name" class="bs-tab-area">
    <slot/>
  </div>
</template>