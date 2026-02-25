import { onMounted, onBeforeUnmount } from 'vue'

export function useBootstrapInstance(refEl, BootstrapClass, options = {}) {
    let instance = null

    onMounted(() => {
        instance = BootstrapClass.getOrCreateInstance(refEl.value, options)
    })

    onBeforeUnmount(() => {
        if (instance) {
            instance.dispose()
            instance = null
        }
    })

    return {
        getInstance: () => instance
    }
}