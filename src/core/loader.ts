import type { BootstrapInstance, BootstrapPluginName } from './types'

/**
 * Lazy, reference-counted loader for Bootstrap's JavaScript plugins.
 *
 *  - Nothing from Bootstrap is imported until a component that needs it is mounted
 *    (so nothing runs on the server and nothing is downloaded by pages that never render a component).
 *  - Every mounted component holds a reference. When the last component of a plugin is
 *    unmounted, all remaining instances are disposed and every document/window listener
 *    that Bootstrap registered for that plugin is removed ("unloaded").
 *
 * ES modules cannot be evicted from the browser's module map, so the module *code* stays cached;
 * what is released is everything that is alive: instances, DOM listeners and our references.
 */

type PluginCtor = new (element: Element, config?: Record<string, unknown>) => BootstrapInstance

const importers: Record<BootstrapPluginName, () => Promise<{ default: unknown }>> = {
  alert: () => import('bootstrap/js/dist/alert.js'),
  carousel: () => import('bootstrap/js/dist/carousel.js'),
  chips: () => import('bootstrap/js/dist/chips.js'),
  collapse: () => import('bootstrap/js/dist/collapse.js'),
  combobox: () => import('bootstrap/js/dist/combobox.js'),
  datepicker: () => import('bootstrap/js/dist/datepicker.js'),
  dialog: () => import('bootstrap/js/dist/dialog.js'),
  drawer: () => import('bootstrap/js/dist/drawer.js'),
  menu: () => import('bootstrap/js/dist/menu.js'),
  'nav-overflow': () => import('bootstrap/js/dist/nav-overflow.js'),
  'otp-input': () => import('bootstrap/js/dist/otp-input.js'),
  popover: () => import('bootstrap/js/dist/popover.js'),
  range: () => import('bootstrap/js/dist/range.js'),
  scrollspy: () => import('bootstrap/js/dist/scrollspy.js'),
  strength: () => import('bootstrap/js/dist/strength.js'),
  tab: () => import('bootstrap/js/dist/tab.js'),
  toast: () => import('bootstrap/js/dist/toast.js'),
  toggler: () => import('bootstrap/js/dist/toggler.js'),
  tooltip: () => import('bootstrap/js/dist/tooltip.js')
}

/** Event namespace Bootstrap uses for each plugin (`<event>.bs.<namespace>`). */
export const EVENT_NAMESPACE: Record<BootstrapPluginName, string> = {
  alert: 'alert', carousel: 'carousel', chips: 'chips', collapse: 'collapse', combobox: 'combobox',
  datepicker: 'datepicker', dialog: 'dialog', drawer: 'drawer', menu: 'menu', 'nav-overflow': 'navoverflow',
  'otp-input': 'otpInput', popover: 'popover', range: 'range', scrollspy: 'scrollspy', strength: 'strength',
  tab: 'tab', toast: 'toast', toggler: 'toggler', tooltip: 'tooltip'
}

/** Plugins that build on other plugins internally and need their global listeners too. */
const dependencies: Partial<Record<BootstrapPluginName, BootstrapPluginName[]>> = {
  combobox: ['menu'],
  'nav-overflow': ['menu']
}

interface Entry {
  count: number
  ctor: PluginCtor | null
  promise: Promise<PluginCtor> | null
  instances: Set<BootstrapInstance>
}

const entries = new Map<BootstrapPluginName, Entry>()

function getEntry(name: BootstrapPluginName): Entry {
  let entry = entries.get(name)
  if (!entry) {
    entry = { count: 0, ctor: null, promise: null, instances: new Set() }
    entries.set(name, entry)
  }
  return entry
}

let eventHandler: any = null
let eventHandlerPromise: Promise<any> | null = null
function loadEventHandler(): Promise<any> {
  eventHandlerPromise ??= import('bootstrap/js/dist/dom/event-handler.js').then(m => (eventHandler = m.default))
  return eventHandlerPromise
}

/**
 * Removes the listeners Bootstrap registers on `document`/`window` for a plugin
 * (the "data API": `data-bs-toggle`, `data-bs-dismiss`, DOMContentLoaded auto-init ...).
 * This package drives every instance from Vue, so Bootstrap's data API must not run as well.
 */
function stripGlobalListenersSync(name: BootstrapPluginName) {
  if (typeof document === 'undefined' || !eventHandler) return
  const namespace = `.bs.${EVENT_NAMESPACE[name]}`
  eventHandler.off(document, namespace)
  eventHandler.off(window, namespace)
}

/**
 * Menu closes itself on outside click / Tab through `Menu.clearMenus` and supports keyboard
 * navigation through `Menu.dataApiKeydownHandler`; both are only wired up by Bootstrap's data API.
 * We re-attach exactly those (and not the click-toggle handler) while the plugin is loaded.
 */
function attachMenuGlobals(Menu: any) {
  const EventHandler = eventHandler
  EventHandler.on(document, 'keydown.bs.menu.data-api', '[data-bs-toggle="menu"]:not(.disabled):not(:disabled)', Menu.dataApiKeydownHandler)
  EventHandler.on(document, 'keydown.bs.menu.data-api', '.menu', Menu.dataApiKeydownHandler)
  EventHandler.on(document, 'click.bs.menu.data-api', Menu.clearMenus)
  EventHandler.on(document, 'keyup.bs.menu.data-api', Menu.clearMenus)
}

/** Drawers that are not `position: fixed` (responsive drawers) hide themselves when the viewport resizes. */
function attachDrawerGlobals(Drawer: any) {
  const EventHandler = eventHandler
  EventHandler.on(window, 'resize.bs.drawer.data-api', () => {
    for (const element of document.querySelectorAll<HTMLElement>('dialog.drawer[open]')) {
      if (getComputedStyle(element).position !== 'fixed') Drawer.getInstance(element)?.hide()
    }
  })
}

async function load(name: BootstrapPluginName, entry: Entry): Promise<PluginCtor> {
  const ctor = (await importers[name]()).default as PluginCtor
  await loadEventHandler()
  stripGlobalListenersSync(name)
  if (name === 'menu') attachMenuGlobals(ctor)
  if (name === 'drawer') attachDrawerGlobals(ctor)
  entry.ctor = ctor
  return ctor
}

/** Synchronous on purpose: a mount that happens right after cannot interleave with a half-finished teardown. */
function teardown(name: BootstrapPluginName) {
  const entry = getEntry(name)
  entry.ctor = null
  entry.promise = null
  for (const instance of [...entry.instances]) {
    try { instance.dispose() } catch { /* already disposed */ }
  }
  entry.instances.clear()
  stripGlobalListenersSync(name)
}

/** Loads (if necessary) and returns the Bootstrap plugin class. Must be paired with `releasePlugin`. */
export async function acquirePlugin(name: BootstrapPluginName): Promise<PluginCtor> {
  if (typeof document === 'undefined') throw new Error('[vue3-bootstrap-components] Bootstrap plugins can only be loaded in the browser.')
  const entry = getEntry(name)
  entry.count++
  try {
    for (const dep of dependencies[name] ?? []) await acquirePlugin(dep)
    entry.promise ??= load(name, entry)
    return await entry.promise
  } catch (error) {
    entry.promise = null
    releasePlugin(name)
    throw error
  }
}

/** Gives a reference back. The plugin is unloaded as soon as nothing uses it any more. */
export function releasePlugin(name: BootstrapPluginName): void {
  const entry = getEntry(name)
  entry.count = Math.max(0, entry.count - 1)
  for (const dep of dependencies[name] ?? []) releasePlugin(dep)
  if (entry.count > 0) return
  const pending = entry.promise ?? Promise.resolve()
  pending.catch(() => undefined).then(() => {
    if (entry.count === 0) teardown(name)
  })
}

export function trackInstance(name: BootstrapPluginName, instance: BootstrapInstance) {
  getEntry(name).instances.add(instance)
}

export function untrackInstance(name: BootstrapPluginName, instance: BootstrapInstance) {
  getEntry(name).instances.delete(instance)
}

/** Debug/testing helper: current number of live references per plugin. */
export function getLoaderState() {
  const state: Record<string, { references: number; loaded: boolean; instances: number }> = {}
  for (const [name, entry] of entries) {
    state[name] = { references: entry.count, loaded: entry.ctor !== null, instances: entry.instances.size }
  }
  return state
}
