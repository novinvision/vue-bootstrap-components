import { createElementComponent } from '../../core/simple'

export { default as Progress } from './Progress.vue'
/** Wrapper for several `Progress` bars in one track (`.progress-stacked`). */
export const ProgressStacked = createElementComponent('ProgressStacked', 'progress-stacked')
