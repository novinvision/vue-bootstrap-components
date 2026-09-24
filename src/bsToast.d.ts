import { BsToastInstance } from './plugin'

declare module 'vue' {
    interface ComponentCustomProperties {
        $bsToast: BsToastInstance
    }
}