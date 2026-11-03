import { createElementComponent } from '../../core/simple'

export { default as Drawer } from './Drawer.vue'
export { default as DrawerClose } from './DrawerClose.vue'
export { default as DrawerTrigger } from './DrawerTrigger.vue'
export { default as DrawerButton } from './DrawerButton.vue'
export const DrawerHeader = createElementComponent('DrawerHeader', 'drawer-header')
export const DrawerTitle = createElementComponent('DrawerTitle', 'drawer-title', 'h5')
export const DrawerBody = createElementComponent('DrawerBody', 'drawer-body')
export const DrawerFooter = createElementComponent('DrawerFooter', 'drawer-footer')
