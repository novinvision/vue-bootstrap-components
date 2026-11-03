import { createElementComponent } from '../../core/simple'

export { default as Nav } from './Nav.vue'
export { default as NavLink } from './NavLink.vue'
export { default as NavOverflow } from './NavOverflow.vue'
export const NavItem = createElementComponent('NavItem', 'nav-item', 'li')
