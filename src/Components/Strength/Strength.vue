<script setup lang="ts">
import { ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'Strength' })

const props = withDefaults(defineProps<{
  /** Bootstrap option `input`: CSS selector of the password input. Defaults to the `input[type=password]` in the slot. */
  input?: string | HTMLElement | null
  /** Bootstrap option `minLength`. */
  minLength?: number
  /** Bootstrap option `messages`: labels for `weak`, `fair`, `good`, `strong`. */
  messages?: Partial<Record<'weak' | 'fair' | 'good' | 'strong', string>>
  /** Bootstrap option `weights`. */
  weights?: Record<string, number>
  /** Bootstrap option `thresholds`: three score limits between the four levels. */
  thresholds?: number[]
  /** Bootstrap option `scorer`: custom `(password) => score`. */
  scorer?: ((password: string) => number) | null
  /** Show the text label under the bar. */
  showText?: boolean
}>(), { showText: true })

const emit = defineEmits<{
  /** `strengthChange.bs.strength` — payload `strength` (`weak`|`fair`|`good`|`strong`|null), `score`, masked `password`. */
  (e: 'strengthChange', event: BsEvent<{ strength: string | null; score: number; password: string }>): void
}>()

const el = ref<HTMLElement | null>(null)

const plugin = useBootstrapPlugin({
  plugin: 'strength',
  el,
  config: () => ({ input: props.input, minLength: props.minLength, messages: props.messages ? { weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong', ...props.messages } : undefined, weights: props.weights, thresholds: props.thresholds, scorer: props.scorer }),
  events: ['strengthChange'],
  emit: (name, event) => emit(name as 'strengthChange', event as BsEvent<any>)
})

defineExpose({ getStrength: () => plugin.getInstance()?.getStrength() ?? null, evaluate: () => plugin.getInstance()?.evaluate(), getInstance: plugin.getInstance })
</script>

<template>
  <div>
    <slot />
    <div ref="el" class="strength">
      <div class="strength-bar"><span class="strength-segment" /><span class="strength-segment" /><span class="strength-segment" /><span class="strength-segment" /></div>
    </div>
    <div v-if="showText" class="strength-text" />
  </div>
</template>
