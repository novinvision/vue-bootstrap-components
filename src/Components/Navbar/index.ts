import { createElementComponent } from '../../core/simple'

export { default as Navbar } from './Navbar.vue'
export { default as NavbarToggler } from './NavbarToggler.vue'
export const NavbarBrand = createElementComponent('NavbarBrand', 'navbar-brand', 'a')
/** `<ul class="nav navbar-nav">` — put `NavItem`/`NavLink` inside. */
export const NavbarNav = createElementComponent('NavbarNav', ['nav', 'navbar-nav'], 'ul')
export const NavbarText = createElementComponent('NavbarText', 'navbar-text', 'span')
