import { createElementComponent } from '../../core/simple'

export { default as FormField } from './FormField.vue'
export { default as Check } from './Check.vue'
export { default as Radio } from './Radio.vue'
export { default as Switch } from './Switch.vue'
export { default as FormControl } from './FormControl.vue'
export { default as FormRange } from './FormRange.vue'
export { default as InputGroup } from './InputGroup.vue'
export const InputGroupText = createElementComponent('InputGroupText', 'input-group-text', 'span')
export const InputGroupButton = createElementComponent('InputGroupButton', 'input-group-btn')
/** Decorates an input with an icon/text (`.form-adorn`). Put `FormAdornIcon`/`FormAdornText` next to the input. */
export const FormAdorn = createElementComponent('FormAdorn', 'form-adorn')
export const FormAdornIcon = createElementComponent('FormAdornIcon', 'form-adorn-icon', 'span')
export const FormAdornText = createElementComponent('FormAdornText', 'form-adorn-text', 'span')
