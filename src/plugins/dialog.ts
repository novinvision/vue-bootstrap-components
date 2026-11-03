import type { App, Plugin } from 'vue'
import { useBsDialog, setDefaultDialogOptions, type BsDialogInstance, type DialogOptions } from '../components/Dialog/dialogApi'

declare module 'vue' {
  interface ComponentCustomProperties {
    /** Promise-based dialog API, available after `app.use(bsDialog)`. */
    $bsDialog: BsDialogInstance
  }
}

/**
 * Dialog plugin: `app.use(bsDialog)` gives `this.$bsDialog` (Options API), `inject('bsDialog')`
 * and `useBsDialog()` everywhere. Every call resolves with `{ confirmed, button, index, reason }`.
 *
 * ```ts
 * app.use(bsDialog, { confirmText: 'Yes', cancelText: 'No' })
 * const { confirmed } = await this.$bsDialog.confirm('Delete this item?', 'Confirm')
 * ```
 */
export const bsDialog: Plugin<[DialogOptions?]> = {
  install(app: App, options?: DialogOptions) {
    if (options) setDefaultDialogOptions(options)
    const api = useBsDialog()
    app.config.globalProperties.$bsDialog = api
    app.provide('bsDialog', api)
  }
}

export default bsDialog
