<script>
export default {
}
</script>

<template>
    <button class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        <slot/>
    </button>
</template>
<style>
.dropdown-toggle{
  cursor: pointer;
}
</style>
