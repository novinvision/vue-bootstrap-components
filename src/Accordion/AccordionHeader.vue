<script>
import {inject} from "vue";

export default {
    inject: ['isActive', 'itemID'],
}
</script>

<template>
    <div class="accordion-header" :data-item-id="itemID">
        <button class="accordion-button rounded"
                :class="{'collapsed': !isActive}"
                type="button"
                :data-item-id="itemID"
                :data-bs-target="'#collapse' + itemID"
                :aria-expanded="isActive"
                :aria-controls="'collapse' + itemID"
                data-bs-toggle="collapse">
            <slot/>
        </button>
    </div>
</template>
