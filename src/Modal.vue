<template>
  <div
      :id="name"
      ref="modal"
      class="modal" :class="{[effect]: true}">
    <div class="modal-dialog modal-dialog-centered" :class="{'modal-fullscreen' : fullscreen, [dialogClass]: true}">
      <div class="modal-content">
        <slot :modal="modal"/>
      </div>
    </div>
  </div>
</template>
<script>
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
    dialogClass: {
      type: String,
      default: false,
    },
    effect: {
      type: String,
      default: 'fade',
    },
  },
  provide() {
    return {
      // modalName: computed(() => this.name)
    }
  },
  expose: ['close'],
  async mounted() {
    if (window && !window.bsModalLoaded) {
      await import("bootstrap/js/src/modal.js");
      window.bsModalLoaded = true;
    }

    let _this = this;
    this.modal = new Modal(document.getElementById(this.name),{
      backdrop: true,
    })

    this.$refs.modal.addEventListener('hidden.bs.modal', event => {
      _this.$emit('closed', event);
    })

    this.$refs.modal.addEventListener('shown.bs.modal', event => {
      _this.$emit('opened', event);
    })

  },
  beforeUnmount() {
    this.modal?.hide();
  },
  methods: {
    close() {
      this.modal?.hide();
    }
  },
  data(){
    return {
      modal: null,
    }
  }
};
</script>
