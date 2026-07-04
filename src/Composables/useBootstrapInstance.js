import {onMounted, onBeforeUnmount} from 'vue'

/**
 * @param refEl        template ref of the element the Bootstrap plugin binds to
 * @param loadClass    either the Bootstrap plugin class itself, OR (preferred for SSR)
 *                      a function returning the class / a Promise resolving to the class,
 *                      e.g. `() => import('bootstrap/js/src/collapse').then(m => m.default)`.
 *                      Bootstrap's plugin modules register document-level listeners as soon
 *                      as they're imported, so they must never be imported at the top of a
 *                      <script setup> block (that code also runs during SSR, where `document`
 *                      doesn't exist). Passing a loader function defers the import until
 *                      onMounted, which never runs on the server.
 */
export function useBootstrapInstance(refEl, loadClass, options = {}) {
    let instance = null

    onMounted(async () => {
        const BootstrapClass = typeof loadClass === 'function'
            ? await loadClass()
            : loadClass

        instance = BootstrapClass.getOrCreateInstance(refEl.value, options)

        if (typeof document !== 'undefined') {
            document.addEventListener('inertia:start', closeEl)
        }
    })

    onBeforeUnmount(() => {
        if (typeof document !== 'undefined') {
            document.removeEventListener('inertia:start', closeEl)
        }

        disposeEl()
    })

    const disposeEl = function () {
        if (instance) {
            instance.dispose()
            instance = null
        }
    }

    const closeEl = async function (e) {
        const method = e?.detail?.visit?.method ?? null;
        if ((!method || method === 'get') && instance && typeof instance.hide === "function") {
            await instance.hide()
            document?.querySelectorAll('.modal-backdrop')?.forEach(item => item.remove())
        }
    }

    return {
        getInstance: () => instance
    }
}