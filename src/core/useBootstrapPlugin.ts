import { getCurrentInstance, onBeforeUnmount, onMounted, shallowRef, watch, type Ref, type ShallowRef } from 'vue'
import { acquirePlugin, releasePlugin, trackInstance, untrackInstance, EVENT_NAMESPACE } from './loader'
import type { BootstrapInstance, BootstrapPluginName } from './types'

export interface UseBootstrapPluginOptions<I extends BootstrapInstance = BootstrapInstance> {
  /** Which Bootstrap plugin to load lazily. */
  plugin: BootstrapPluginName
  /** Element the plugin binds to. */
  el: Ref<HTMLElement | null | undefined>
  /** Plugin config. Undefined values are dropped; the instance is re-created when it changes. */
  config?: () => Record<string, unknown>
  /** Bootstrap events (without the `.bs.<plugin>` namespace) that are forwarded to `emit`. */
  events?: readonly string[]
  /** Element that Bootstrap dispatches the events on (defaults to `el`). */
  eventTarget?: () => HTMLElement | null | undefined
  /** Awaited after Bootstrap is loaded and right before the first instance is created (e.g. `nextTick` for DOM that child components add). */
  beforeCreate?: () => void | Promise<void>
  /** Called with `(eventName, bootstrapEvent)` for every forwarded event. */
  emit?: (event: string, payload: any) => void
  /** Called after the instance exists (also after it is re-created because the config changed). */
  onCreated?: (instance: I) => void
  /** Called right before the instance is disposed. */
  onBeforeDispose?: (instance: I) => void
  /** Hide the instance on Inertia.js GET visits (`inertia:start`). */
  closeOnInertiaVisit?: boolean
}

export interface UseBootstrapPluginReturn<I extends BootstrapInstance> {
  instance: ShallowRef<I | null>
  getInstance: () => I | null
  /** Resolves with the instance once Bootstrap has been loaded and the instance created. */
  whenReady: () => Promise<I>
  /** The loaded Bootstrap plugin class (null until loaded). */
  getConstructor: () => (new (element: Element, config?: Record<string, unknown>) => I) | null
  /** Dispose and create the instance again (e.g. after changing the markup it depends on). */
  recreate: () => Promise<void>
}

function cleanConfig(config: Record<string, unknown> | undefined) {
  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(config ?? {})) {
    if (value !== undefined) result[key] = value
  }
  return result
}

/**
 * Core composable used by every component that wraps a Bootstrap JavaScript plugin.
 * It loads Bootstrap on mount, creates the instance, forwards events and disposes
 * everything (instance, listeners, plugin reference) on unmount.
 */
export function useBootstrapPlugin<I extends BootstrapInstance = BootstrapInstance>(
  options: UseBootstrapPluginOptions<I>
): UseBootstrapPluginReturn<I> {
  const instance = shallowRef<I | null>(null) as ShallowRef<I | null>
  const namespace = EVENT_NAMESPACE[options.plugin]
  let ctor: (new (element: Element, config?: Record<string, unknown>) => I) | null = null
  let acquired = false
  let unmounted = false
  let boundTarget: HTMLElement | null = null
  let handlers: Array<[string, EventListener]> = []
  let readyResolvers: Array<(value: I) => void> = []

  const unbindEvents = () => {
    if (boundTarget) for (const [type, handler] of handlers) boundTarget.removeEventListener(type, handler)
    boundTarget = null
    handlers = []
  }

  const bindEvents = () => {
    unbindEvents()
    const target = options.eventTarget?.() ?? options.el.value
    if (!target || !options.events?.length || !options.emit) return
    boundTarget = target
    for (const name of options.events) {
      const handler: EventListener = event => options.emit!(name, event)
      const type = `${name}.bs.${namespace}`
      target.addEventListener(type, handler)
      handlers.push([type, handler])
    }
  }

  const disposeInstance = () => {
    const current = instance.value
    unbindEvents()
    if (!current) return
    try { options.onBeforeDispose?.(current) } catch { /* ignore */ }
    untrackInstance(options.plugin, current)
    try { current.dispose() } catch { /* already disposed by the loader */ }
    instance.value = null
  }

  const createInstance = () => {
    const el = options.el.value
    if (!ctor || !el || unmounted) return
    disposeInstance()
    const created = new ctor(el, cleanConfig(options.config?.()))
    trackInstance(options.plugin, created)
    instance.value = created
    bindEvents()
    options.onCreated?.(created)
    const resolvers = readyResolvers
    readyResolvers = []
    resolvers.forEach(resolve => resolve(created))
  }

  const onInertiaStart = (event: Event) => {
    const method = (event as CustomEvent).detail?.visit?.method ?? null
    const current = instance.value
    if ((!method || method === 'get') && current && typeof current.hide === 'function') current.hide()
  }

  onMounted(async () => {
    try {
      ctor = (await acquirePlugin(options.plugin)) as typeof ctor
      acquired = true
    } catch (error) {
      console.error(`[vue3-bootstrap-components] Failed to load Bootstrap plugin "${options.plugin}"`, error)
      return
    }
    if (unmounted) {
      releasePlugin(options.plugin)
      acquired = false
      return
    }
    try { await options.beforeCreate?.() } catch { /* ignore */ }
    if (unmounted) {
      releasePlugin(options.plugin)
      acquired = false
      return
    }
    createInstance()
    if (options.closeOnInertiaVisit) document.addEventListener('inertia:start', onInertiaStart)
  })

  if (options.config) {
    watch(options.config, () => { if (ctor && instance.value) createInstance() }, { deep: true })
  }

  onBeforeUnmount(() => {
    unmounted = true
    if (options.closeOnInertiaVisit && typeof document !== 'undefined') document.removeEventListener('inertia:start', onInertiaStart)
    disposeInstance()
    if (acquired) {
      releasePlugin(options.plugin)
      acquired = false
    }
    ctor = null
  })

  return {
    instance,
    getInstance: () => instance.value,
    whenReady: () => (instance.value ? Promise.resolve(instance.value) : new Promise<I>(resolve => readyResolvers.push(resolve))),
    getConstructor: () => ctor,
    recreate: async () => { if (ctor) createInstance() }
  }
}

/** Convenience: current component name for warnings. */
export function currentComponentName(): string {
  return getCurrentInstance()?.type?.name ?? 'component'
}
