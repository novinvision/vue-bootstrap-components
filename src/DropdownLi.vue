<script>

export default {
    methods:{
        clickOutside(e){
            if (!this.$el.contains(e.target) || e.target.classList.contains('dropdown-item')) {
                this.show = false;
            }
        },
        toggle(){
            this.show = !this.show;
        }
    },
    expose: ['toggle'],
    provide() {
        return {
            // dropdown: computed(() => this),
        }
    },
    mounted() {
        // document.addEventListener('click', this.clickOutside);
    },
    beforeUnmount() {
        // document.removeEventListener('click', this.clickOutside);
    },
    data() {
        return {
            show: false,
        }
    }
}
</script>

<template>
    <div class="dropdown">
        <slot :show="show"/>
    </div>
</template>
