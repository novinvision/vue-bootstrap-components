import {onMounted, onBeforeUnmount} from 'vue'

export function useBootstrapInstance(refEl, BootstrapClass, options = {}) {
    let instance = null

    onMounted(() => {
        instance = BootstrapClass.getOrCreateInstance(refEl.value, options)

        if(window){
            document.addEventListener('inertia:start', closeEl)
        }
    })

    onBeforeUnmount(() => {
        if (window) {
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

    const closeEl = function () {
        if (instance && typeof instance.hide === "function") {
            instance.hide()
        }
    }

    return {
        getInstance: () => instance
    }
}