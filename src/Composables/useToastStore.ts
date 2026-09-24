import { reactive } from 'vue'

export type ToastPlacement =
    | 'top-start' | 'top-center' | 'top-end'
    | 'middle-start' | 'middle-center' | 'middle-end'
    | 'bottom-start' | 'bottom-center' | 'bottom-end'

export interface ToastOptions {
    animation?: boolean
    autohide?: boolean
    delay?: number
    placement?: ToastPlacement
    maxVisible?: number
}

export interface ToastItem {
    id: number
    message: string
    type: string
    title: string | null
    meta: string | null
    placement: ToastPlacement
    toastOptions: Required<Omit<ToastOptions, 'placement' | 'maxVisible'>>
}

const DEFAULT_PLACEMENT: ToastPlacement = 'bottom-end'

let defaultOptions: ToastOptions = {}

function setDefaultToastOptions(options: ToastOptions) {
    defaultOptions = { ...defaultOptions, ...options }
}

function resolveMaxVisible(value: number | undefined): number {
    if (value === undefined) return 3
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 1) return Infinity
    return value
}

const toasts = reactive<ToastItem[]>([])
let idCounter = 0

function pushToast(
    message: string,
    type = 'primary',
    title: string | null = null,
    meta: string | null = null,
    toastOptions: ToastOptions = {}
) {
    const merged = { ...defaultOptions, ...toastOptions }
    const placement = merged.placement ?? DEFAULT_PLACEMENT
    const maxVisible = resolveMaxVisible(merged.maxVisible)

    const id = ++idCounter
    toasts.push({
        id,
        message,
        type,
        title,
        meta,
        placement,
        toastOptions: {
            animation: merged.animation ?? true,
            autohide: merged.autohide ?? true,
            delay: merged.delay ?? 5000,
        },
    })

    enforceMaxVisible(placement, maxVisible)

    return id
}

function enforceMaxVisible(placement: ToastPlacement, maxVisible: number) {
    if (!Number.isFinite(maxVisible)) return

    const sameGroup = toasts.filter(t => t.placement === placement)
    while (sameGroup.length > maxVisible) {
        const oldest = sameGroup.shift()
        if (!oldest) break
        removeToast(oldest.id)
    }
}

function removeToast(id: number) {
    const index = toasts.findIndex(t => t.id === id)
    if (index !== -1) toasts.splice(index, 1)
}

export function useToastStore() {
    return { toasts, pushToast, removeToast, setDefaultToastOptions }
}