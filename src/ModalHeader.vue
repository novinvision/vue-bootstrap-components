<template>
    <div class="modal-header">
        <div class="w-100">
            <div class="row align-items-center justify-content-between g-3">
                <div class="col-auto fw-bold">
                    <slot/>
                </div>
                <div class="col-auto">
                    <button @click.prevent="useVfm().close(modalName)" type="button" class="btn-close align-middle"></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {useVfm} from "vue-final-modal";

export default {
    inject: ['modalName'],
    methods: {useVfm}
};
</script>
