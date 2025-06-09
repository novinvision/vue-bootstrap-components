<template>
    <VueFinalModal
        :modal-id="name"
        overlay-transition="vfm-fade"
        content-transition="vfm-slide-right"
        content-class="offcanvas offcanvas-mobile-menu offcanvas-start show">
        <slot/>
    </VueFinalModal>
</template>
<script>
import Button from "./Button.vue";
import {VueFinalModal} from "vue-final-modal";

export default {
    components: {VueFinalModal, Button},
    props: {
        name: {
            type: String,
            required: true,
        },
    },
};
</script>
<style>
.vfm__content.offcanvas-button{
    width: 100%;
    right:0;
    left:0;
    margin:0 auto;
}
</style>
