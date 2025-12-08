<template>
    <button type="button" data-bs-toggle="offcanvas" :data-bs-target="'#'+name">
        <slot/>
    </button>
</template>
<script>
export default {
    components: {},
    props: {
        name: {
            type: String,
            required: true,
        },
    },
};
</script>
