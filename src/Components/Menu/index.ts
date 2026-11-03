import { createElementComponent } from '../../core/simple'

export { default as Menu } from './Menu.vue'
export { default as MenuToggle } from './MenuToggle.vue'
export { default as MenuContent } from './MenuContent.vue'
export { default as MenuItem } from './MenuItem.vue'
export const MenuHeader = createElementComponent('MenuHeader', 'menu-header')
export const MenuText = createElementComponent('MenuText', 'menu-text', 'span')
export const MenuDivider = createElementComponent('MenuDivider', 'menu-divider', 'hr')
/** Wrapper for a nested menu: put a `MenuItem` (trigger) and a `MenuContent` inside. */
export const Submenu = createElementComponent('Submenu', 'submenu')
