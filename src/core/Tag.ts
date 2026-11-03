import { h, type FunctionalComponent } from 'vue'

/**
 * Renders a *native* element for a dynamic tag name.
 *
 * `<component :is="'button'">` would first look for a registered component called `Button`
 * (Vue resolves string `is` values against components) — which now exists. Going through
 * `h(tag)` always creates the HTML element. As a functional component, a template `ref`
 * on it resolves to the root DOM element.
 */
export const Tag: FunctionalComponent<{ as?: string }> = (props, { slots }) => h(props.as || 'div', null, slots.default?.())

Tag.props = { as: { type: String, default: 'div' } }
Tag.displayName = 'Tag'

export default Tag
