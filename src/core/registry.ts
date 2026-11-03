import { reactive } from 'vue'

export interface OverlayApi {
  show: () => unknown
  hide: () => unknown
  toggle: () => unknown
}

const overlays = reactive(new Map<string, OverlayApi>())
const openState = reactive<Record<string, boolean>>({})

/** @internal */
export function setOverlayState(id: string | undefined, open: boolean) {
  if (id) openState[id] = open
}

/** @internal */
export function registerOverlay(id: string, api: OverlayApi) {
  overlays.set(id, api)
}

/** @internal */
export function unregisterOverlay(id: string, api?: OverlayApi) {
  if (!api || overlays.get(id) === api) overlays.delete(id)
}

/**
 * Control any mounted Dialog, Drawer, Collapse, Toast, Popover ... by its `name`
 * from anywhere in the app (no template ref needed).
 *
 * ```ts
 * const dialog = useOverlay('confirm-delete')
 * dialog.show()
 * ```
 */
export function useOverlay(name: string): OverlayApi & { readonly isOpen: boolean } {
  const call = (method: keyof OverlayApi) => () => overlays.get(name)?.[method]()
  return {
    show: call('show'),
    hide: call('hide'),
    toggle: call('toggle'),
    get isOpen() { return openState[name] === true }
  }
}
