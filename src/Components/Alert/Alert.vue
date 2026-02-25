<script>
export default {
    props: {
        type: {
            type: String,
            default: 'warning',
        },
    }
}
</script>

<template>
    <div class="alert" :class="'alert-' + type">
        <slot/>
    </div>
</template>
