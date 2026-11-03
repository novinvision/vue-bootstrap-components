import { createElementComponent } from '../../core/simple'

export { default as Card } from './Card.vue'
export { default as CardBody } from './CardBody.vue'
export { default as CardImg } from './CardImg.vue'
export const CardHeader = createElementComponent('CardHeader', 'card-header')
export const CardFooter = createElementComponent('CardFooter', 'card-footer')
export const CardTitle = createElementComponent('CardTitle', 'card-title', 'h5')
export const CardSubtitle = createElementComponent('CardSubtitle', 'card-subtitle', 'h6')
export const CardText = createElementComponent('CardText', 'card-text', 'p')
export const CardImgOverlay = createElementComponent('CardImgOverlay', 'card-img-overlay')
/** Card group. Add `contains-inline` to a parent for the container query to apply. */
export const CardGroup = createElementComponent('CardGroup', 'card-group')
