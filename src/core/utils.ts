import type { ThemeColor } from './types'

let uid = 0
/** SSR-safe-ish unique id generator (deterministic per module instance). */
export function uniqueId(prefix = 'bs'): string {
  return `${prefix}-${++uid}`
}

export function themeClass(theme?: ThemeColor | string | null): string | undefined {
  return theme ? `theme-${theme}` : undefined
}

/** Builds a responsive class like `md:drawer` from a breakpoint. */
export function responsiveClass(breakpoint: string | undefined | null, base: string): string | undefined {
  return breakpoint ? `${breakpoint}:${base}` : undefined
}

import * as Vue from 'vue'

/** `useId()` on Vue >= 3.5 (SSR/hydration safe), a counter-based fallback on 3.4. */
export function useStableId(prefix = 'bs'): string {
  const native = (Vue as unknown as { useId?: () => string }).useId
  return native ? `${prefix}-${native()}` : uniqueId(prefix)
}
