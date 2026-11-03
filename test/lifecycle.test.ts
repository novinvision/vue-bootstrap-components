import { describe, expect, it, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import { Alert, Collapse, Tooltip, Toast, Dialog, Tabs, TabList, TabButton, TabContent, TabPane, Menu, MenuToggle, MenuContent, MenuItem, Chips, getLoaderState, useOverlay } from '../src'

const settle = async (ms = 60) => { await flushPromises(); await new Promise(r => setTimeout(r, ms)); await flushPromises() }

afterEach(() => { document.body.innerHTML = '' })

describe('lazy loading and unloading', () => {
  it('loads Bootstrap only after mount and unloads it after unmount', async () => {
    expect(getLoaderState().alert?.loaded ?? false).toBe(false)
    const wrapper = mount(Alert, { slots: { default: 'Hi' }, attachTo: document.body })
    await settle()
    expect(getLoaderState().alert).toMatchObject({ references: 1, loaded: true, instances: 1 })
    wrapper.unmount()
    await settle()
    expect(getLoaderState().alert).toMatchObject({ references: 0, loaded: false, instances: 0 })
  })

  it('shares one load between several components and unloads after the last one', async () => {
    const a = mount(Alert, { attachTo: document.body })
    const b = mount(Alert, { attachTo: document.body })
    await settle()
    expect(getLoaderState().alert).toMatchObject({ references: 2, instances: 2 })
    a.unmount(); await settle()
    expect(getLoaderState().alert).toMatchObject({ references: 1, loaded: true, instances: 1 })
    b.unmount(); await settle()
    expect(getLoaderState().alert).toMatchObject({ references: 0, loaded: false })
  })

  it('can be re-mounted after being unloaded', async () => {
    mount(Alert, { attachTo: document.body }).unmount(); await settle()
    const again = mount(Alert, { props: { dismissible: true }, attachTo: document.body })
    await settle()
    expect(getLoaderState().alert).toMatchObject({ references: 1, loaded: true, instances: 1 })
    again.unmount()
  })

  it('does not inject any stylesheet', async () => {
    const wrapper = mount(Alert, { attachTo: document.body }); await settle()
    expect(document.querySelectorAll('style, link[rel=stylesheet]').length).toBe(0)
    wrapper.unmount()
  })
})

describe('events', () => {
  it('Alert emits close and closed and hides itself', async () => {
    const wrapper = mount(Alert, { props: { dismissible: true, theme: 'danger' }, slots: { default: 'Oops' }, attachTo: document.body })
    await settle()
    expect(wrapper.get('.alert').classes()).toContain('theme-danger')
    await wrapper.get('.btn-close').trigger('click')
    await settle()
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('closed')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    expect(wrapper.find('.alert').exists()).toBe(false)
    wrapper.unmount()
  })

  it('Alert close is cancelable from the emitted event', async () => {
    const wrapper = mount(Alert, { props: { dismissible: true }, attachTo: document.body })
    await settle()
    wrapper.get('.alert').element.addEventListener('close.bs.alert', e => e.preventDefault())
    await wrapper.get('.btn-close').trigger('click'); await settle()
    expect(wrapper.emitted('close')).toHaveLength(1)
    expect(wrapper.emitted('closed')).toBeUndefined()
    wrapper.unmount()
  })

  it('Collapse emits show/shown/hide/hidden and syncs v-model', async () => {
    const wrapper = mount(Collapse, { props: { name: 'c1' }, slots: { default: 'x' }, attachTo: document.body })
    await settle()
    useOverlay('c1').show(); await settle()
    expect(wrapper.emitted('show')).toHaveLength(1)
    expect(wrapper.emitted('shown')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([true])
    expect(wrapper.classes()).toContain('show')
    await wrapper.setProps({ modelValue: true }); await settle()
    await wrapper.setProps({ modelValue: false }); await settle()
    expect(wrapper.emitted('hide')).toHaveLength(1)
    expect(wrapper.emitted('hidden')).toHaveLength(1)
    wrapper.unmount()
  })

  it('Toast opens from v-model and emits shown/hidden', async () => {
    const wrapper = mount(Toast, { props: { modelValue: true, autohide: false, title: 'T', animation: false }, slots: { default: 'Body' }, attachTo: document.body })
    await settle()
    expect(wrapper.emitted('show')).toHaveLength(1)
    expect(wrapper.emitted('shown')).toHaveLength(1)
    await wrapper.get('.btn-close').trigger('click'); await settle()
    expect(wrapper.emitted('hidden')).toHaveLength(1)
    wrapper.unmount()
  })

  it('Tooltip creates an instance with props as options and emits events', async () => {
    const wrapper = mount(Tooltip, { props: { title: 'Tip', placement: 'bottom', trigger: 'manual', animation: false }, slots: { default: 'hover' }, attachTo: document.body })
    await settle(120)
    expect(getLoaderState().tooltip).toMatchObject({ references: 1, instances: 1 })
    await (wrapper.vm as any).show(); await settle(120)
    expect(wrapper.emitted('show')).toHaveLength(1)
    expect(wrapper.emitted('inserted')).toHaveLength(1)
    wrapper.unmount(); await settle()
    expect(getLoaderState().tooltip).toMatchObject({ references: 0, loaded: false })
  })

  it('Dialog is registered by name and removing it cleans up', async () => {
    const wrapper = mount(Dialog, { props: { name: 'dlg', modelValue: false }, slots: { default: 'Body' }, attachTo: document.body })
    await settle()
    expect(wrapper.element.tagName).toBe('DIALOG')
    expect(wrapper.classes()).toContain('dialog')
    expect(getLoaderState().dialog).toMatchObject({ references: 1, instances: 1 })
    wrapper.unmount(); await settle()
    expect(getLoaderState().dialog).toMatchObject({ references: 0, instances: 0 })
  })

  it('Tabs mark the first tab active and expose names', async () => {
    const wrapper = mount(defineComponent({
      setup: () => () => h(Tabs, null, () => [
        h(TabList, null, () => [h(TabButton, { name: 'a' }, () => 'A'), h(TabButton, { name: 'b' }, () => 'B')]),
        h(TabContent, null, () => [h(TabPane, { name: 'a' }, () => 'PA'), h(TabPane, { name: 'b' }, () => 'PB')])
      ])
    }), { attachTo: document.body })
    await settle()
    expect(wrapper.get('#tab-a').classes()).toContain('active')
    expect(wrapper.get('#tab-b').classes()).not.toContain('active')
    expect(wrapper.get('#pane-a').classes()).toEqual(expect.arrayContaining(['tab-pane', 'active', 'show']))
    expect(wrapper.get('#pane-b').classes()).not.toContain('active')
    wrapper.unmount()
  })

  it('Menu binds to its toggle and uses document listeners only while loaded', async () => {
    const wrapper = mount(defineComponent({
      setup: () => () => h(Menu, null, () => [h(MenuToggle, null, () => 'Open'), h(MenuContent, null, () => [h(MenuItem, { href: '#' }, () => 'One')])])
    }), { attachTo: document.body })
    await settle(120)
    expect(getLoaderState().menu).toMatchObject({ references: 1, instances: 1 })
    wrapper.unmount(); await settle()
    expect(getLoaderState().menu).toMatchObject({ references: 0, loaded: false })
  })

  it('Chips sync v-model with Bootstrap chips', async () => {
    const wrapper = mount(Chips, { props: { modelValue: ['a', 'b'] }, attachTo: document.body })
    await settle(120)
    expect(wrapper.findAll('.chip')).toHaveLength(2)
    await wrapper.setProps({ modelValue: ['a', 'b', 'c'] }); await settle()
    expect(wrapper.findAll('.chip')).toHaveLength(3)
    wrapper.unmount()
  })
})
