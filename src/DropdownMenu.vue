<script>
export default {
    props: {
        tag: {
            default: 'ul',
        },
        show: {
            type: Boolean,
            default: false,
            required: false,
        }
    }
}
</script>

<template>
        <div v-if="tag === 'div'" class="dropdown-menu">
            <slot/>
        </div>
        <ul v-else class="dropdown-menu">
            <slot/>
        </ul>
</template>
<style>
.dropdown-menu:before {
    content: "";
    display: inline-block;
    position: absolute;
    height: 10px;
    width: 10px;
    top: -14px;
    left: 5%;
    border: 7px solid transparent;
    border-bottom-color: var(--bs-body-bg, #ffffff);
    z-index: 2;
}
</style>
