<template>
  <div class="modal-header">
    <slot/>
    <button type="button" data-bs-dismiss="modal" :data-bs-target="modal" class="btn-close align-middle"></button>
  </div>
</template>
<script>
export default {
  inject: ['modal'],
};
</script>
