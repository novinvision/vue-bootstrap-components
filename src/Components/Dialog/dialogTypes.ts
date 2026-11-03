import type { Breakpoint, Size, ThemeColor } from '../../core/types'

export interface DialogButtonOptions {
  /** Button label. */
  text: string
  /** Value returned in `result.button` when this button is clicked. Defaults to `text`. */
  value?: string | number | boolean
  /** Counts as "confirmed": `result.confirmed` is `true` when this button is clicked. */
  confirm?: boolean
  /** Button color (`.theme-*`). */
  theme?: ThemeColor
  /** Button style. */
  variant?: 'solid' | 'outline' | 'subtle' | 'text' | 'styled' | 'link'
  /** `xs`, `sm` or `lg`. */
  size?: Exclude<Size, 'md' | 'xl'>
  /** Extra CSS classes. */
  class?: string
  disabled?: boolean
  /** Focus this button when the dialog opens. */
  autofocus?: boolean
}

export interface DialogOptions {
  /** Header title. No header is rendered without `title` (unless `showClose`). */
  title?: string
  /** Body text. */
  message?: string
  /** Render `message` as HTML. Only use trusted/sanitized content. */
  html?: boolean
  /** Replace the default buttons. When empty/omitted: a cancel (optional) and a confirm button. */
  buttons?: DialogButtonOptions[]
  confirmText?: string
  cancelText?: string
  confirmTheme?: ThemeColor
  cancelTheme?: ThemeColor
  confirmVariant?: DialogButtonOptions['variant']
  cancelVariant?: DialogButtonOptions['variant']
  /** Show the cancel button. Default `true` (`false` for `alert()`). */
  showCancel?: boolean
  /** Show the close (×) button in the header. Default `true`. */
  showClose?: boolean
  closeLabel?: string
  /** Bootstrap option `backdrop`: `true`, `false` or `'static'` (cannot be dismissed by clicking outside). */
  backdrop?: boolean | 'static'
  /** Bootstrap option `keyboard`: close with Escape. */
  keyboard?: boolean
  /** Bootstrap option `modal`. */
  modal?: boolean
  /** `sm`, `lg`, `xl` or `fullscreen`. */
  size?: 'sm' | 'lg' | 'xl' | 'fullscreen'
  /** Fullscreen below a breakpoint. */
  fullscreenBelow?: Exclude<Breakpoint, '2xl' | 'xl'>
  scrollable?: boolean
  /** `slide-up` or `slide-down`. */
  animation?: 'slide-up' | 'slide-down'
  /** Disable animations. */
  instant?: boolean
  /** Text direction of the dialog, e.g. `rtl`. */
  dir?: 'rtl' | 'ltr'
  /** Extra CSS classes on the `<dialog>`. */
  class?: string
}

export type DialogCloseReason = 'button' | 'close' | 'escape' | 'backdrop'

export interface DialogResult {
  /** `true` only when a confirm button was clicked. */
  confirmed: boolean
  /** Value of the clicked button, `null` when the dialog was dismissed. */
  button: string | number | boolean | null
  /** Index of the clicked button, `-1` when dismissed. */
  index: number
  /** How it was closed: a `button`, the header `close` ×, `escape`, or a `backdrop` click. */
  reason: DialogCloseReason
}
