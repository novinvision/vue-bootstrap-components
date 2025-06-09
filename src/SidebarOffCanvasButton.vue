<template>
    <button @click.prevent="toggleOffCanvas" type="button" :aria-controls="name+'OffCanvas'">
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
    inject: ['appSetOverly'],
    methods: {
        toggleOffCanvas(){
            let canvasName = this.name+'OffCanvas';
            let offCanvas = document.getElementById(canvasName);
            offCanvas.classList.toggle('show')
            this.appSetOverly(offCanvas.classList.contains('show'));
        }
    },
    mounted() {
        if(document){
            document.getElementById('appOverly').addEventListener('click', this.toggleOffCanvas)
        }
    },
    beforeUnmount() {
        if(document){
            document.getElementById('appOverly').removeEventListener('click', this.toggleOffCanvas)
        }
    }
};
</script>
