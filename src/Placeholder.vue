<script>
export default {
    props: {
        type: {
            type: String,
            default: 'glow',
        },
        holderClass: {
            type: String,
            default: '',
        }
    }
}
</script>

<template>
    <div :class="'placeholder-holder placeholder-' + type">
        <div class="placeholder h-100 w-100" :class="holderClass"></div>
    </div>
</template>
<style>
.placeholder-holder {
    overflow: hidden;
    min-height: 15px;
    min-width: 60px;
}
</style>
