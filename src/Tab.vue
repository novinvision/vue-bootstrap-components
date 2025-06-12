<script>
import "bootstrap/js/src/tab.js";

export default {
    props: {
        tag: {
            default: 'div',
        },
    },
    provide() {
        return {
            // dropdown: computed(() => this),
        }
    },
    methods: {
        clickOutside(e) {
            if (!this.$el.contains(e.target) || e.target?.classList?.contains('dropdown-item')) {
                this.show = false;
            }
        },
        toggle() {
            this.show = !this.show;
        },
    },
    expose: ['toggle'],
    mounted() {
    },
    beforeUnmount() {
    },
    data() {
        return {
        }
    }
}
</script>

<template>
    <div class="tab-wrapper">
        <slot :show="show"/>
    </div>
</template>
