<template>
  <div
      :id="name"
      ref="modal"
      class="modal">
    <div class="modal-dialog modal-dialog-centered" :class="{'modal-fullscreen' : fullscreen}">
      <div class="modal-content">
        <slot/>
      </div>
    </div>
  </div>
</template>
<script>
import 'bootstrap/js/src/modal.js'
import {computed} from "vue";

export default {
  emits: ['opened', 'closed'],
  props: {
    name: {
      type: String,
      required: true,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
  setup(props){
    const modal = new bootstrap.Modal(this.$refs.modal)
    console.log(modal);
    return {modal};
  },
  provide() {
    return {
      modalName: computed(() => this.name)
    }
  },
  expose: ['close'],
  beforeUnmount() {
    this.modal.hide();
  },
  methods: {
    close() {
      this.modal.hide();
    }
  },
  data(){
    return {
    }
  }
};
</script>
