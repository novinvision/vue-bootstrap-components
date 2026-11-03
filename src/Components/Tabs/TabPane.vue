<script setup lang="ts">
import { inject } from 'vue'
import { TabsKey } from '../../core/keys'

defineOptions({ name: 'TabPane' })

const props = defineProps<{
  /** Name of the matching `TabButton`. */
  name: string
}>()

const tabs = inject(TabsKey, null)
// Bootstrap owns the `active`/`show` classes after the first render.
const initiallyActive = tabs ? tabs.initialActive() === props.name : false
</script>

<template>
  <div :id="`pane-${name}`" class="tab-pane" :class="{ fade: tabs?.fade ?? true, show: initiallyActive, active: initiallyActive }" role="tabpanel" :aria-labelledby="`tab-${name}`" tabindex="0">
    <slot />
  </div>
</template>
