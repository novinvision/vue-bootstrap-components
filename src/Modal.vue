<template>
  <div
      :id="name"
      class="modal">
    <div class="modal-dialog modal-dialog-centered" :class="{'modal-fullscreen' : fullscreen}">
      <div class="modal-content">
        <slot/>
      </div>
    </div>
  </div>
</template>
<script>
import 'bootstrap/js/src/util/backdrop.js';
import Modal from 'bootstrap/js/src/modal.js';

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
    const modal = new Modal(document.getElementById(props.name))
    return {modal};
  },
  provide() {
    return {
      // modalName: computed(() => this.name)
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
