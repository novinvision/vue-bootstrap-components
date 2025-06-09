<script>
import 'bootstrap/js/src/util/index.js';
import 'bootstrap/js/src/dropdown.js';
import {computed} from "vue";

export default {
    props: {
        tag: {
            default: 'div',
        },
    },
    provide() {
        return {
            dropdown: computed(() => this),
        }
    },
    methods: {
    },
    expose: ['toggle'],
    data() {
        return {
            show: false,
        }
    }
}
</script>

<template>
    <li v-if="tag === 'li'" class="dropdown">
        <slot/>
    </li>
    <div v-else class="dropdown">
        <slot/>
    </div>
</template>
<style>
.dropdown.dropdown-lg .dropdown-item {
    --bs-dropdown-item-padding-y: 0.6rem;
}
</style>
