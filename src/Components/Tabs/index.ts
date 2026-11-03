import { createElementComponent } from '../../core/simple'

export { default as Tabs } from './Tabs.vue'
export { default as TabList } from './TabList.vue'
export { default as TabButton } from './TabButton.vue'
export { default as TabPane } from './TabPane.vue'
export const TabContent = createElementComponent('TabContent', 'tab-content')
