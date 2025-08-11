<script>
import 'bootstrap/js/src/util/index.js';
import 'bootstrap/js/src/dropdown.js';

export default {
    data() {
        return {
        }
    }
}
</script>

<template>
    <div class="dropdown">
        <slot/>
    </div>
</template>
<style>
.dropdown.dropdown-lg .dropdown-item {
    --bs-dropdown-item-padding-y: 0.6rem;
}
</style>
