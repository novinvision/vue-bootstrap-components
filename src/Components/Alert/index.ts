import { createElementComponent } from '../../core/simple'

export { default as Alert } from './Alert.vue'
export const AlertHeading = createElementComponent('AlertHeading', 'alert-heading', 'h4')
export const AlertLink = createElementComponent('AlertLink', 'alert-link', 'a')
