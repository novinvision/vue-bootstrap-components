<script>
export default {
    props: {
        type: {
            type: String,
            default: 'border',
            required: false,
        },
        size: {
            type: String,
            default: 'sm',
            required: false,
        },
    }
}
</script>

<template>
    <i
        class="align-middle"
        :class="'spinner-' + this.type + ' spinner-' + this.type + '-'+this.size"
        role="status">
        <span class="visually-hidden">Loading...</span>
    </i>
</template>
