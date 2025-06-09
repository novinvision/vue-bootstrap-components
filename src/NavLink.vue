<script>
export default {
    props: {
        active: {
            type: Boolean,
            required: true,
        },
        href: {
            type: String,
            required: true,
        },
    }
}
</script>

<template>
    <a class="nav-link" :class="{'active': active}" :aria-current="active" :href="href">
        <slot/>
    </a>
</template>
