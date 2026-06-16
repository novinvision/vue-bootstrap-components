import {onMounted, onBeforeUnmount} from 'vue'

export function useBootstrapInstance(refEl, BootstrapClass, options = {}) {
    let instance = null

    onMounted(() => {
        instance = BootstrapClass.getOrCreateInstance(refEl.value, options)

        if(window){
            document?.addEventListener('inertia:start', closeEl)
        }
    })

    onBeforeUnmount(() => {
        if (window) {
            document?.removeEventListener('inertia:start', closeEl)
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