<script setup lang="ts">
import { inject, onBeforeUnmount, ref } from 'vue'
import { useBootstrapPlugin } from '../../core/useBootstrapPlugin'
import { TabsKey } from '../../core/keys'
import type { BsEvent } from '../../core/types'

defineOptions({ name: 'TabButton' })

const props = withDefaults(defineProps<{
  /** Unique tab name; links the button to the `TabPane` with the same name. */
  name: string
  disabled?: boolean
  asLink?: boolean
}>(), { disabled: false })

const emit = defineEmits<{
  /** `show.bs.tab` — cancelable. */
  (e: 'show', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  (e: 'shown', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  /** `hide.bs.tab` — cancelable. */
  (e: 'hide', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
  (e: 'hidden', event: BsEvent<{ relatedTarget?: HTMLElement }>): void
}>()

const tabs = inject(TabsKey, null)
const el = ref<HTMLElement | null>(null)
const initiallyActive = tabs ? tabs.initialActive() === props.name || (tabs.initialActive() === null) : false

const plugin = useBootstrapPlugin({
  plugin: 'tab',
  el,
  events: ['show', 'shown', 'hide', 'hidden'],
  emit: (name, event) => emit(name as 'show', event)
})

tabs?.register(props.name, () => plugin.whenReady().then(instance => instance.show()))
onBeforeUnmount(() => tabs?.unregister(props.name))

function onClick(event: MouseEvent) {
  event.preventDefault()
  if (!props.disabled) plugin.getInstance()?.show()
}
</script>

<template>
  <a
    v-if="asLink"
    :id="`tab-${name}`"
    ref="el"
    :class="{ active: initiallyActive, disabled }"
    :href="`#pane-${name}`"
    role="tab"
    :data-tab-name="name"
    data-bs-toggle="tab"
    :aria-controls="`pane-${name}`"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="onClick"
  ><slot /></a>
  <li v-else class="nav-item" role="presentation">
    <button
      :id="`tab-${name}`"
      ref="el"
      type="button"
      class="nav-link"
      :class="{ active: initiallyActive, disabled }"
      role="tab"
      :data-tab-name="name"
      data-bs-toggle="tab"
      :data-bs-target="`#pane-${name}`"
      :aria-controls="`pane-${name}`"
      :aria-selected="initiallyActive ? 'true' : 'false'"
      :disabled="disabled"
      @click="onClick"
    >
      <slot />
    </button>
  </li>
</template>
