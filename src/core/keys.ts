import type { InjectionKey } from 'vue'

export interface CloseableApi {
  show: () => unknown
  hide: () => unknown
  toggle: () => unknown
}

export const DialogKey: InjectionKey<CloseableApi> = Symbol('bs-dialog')
export const DrawerKey: InjectionKey<CloseableApi> = Symbol('bs-drawer')
export const ToastKey: InjectionKey<CloseableApi> = Symbol('bs-toast')
export const AlertKey: InjectionKey<{ close: () => unknown }> = Symbol('bs-alert')
export const CollapseKey: InjectionKey<CloseableApi> = Symbol('bs-collapse')
export interface TabsContext {
  fade: boolean
  /** Render tabs as list-group items instead of nav links. */
  listGroup: boolean
  /** Name of the tab that is active on first render. */
  initialActive: () => string | null
  register: (name: string, show: () => unknown) => void
  unregister: (name: string) => void
}

export const TabsKey: InjectionKey<TabsContext> = Symbol('bs-tabs')

export interface CarouselContext {
  register: () => number
  unregister: () => void
}

export const CarouselKey: InjectionKey<CarouselContext> = Symbol('bs-carousel')

/** Element that tooltips/popovers/menus should append to when they live inside a Dialog or Drawer (top layer). */
export const OverlayContainerKey: InjectionKey<{ readonly value: HTMLElement | null }> = Symbol('bs-overlay-container')

/** Nearest dismissible parent (alert, toast, dialog or drawer). `CloseButton` closes it. */
export const DismissKey: InjectionKey<{ type: 'alert' | 'toast' | 'dialog' | 'drawer'; close: () => unknown }> = Symbol('bs-dismiss')
