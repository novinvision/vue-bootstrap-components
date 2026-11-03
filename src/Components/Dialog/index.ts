import { createElementComponent } from '../../core/simple'

export { default as Dialog } from './Dialog.vue'
export { default as DialogClose } from './DialogClose.vue'
export { default as DialogTrigger } from './DialogTrigger.vue'
export { default as DialogButton } from './DialogButton.vue'
export const DialogHeader = createElementComponent('DialogHeader', 'dialog-header')
export const DialogTitle = createElementComponent('DialogTitle', 'dialog-title', 'h1')
export const DialogBody = createElementComponent('DialogBody', 'dialog-body')
export const DialogFooter = createElementComponent('DialogFooter', 'dialog-footer')
