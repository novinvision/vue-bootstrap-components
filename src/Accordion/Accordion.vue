<script>
import {computed} from 'vue'

export default {
    props: {
        name: {
            type: String,
            default: 'accordion',
            required: true,
        },
        default: {
            type: String,
            default: null,
            required: false,
        },
    },
    computed: {
        selectedItem() {
            return this.currentItem ? this.currentItem : (this.name + this.default);
        }
    },
    provide() {
        return {
            accordionName: this.name,
            current: computed(() => this.selectedItem)
        }
    },
    methods: {
        setCurrentItem(event) {
            if (event.target.tagName.toLowerCase() === 'button' && this.currentItem !== event.target.getAttribute('data-item-id')) {
                this.currentItem = event.target.getAttribute('data-item-id');
            } else {
                this.currentItem = null;
            }
        }
    },
    mounted() {
        let _this = this;
        this.$el.querySelectorAll('.accordion-item .accordion-header').forEach(item => {
            item.addEventListener('click', _this.setCurrentItem)
        })
    },
    beforeUnmount() {
        let _this = this;
        this.$el.querySelectorAll('.accordion-item  .accordion-header').forEach(item => {
            item.removeEventListener('click', _this.setCurrentItem)
        })
    },
    data() {
        return {
            currentItem: null,
        };
    }
}
</script>

<template>
    <div :id="name" class="accordion">
        <slot ref="slots"/>
    </div>
</template>
