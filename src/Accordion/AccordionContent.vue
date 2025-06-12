<script>

export default {
    inject: ['itemID', 'accordionName', 'isActive'],
    computed: {
        showItem() {
            return this.isActive;
        },
    },
}
</script>

<template>
    <Transition name="accordion-content">
        <div :id="'collapse' + itemID" class="accordion-collapse collapse" :class="{'show': isActive}" v-if="isActive" :data-bs-parent="'#' + accordionName">
            <div class="accordion-body">
                <slot/>
            </div>
        </div>
    </Transition>
</template>
<style>
.accordion-content-enter-active,
.accordion-content-leave-active {
    /*transition: all ease 0.3s;*/
}

.accordion-content-enter-from,
.accordion-content-leave-to {
    /*opacity:0;*/
}
</style>
