/** Bootstrap 6 JavaScript plugins that this package can load lazily. */
export type BootstrapPluginName =
  | 'alert' | 'carousel' | 'chips' | 'collapse' | 'combobox' | 'datepicker'
  | 'dialog' | 'drawer' | 'menu' | 'nav-overflow' | 'otp-input' | 'popover'
  | 'range' | 'scrollspy' | 'strength' | 'tab' | 'toast' | 'toggler' | 'tooltip'

/** Built-in Bootstrap 6 theme keys (`.theme-*`). */
export type ThemeColor = 'primary' | 'accent' | 'success' | 'danger' | 'warning' | 'info' | 'inverse' | 'secondary'

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type FloatingPlacement =
  | 'top' | 'top-start' | 'top-end'
  | 'bottom' | 'bottom-start' | 'bottom-end'
  | 'left' | 'left-start' | 'left-end'
  | 'right' | 'right-start' | 'right-end'
  | 'auto'

/**
 * Event object forwarded from Bootstrap. It is a regular DOM `Event`
 * (type is e.g. `show.bs.dialog`) widened with the payload Bootstrap attaches
 * (`relatedTarget`, `value`, `values`, ...). Call `event.preventDefault()` on
 * cancelable events (`show`, `hide`, `slide`, `add`, `remove`, ...) to cancel the action.
 */
export type BsEvent<Payload extends object = Record<string, unknown>> = Event & Payload

/** Minimal shape shared by all Bootstrap plugin instances. */
export interface BootstrapInstance {
  dispose(): void
  [key: string]: any
}
