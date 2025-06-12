<script>

export default {
    props: {
        id: {
            type: String,
            default: 0,
            required: true,
        },
    },
    inject: ['current'],
    computed: {
        hasActiveItem() {
            return this.current === this.itemID;
        },
        accordionName() {
            // return inject('accordionName');
        },
        itemID() {
            return this.accordionName + this.id;
        },
    },
    provide() {
        return {
            itemID: this.itemID,
            // isActive: computed(() => this.hasActiveItem)
        }
    },
}
</script>

<template>
    <div class="accordion-item" :data-item-id="itemID">
        <slot/>
    </div>
</template>
