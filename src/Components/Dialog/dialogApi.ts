import { createApp } from 'vue'
import type { DialogButtonOptions, DialogOptions, DialogResult } from './dialogTypes'

export type { DialogButtonOptions, DialogOptions, DialogResult, DialogCloseReason } from './dialogTypes'

let defaults: DialogOptions = {}

export function setDefaultDialogOptions(options: DialogOptions) {
  defaults = { ...defaults, ...options }
}

const open = new Set<() => void>()

function buildButtons(options: DialogOptions): DialogButtonOptions[] {
  if (options.buttons?.length) return options.buttons
  const buttons: DialogButtonOptions[] = []
  if (options.showCancel ?? true) {
    buttons.push({ text: options.cancelText ?? 'Cancel', value: 'cancel', confirm: false, theme: options.cancelTheme ?? 'secondary', variant: options.cancelVariant ?? 'subtle' })
  }
  buttons.push({ text: options.confirmText ?? 'OK', value: 'confirm', confirm: true, theme: options.confirmTheme ?? 'primary', variant: options.confirmVariant ?? 'solid', autofocus: true })
  return buttons
}

/** Opens a dialog and resolves when it is closed. Never rejects. */
function show(input: string | DialogOptions, extra: DialogOptions = {}): Promise<DialogResult> {
  const options: DialogOptions = { ...defaults, ...(typeof input === 'string' ? { message: input } : input), ...extra }
  const dismissed: DialogResult = { confirmed: false, button: null, index: -1, reason: 'close' }
  if (typeof document === 'undefined') return Promise.resolve(dismissed)

  return new Promise<DialogResult>(resolve => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    let app: ReturnType<typeof createApp> | null = null

    const finish = (result: DialogResult) => {
      open.delete(close)
      resolve(result)
      // let the closing transition/cleanup of Bootstrap finish before the host is removed
      setTimeout(() => { app?.unmount(); host.remove(); app = null }, 0)
    }
    const close = () => finish(dismissed)
    open.add(close)

    import('./DialogHost.vue').then(({ default: DialogHost }) => {
      app = createApp(DialogHost, { options, buttons: buildButtons(options), onResolve: finish })
      app.mount(host)
    }).catch(() => finish(dismissed))
  })
}

type Shortcut = (message: string, title?: string, options?: DialogOptions) => Promise<DialogResult>

export interface BsDialogInstance {
  (options: string | DialogOptions, extra?: DialogOptions): Promise<DialogResult>
  show: typeof show
  /** Confirmation dialog with cancel + confirm buttons. */
  confirm: Shortcut
  /** Message dialog with a single OK button. */
  alert: Shortcut
  /** Immediately closes every dialog opened through this API (their promises resolve as dismissed). */
  closeAll: () => void
}

const bsDialog = show as BsDialogInstance
bsDialog.show = show
bsDialog.confirm = (message, title, options = {}) => show({ message, title, showCancel: true, ...options })
bsDialog.alert = (message, title, options = {}) => show({ message, title, showCancel: false, ...options })
bsDialog.closeAll = () => { for (const close of [...open]) close() }

/** Promise-based dialog API: `const dialog = useBsDialog(); const { confirmed } = await dialog.confirm('Delete?')`. */
export function useBsDialog(): BsDialogInstance {
  return bsDialog
}
