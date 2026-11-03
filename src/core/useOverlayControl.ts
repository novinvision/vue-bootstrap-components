import { onBeforeUnmount, onMounted, watch } from 'vue'
import { registerOverlay, unregisterOverlay, setOverlayState, type OverlayApi } from './registry'
import type { UseBootstrapPluginReturn } from './useBootstrapPlugin'

export interface OverlayControlOptions {
  /** The `name` prop: registers the component for `useOverlay(name)` and trigger components. */
  name: () => string | undefined
  /** Current `v-model` value. */
  model: () => boolean
  /** Update `v-model`. */
  setModel: (value: boolean) => void
  plugin: UseBootstrapPluginReturn<any>
}

/**
 * Shared behavior of everything that opens and closes (dialog, drawer, collapse, toast,
 * tooltip, popover, menu, ...): programmatic API, `v-model` sync and name registry.
 */
export function useOverlayControl(options: OverlayControlOptions) {
  const { plugin } = options

  const api: OverlayApi = {
    show: () => plugin.whenReady().then(instance => instance.show()),
    hide: () => plugin.whenReady().then(instance => instance.hide()),
    toggle: () => plugin.whenReady().then(instance => instance.toggle())
  }

  let registeredName: string | undefined

  const register = () => {
    const name = options.name()
    if (registeredName && registeredName !== name) unregisterOverlay(registeredName, api)
    registeredName = name
    if (name) registerOverlay(name, api)
  }

  onMounted(register)
  watch(options.name, register)
  onBeforeUnmount(() => registeredName && unregisterOverlay(registeredName, api))

  watch(options.model, value => {
    const instance = plugin.getInstance()
    if (!instance) return
    if (value) instance.show()
    else instance.hide()
  })

  return {
    ...api,
    /** Apply the initial `v-model` value once the instance exists. */
    applyInitial: (instance: { [key: string]: any }) => { if (options.model()) instance.show() },
    /** Keep `v-model` in sync with Bootstrap's `shown`/`hidden` events. */
    sync: (event: string) => {
      if (event === 'shown') { setOverlayState(options.name(), true); options.setModel(true) }
      else if (event === 'hidden') { setOverlayState(options.name(), false); options.setModel(false) }
    }
  }
}
