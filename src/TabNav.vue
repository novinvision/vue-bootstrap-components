<script>
import "bootstrap/js/src/tab.js";

export default {
    props: {
        tag: {
            default: 'ul',
        },
    },
    data() {
        return {
        }
    }
}
</script>

<template>
    <ul class="" role="tablist">
        <slot />
    </ul>
</template>
