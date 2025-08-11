<script>
export default {
  props: {
  }
}
</script>

<template>
  <div class="dropdown-menu">
    <slot/>
  </div>
</template>
<style>
.dropdown-menu:before {
  content: "";
  display: inline-block;
  position: absolute;
  height: 10px;
  width: 10px;
  top: -14px;
  left: 5%;
  border: 7px solid transparent;
  border-bottom-color: var(--bs-body-bg, #ffffff);
  z-index: 2;
}
</style>
