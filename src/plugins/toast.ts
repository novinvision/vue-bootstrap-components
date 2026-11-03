import type { App, Plugin } from 'vue'
import { useBsToast, setDefaultToastOptions, type BsToastInstance, type ToastOptions } from '../components/Toast/toastApi'

declare module 'vue' {
  interface ComponentCustomProperties {
    /** Toast API, available after `app.use(bsToast)`. */
    $bsToast: BsToastInstance
  }
}

/**
 * Toast plugin: `app.use(bsToast)` gives `this.$bsToast` (Options API), `inject('bsToast')`
 * and `useBsToast()` everywhere. The container is mounted lazily on the first toast.
 *
 * ```ts
 * app.use(bsToast, { placement: 'top-end', delay: 4000 })
 * this.$bsToast.success('Saved')
 * ```
 */
export const bsToast: Plugin<[ToastOptions?]> = {
  install(app: App, options?: ToastOptions) {
    if (options) setDefaultToastOptions(options)
    const api = useBsToast()
    app.config.globalProperties.$bsToast = api
    app.provide('bsToast', api)
  }
}

export default bsToast
