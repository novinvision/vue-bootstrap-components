import { createApp, reactive, type App } from 'vue'
import type { ThemeColor } from '../../core/types'

export type ToastPlacement =
  | 'top-start' | 'top-center' | 'top-end'
  | 'middle-start' | 'middle-center' | 'middle-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end'

export interface ToastOptions {
  /** Fade animation. Default `true`. */
  animation?: boolean
  /** Hide automatically. Default `true`. */
  autohide?: boolean
  /** Auto-hide delay in ms. Default `5000`. */
  delay?: number
  /** Screen corner/edge. Default `bottom-end`. */
  placement?: ToastPlacement
  /** Max visible toasts per placement (default 3, `0`/`Infinity` for no limit). */
  maxVisible?: number
}

export interface ToastItem {
  id: number
  message: string
  theme: ThemeColor | null
  title: string | null
  meta: string | null
  placement: ToastPlacement
  options: { animation: boolean; autohide: boolean; delay: number }
}

const DEFAULT_PLACEMENT: ToastPlacement = 'bottom-end'

let defaultOptions: ToastOptions = {}
let idCounter = 0
const toasts = reactive<ToastItem[]>([])

export function setDefaultToastOptions(options: ToastOptions) {
  defaultOptions = { ...defaultOptions, ...options }
}

function resolveMaxVisible(value: number | undefined): number {
  if (value === undefined) return 3
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) return Infinity
  return value
}

export function removeToast(id: number) {
  const index = toasts.findIndex(toast => toast.id === id)
  if (index !== -1) toasts.splice(index, 1)
}

function pushToast(message: string, theme: ThemeColor | null, title: string | null, meta: string | null, toastOptions: ToastOptions): number {
  const merged = { ...defaultOptions, ...toastOptions }
  const placement = merged.placement ?? DEFAULT_PLACEMENT
  const id = ++idCounter
  toasts.push({
    id, message, theme, title, meta, placement,
    options: { animation: merged.animation ?? true, autohide: merged.autohide ?? true, delay: merged.delay ?? 5000 }
  })
  const maxVisible = resolveMaxVisible(merged.maxVisible)
  if (Number.isFinite(maxVisible)) {
    const group = toasts.filter(toast => toast.placement === placement)
    while (group.length > maxVisible) {
      const oldest = group.shift()
      if (oldest) removeToast(oldest.id)
    }
  }
  return id
}

/** @internal reactive list rendered by `ToastContainer`. */
export function useToastStore() {
  return { toasts, removeToast }
}

let containerApp: App | null = null

async function mountContainer() {
  if (typeof document === 'undefined' || containerApp) return
  if (document.getElementById('bs-toast-root')) return
  const { default: ToastContainer } = await import('./ToastContainer.vue')
  const root = document.createElement('div')
  root.id = 'bs-toast-root'
  document.body.appendChild(root)
  containerApp = createApp(ToastContainer)
  containerApp.mount(root)
}

function show(message: string, theme?: ThemeColor | string | null, title?: string | null, meta?: string | null, options: ToastOptions = {}): number {
  void mountContainer()
  return pushToast(message, (theme as ThemeColor) ?? null, title ?? null, meta ?? null, options)
}

type VariantMethod = (message: string, title?: string | null, meta?: string | null, options?: ToastOptions) => number

export interface BsToastInstance {
  (message: string, theme?: ThemeColor | string | null, title?: string | null, meta?: string | null, options?: ToastOptions): number
  show: typeof show
  primary: VariantMethod
  accent: VariantMethod
  secondary: VariantMethod
  success: VariantMethod
  danger: VariantMethod
  warning: VariantMethod
  info: VariantMethod
  inverse: VariantMethod
  /** Remove a toast by the id returned from `show`. */
  dismiss: (id: number) => void
  /** Remove every toast. */
  clear: () => void
}

const variants = ['primary', 'accent', 'secondary', 'success', 'danger', 'warning', 'info', 'inverse'] as const

const bsToast = show as BsToastInstance
bsToast.show = show
for (const variant of variants) {
  bsToast[variant] = (message, title, meta, options) => show(message, variant, title, meta, options)
}
bsToast.dismiss = removeToast
bsToast.clear = () => toasts.splice(0, toasts.length)

/** Imperative toast API: `const toast = useBsToast(); toast.success('Saved')`. */
export function useBsToast(): BsToastInstance {
  return bsToast
}

/** Unmounts the shared container (mostly useful in tests / micro-frontends). */
export function destroyToastContainer() {
  containerApp?.unmount()
  containerApp = null
  document.getElementById('bs-toast-root')?.remove()
  toasts.splice(0, toasts.length)
}
