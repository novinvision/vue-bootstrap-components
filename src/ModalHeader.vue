<template>
    <div class="modal-header">
        <div class="w-100">
            <div class="row align-items-center justify-content-between g-3">
                <div class="col-auto fw-bold">
                    <slot/>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn-close align-middle"></button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    inject: ['modalName'],
};
</script>
