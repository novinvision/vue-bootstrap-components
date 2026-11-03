<script setup lang="ts">
import { nextTick, provide, ref, watch } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { CarouselKey } from '../../core/keys'
import { useStableId } from '../../core/utils'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'Carousel' })

const props = withDefaults(defineProps<{
  /** Id of the carousel element. Generated when omitted. */
  name?: string
  /** Index of the active slide (`v-model`). */
  modelValue?: number
  /** Bootstrap option `autoplay`. */
  autoplay?: boolean
  /** Bootstrap option `ends`: `loop`, `wrap` or `stop`. */
  ends?: 'loop' | 'wrap' | 'stop'
  /** Bootstrap option `interval` (ms). */
  interval?: number
  /** Bootstrap option `keyboard`. */
  keyboard?: boolean
  /** Bootstrap option `pause`: `hover` or `false`. */
  pause?: 'hover' | false
  /** Show indicator buttons. */
  indicators?: boolean
  /** Show previous/next buttons. */
  controls?: boolean
  /** Show a play/pause button. */
  playPause?: boolean
  /** Crossfade instead of sliding (`.carousel-fade`). */
  fade?: boolean
  /** Center the active slide (`.carousel-center`). */
  center?: boolean
  /** Auto-sized slides (`.carousel-auto`). */
  auto?: boolean
  /** Place controls/indicators over the slides (`.carousel-overlay` + `.carousel-overlay-controls`). */
  overlay?: boolean
  /** Number of whole slides visible at once (`--bs-carousel-items`). */
  items?: number
  /** Space between slides (`--bs-carousel-items-gap`, any CSS length). */
  gap?: string
  /** How much of the neighboring slides to reveal (`--bs-carousel-items-peek`, any CSS length). */
  peek?: string
  /** Where the built-in controls/indicators sit when not overlaid. */
  controlsPlacement?: 'top' | 'bottom'
  playLabel?: string
  pauseLabel?: string
  previousLabel?: string
  nextLabel?: string
}>(), { modelValue: 0, autoplay: undefined, keyboard: undefined, indicators: true, controls: true, playPause: false, fade: false, center: false, auto: false, overlay: false, previousLabel: 'Previous', nextLabel: 'Next', controlsPlacement: 'bottom', playLabel: 'Play', pauseLabel: 'Pause' })

const emit = defineEmits<{
  /** `slide.bs.carousel` — cancelable. Payload: `relatedTarget`, `direction`, `from`, `to`. */
  (e: 'slide', event: BsEvent<{ relatedTarget: HTMLElement; direction: string; from: number; to: number }>): void
  /** `slid.bs.carousel` */
  (e: 'slid', event: BsEvent<{ relatedTarget: HTMLElement; direction: string; from: number; to: number }>): void
  (e: 'update:modelValue', index: number): void
}>()

const el = ref<HTMLElement | null>(null)
const generatedId = useStableId('bs-carousel')
const id = () => props.name ?? generatedId
const count = ref(0)
let current = props.modelValue

provide(CarouselKey, {
  register: () => count.value++,
  unregister: () => { count.value-- }
})

const plugin = useBootstrapPlugin({
  plugin: 'carousel',
  el,
  config: () => ({ autoplay: props.autoplay, ends: props.ends, interval: props.interval, keyboard: props.keyboard, pause: props.pause }),
  // Indicators are rendered after the items register; wait for that DOM before Bootstrap reads it.
  beforeCreate: () => nextTick(),
  events: ['slide', 'slid'],
  emit: (name, event) => {
    emit(name as 'slide', event as BsEvent<any>)
    if (name === 'slid') {
      const items = Array.from(el.value?.querySelectorAll('.carousel-item:not(.carousel-item-clone)') ?? [])
      const index = (event as any).to ?? items.indexOf((event as any).relatedTarget)
      if (typeof index === 'number' && index >= 0) {
        current = index
        if (index !== props.modelValue) emit('update:modelValue', index)
      }
    }
  },
  onCreated: instance => { if (props.modelValue > 0) instance.to(props.modelValue) }
})

watch(() => props.modelValue, index => {
  if (index !== current) plugin.getInstance()?.to(index)
})

const stop = () => plugin.getInstance()?._pauseFromInteraction?.()
const next = () => { stop(); plugin.getInstance()?.next() }
const prev = () => { stop(); plugin.getInstance()?.prev() }
const to = (index: number) => { stop(); plugin.getInstance()?.to(index) }
const togglePlay = () => plugin.getInstance()?._togglePlayPause?.()

defineExpose({ next, prev, to, pause: () => plugin.getInstance()?.pause(), cycle: () => plugin.getInstance()?.cycle(), getInstance: plugin.getInstance })
</script>

<template>
  <div
    :id="id()"
    ref="el"
    class="carousel"
    :class="{ 'carousel-fade': fade, 'carousel-center': center, 'carousel-auto': auto, 'carousel-overlay': overlay }"
    :style="{ '--bs-carousel-items': items, '--bs-carousel-items-gap': gap, '--bs-carousel-items-peek': peek }"
    tabindex="0"
    aria-roledescription="carousel"
  >
    <div v-if="!overlay && controlsPlacement === 'top' && (controls || indicators || playPause)" class="d-flex justify-content-between align-items-center mb-2">
      <slot name="controls" :next="next" :prev="prev" :to="to" :count="count">
        <div v-if="controls || playPause">
          <button v-if="controls" type="button" class="btn-icon btn-sm" :data-bs-target="`#${id()}`" data-bs-slide="prev" @click="prev">
            <span class="carousel-icon-prev" aria-hidden="true" /><span class="visually-hidden">{{ previousLabel }}</span>
          </button>
          <button v-if="controls" type="button" class="btn-icon btn-sm" :data-bs-target="`#${id()}`" data-bs-slide="next" @click="next">
            <span class="carousel-icon-next" aria-hidden="true" /><span class="visually-hidden">{{ nextLabel }}</span>
          </button>
        </div>
      </slot>
    </div>
    <div class="carousel-inner"><slot /></div>
    <div v-if="controls || playPause || indicators" :class="overlay ? 'carousel-overlay-controls' : controlsPlacement === 'bottom' ? 'd-flex justify-content-between align-items-center mt-2' : 'd-none'">
      <slot name="controls" :next="next" :prev="prev" :to="to" :count="count">
        <button v-if="controls" type="button" :class="['btn-icon btn-sm', { 'btn-subtle theme-secondary': overlay }]" :data-bs-target="`#${id()}`" data-bs-slide="prev" @click="prev">
          <span class="carousel-icon-prev" aria-hidden="true" /><span class="visually-hidden">{{ previousLabel }}</span>
        </button>
        <div v-if="indicators && count > 0" class="carousel-indicators">
          <button
            v-for="index in count"
            :key="index"
            type="button"
            :data-bs-target="`#${id()}`"
            :data-bs-slide-to="index - 1"
            :class="{ active: index - 1 === modelValue }"
            :aria-current="index - 1 === modelValue ? 'true' : undefined"
            :aria-label="`Slide ${index}`"
            @click="to(index - 1)"
          />
        </div>
        <button v-if="playPause" type="button" :class="['btn-icon btn-sm carousel-control-play-pause', { 'btn-subtle theme-secondary': overlay }]" :data-bs-target="`#${id()}`" :aria-label="pauseLabel" :data-bs-pause-label="pauseLabel" :data-bs-play-label="playLabel" @click="togglePlay">
          <span class="carousel-icon-pause" aria-hidden="true" /><span class="carousel-icon-play" aria-hidden="true" />
        </button>
        <button v-if="controls" type="button" :class="['btn-icon btn-sm', { 'btn-subtle theme-secondary': overlay }]" :data-bs-target="`#${id()}`" data-bs-slide="next" @click="next">
          <span class="carousel-icon-next" aria-hidden="true" /><span class="visually-hidden">{{ nextLabel }}</span>
        </button>
      </slot>
    </div>
  </div>
</template>
