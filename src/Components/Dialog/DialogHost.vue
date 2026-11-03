<script setup lang="ts">
import { ref } from 'vue'
import Dialog from './Dialog.vue'
import Button from '../Button/Button.vue'
import CloseButton from '../CloseButton/CloseButton.vue'
import type { DialogButtonOptions, DialogCloseReason, DialogOptions, DialogResult } from './dialogTypes'

defineOptions({ name: 'DialogHost' })

const props = defineProps<{
  options: DialogOptions
  buttons: DialogButtonOptions[]
  onResolve: (result: DialogResult) => void
}>()

const open = ref(true)
let result: DialogResult | null = null
let reason = 'backdrop' as DialogCloseReason

function choose(button: DialogButtonOptions, index: number) {
  result = { confirmed: !!button.confirm, button: button.value ?? button.text, index, reason: 'button' }
  open.value = false
}

function onHidden() {
  props.onResolve(result ?? { confirmed: false, button: null, index: -1, reason })
}
</script>

<template>
  <Dialog
    v-model="open"
    :class="options.class"
    :dir="options.dir"
    :backdrop="options.backdrop ?? true"
    :keyboard="options.keyboard ?? true"
    :modal="options.modal ?? true"
    :size="options.size"
    :fullscreen-below="options.fullscreenBelow"
    :scrollable="options.scrollable ?? false"
    :animation="options.animation"
    :instant="options.instant ?? false"
    :close-on-inertia="false"
    @cancel="reason = 'escape'"
    @hidden="onHidden"
  >
    <div v-if="options.title || (options.showClose ?? true)" class="dialog-header">
      <h1 class="dialog-title">{{ options.title }}</h1>
      <CloseButton v-if="options.showClose ?? true" :label="options.closeLabel ?? 'Close'" @click="reason = 'close'" />
    </div>
    <div class="dialog-body">
      <div v-if="options.html" v-html="options.message" />
      <template v-else>{{ options.message }}</template>
    </div>
    <div v-if="buttons.length" class="dialog-footer">
      <Button
        v-for="(button, index) in buttons"
        :key="index"
        :variant="button.variant ?? 'solid'"
        :theme="button.theme ?? (button.confirm ? 'primary' : 'secondary')"
        :size="button.size"
        :class="button.class"
        :disabled="button.disabled"
        :autofocus="button.autofocus"
        @click="choose(button, index)"
      >
        {{ button.text }}
      </Button>
    </div>
  </Dialog>
</template>
