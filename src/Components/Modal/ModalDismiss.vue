<template>
    <button type="button" data-bs-dismiss="modal" :data-bs-target="modal" class="btn-close align-middle">
      <slot />
    </button>
</template>
<script>
export default {
  inject: ['modal'],
};
</script>
