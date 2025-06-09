<template>
    <button type="button" @click.prevent="useVfm().open(name)">
        <slot/>
    </button>
</template>
<script>
import {useVfm} from "vue-final-modal";

export default {
    components: {},
    props: {
        name: {
            type: String,
            required: true,
        },
    },
    methods: {useVfm}
};
</script>
