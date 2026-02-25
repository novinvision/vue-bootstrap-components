import type { OffCanvas } from './Components/OffCanvas'

declare module 'vue' {
    export interface GlobalComponents {
        OffCanvas: typeof OffCanvas
    }
}