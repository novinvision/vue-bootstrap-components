import {createApp, App} from 'vue'
import ToastContainer from './Components/Toast/ToastContainer.vue'
import {useToastStore, ToastOptions} from './Composables/useToastStore'

export type { ToastOptions }

let containerMounted = false

function mountToastContainer() {
    if (typeof document === 'undefined' || containerMounted) return

    if (document.getElementById('bs-toast-root')) {
        containerMounted = true
        return
    }

    const rootEl = document.createElement('div')
    rootEl.id = 'bs-toast-root'
    document.body.appendChild(rootEl)

    createApp(ToastContainer).mount(rootEl)
    containerMounted = true
}

function show(
    message: string,
    type?: string,
    title?: string,
    meta?: string,
    toastOptions?: ToastOptions
) {
    mountToastContainer()
    return useToastStore().pushToast(message, type, title, meta, toastOptions)
}

const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light'] as const
type ToastVariant = typeof variants[number]

type VariantMethod = (
    message: string,
    title?: string,
    meta?: string,
    toastOptions?: ToastOptions
) => number

export interface BsToastInstance {
    (message: string, type?: string, title?: string, meta?: string, toastOptions?: ToastOptions): number
    show: typeof show
    primary: VariantMethod
    secondary: VariantMethod
    success: VariantMethod
    danger: VariantMethod
    warning: VariantMethod
    info: VariantMethod
    dark: VariantMethod
    light: VariantMethod
}

const bsToast = show as BsToastInstance
bsToast.show = show

variants.forEach((variant: ToastVariant) => {
    bsToast[variant] = (message, title, meta, toastOptions) =>
        show(message, variant, title, meta, toastOptions)
})

export function useBsToast(): BsToastInstance {
    return bsToast
}

export default {
    install(app: App, options: ToastOptions = {}) {
        useToastStore().setDefaultToastOptions(options)
        app.config.globalProperties.$bsToast = bsToast
    }
}