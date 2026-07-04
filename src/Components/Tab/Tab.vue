<script setup>
import {ref, defineEmits, defineProps, provide} from 'vue'
import {useBootstrapInstance} from '../../Composables/useBootstrapInstance'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const el = ref(null)

const {getInstance} = useBootstrapInstance(el, () => import('bootstrap/js/src/tab').then(m => m.default))

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