<script setup>
import { ref, defineExpose, defineProps } from 'vue'
import { useBootstrapInstance } from '../../Composables/useBootstrapInstance'

const props = defineProps({
})

const el = ref(null)

const { getInstance } = useBootstrapInstance(el, () => import('bootstrap/js/src/dropdown').then(m => m.default))

const show = () => getInstance()?.show()
const hide = () => getInstance()?.hide()

defineExpose({ show, hide })
</script>

<template>
    <button class="dropdown-toggle" type="button" ref="el" data-bs-toggle="dropdown" aria-expanded="false">
        <slot/>
    </button>
</template>