import { defineComponent, h, type PropType } from 'vue'

/**
 * Creates a tiny presentational component that renders `<tag class="base">` with its default slot.
 * Used for the many structural Bootstrap parts (card-body, dialog-footer, ...).
 */
export function createElementComponent(name: string, baseClass: string | string[], defaultTag = 'div') {
  return defineComponent({
    name,
    props: {
      /** HTML tag to render. */
      as: { type: String as PropType<string>, default: defaultTag }
    },
    setup(props, { slots }) {
      return () => h(props.as, { class: baseClass }, slots.default?.())
    }
  })
}
