import type { App } from 'vue'
import * as components from './Components'

export default {
    install(app: App) {
        Object.entries(components).forEach(([name, component]) => {
            app.component(name, component)
        })
    }
}