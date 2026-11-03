import type { App, Plugin } from 'vue'
import * as components from './components'
import { componentNames } from './component-names'
import type { ToastOptions } from './components/Toast/toastApi'
import type { DialogOptions } from './components/Dialog/dialogApi'
import { bsToast } from './plugins/toast'
import { bsDialog } from './plugins/dialog'

export interface Vue3BootstrapComponentsOptions {
  /** Prefix of the registered component names. Default `Bs` (`<Button>`). Use `''` for `<Button>`-style names. */
  prefix?: string
  /** Register only these components (by export name, e.g. `['Button', 'Dialog']`). Default: all. */
  only?: string[]
  /** Default options for the imperative toast API (`$bsToast`). */
  toast?: ToastOptions
  /** Default options for the promise-based dialog API (`$bsDialog`). */
  dialog?: DialogOptions
}

const plugin: Plugin<[Vue3BootstrapComponentsOptions?]> = {
  install(app: App, options: Vue3BootstrapComponentsOptions = {}) {
    const prefix = options.prefix ?? ''
    for (const name of componentNames) {
      if (options.only && !options.only.includes(name)) continue
      app.component(prefix + name, (components as Record<string, any>)[name])
    }
    app.use(bsToast, options.toast)
    app.use(bsDialog, options.dialog)
  }
}

export default plugin
export { plugin as Vue3BootstrapComponents }
