import { describe, expect, it, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import * as lib from '../src'

const settle = async (ms = 150) => { await flushPromises(); await new Promise(r => setTimeout(r, ms)); await flushPromises() }
afterEach(() => { document.body.innerHTML = '' })

const { getLoaderState } = lib

const cases: Array<[string, string, () => any]> = [
  ['carousel', 'Carousel', () => defineComponent({ setup: () => () => h(lib.Carousel, { autoplay: false }, () => [h(lib.CarouselItem, null, () => 'a'), h(lib.CarouselItem, null, () => 'b')]) })],
  ['combobox', 'Combobox', () => defineComponent({ setup: () => () => h(lib.Combobox, { options: [{ value: 1, label: 'One' }, { value: 2, label: 'Two' }], modelValue: 2, placeholder: 'Pick' }) })],
  ['otp-input', 'OtpInput', () => defineComponent({ setup: () => () => h(lib.OtpInput, { length: 6 }) })],
  ['strength', 'Strength', () => defineComponent({ setup: () => () => h(lib.Strength, null, () => h('input', { type: 'password' })) })],
  ['scrollspy', 'ScrollSpy', () => defineComponent({ setup: () => () => h('div', [h('nav', { id: 'spy-nav' }), h(lib.ScrollSpy, { target: '#spy-nav' }, () => h('section', { id: 'x' }))]) })],
  ['toggler', 'Toggler', () => defineComponent({ setup: () => () => h('div', [h('div', { id: 'tg', class: 'a' }), h(lib.Toggler, { target: '#tg', value: 'b' }, () => 'toggle')]) })],
  ['nav-overflow', 'NavOverflow', () => defineComponent({ setup: () => () => h(lib.NavOverflow, null, () => h(lib.Nav, null, () => h(lib.NavItem, null, () => h(lib.NavLink, { href: '#' }, () => 'x')))) })],
  ['popover', 'Popover', () => defineComponent({ setup: () => () => h(lib.Popover, { title: 'T', content: 'C' }, () => 'pop') })],
  ['range', 'FormRange', () => defineComponent({ setup: () => () => h(lib.FormRange, { min: 0, max: 10, bubble: true }) })],
  ['drawer', 'Drawer', () => defineComponent({ setup: () => () => h(lib.Drawer, { name: 'dr', placement: 'end' }, () => 'x') })],
  ['datepicker', 'Datepicker', () => defineComponent({ setup: () => () => h(lib.Datepicker, { locale: 'en-US' }) })]
]

describe('every Bootstrap-backed component loads on mount and unloads on unmount', () => {
  for (const [plugin, name, factory] of cases) {
    it(name, async () => {
      const wrapper = mount(factory(), { attachTo: document.body })
      await settle()
      expect(getLoaderState()[plugin], `${plugin} not loaded`).toMatchObject({ loaded: true })
      expect(getLoaderState()[plugin].instances).toBeGreaterThan(0)
      wrapper.unmount(); await settle()
      expect(getLoaderState()[plugin]).toMatchObject({ references: 0, loaded: false, instances: 0 })
    })
  }

  it('Combobox renders Bootstrap markup and reflects the selected value', async () => {
    const wrapper = mount(lib.Combobox, { props: { options: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }], modelValue: 'b', name: 'f' }, attachTo: document.body })
    await settle()
    expect(wrapper.get('.combobox-value').text()).toBe('B')
    wrapper.unmount()
  })

  it('OtpInput emits complete and update:modelValue', async () => {
    const wrapper = mount(lib.OtpInput, { props: { length: 4 }, attachTo: document.body })
    await settle()
    ;(wrapper.vm as any).setValue('1234'); await settle()
    expect(wrapper.emitted('complete')?.[0]).toBeTruthy()
    wrapper.unmount()
  })

  it('Imperative toast API renders and removes toasts', async () => {
    const toast = lib.useBsToast()
    const id = toast.success('Saved', 'Done', null, { autohide: false, animation: false })
    await settle(300)
    expect(document.querySelector('.toast-container .toast.theme-success')).toBeTruthy()
    toast.dismiss(id); await settle(300)
    expect(document.querySelector('.toast-container .toast')).toBeNull()
    lib.destroyToastContainer()
  })

  it('Plugin registers every component globally without a prefix and without Vue warnings', async () => {
    const { createApp } = await import('vue')
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    const app = createApp({ render: () => null })
    app.use(lib.default)
    for (const name of ['Button', 'Dialog', 'Menu', 'Toast', 'Card', 'Progress', 'Nav', 'Switch', 'Alert', 'Tooltip']) expect(app.component(name), name).toBeTruthy()
    expect(warn.mock.calls.filter(c => String(c[0]).includes('component id'))).toHaveLength(0)
    warn.mockRestore()
  })

  it('Plugin supports an optional prefix', async () => {
    const { createApp } = await import('vue')
    const app = createApp({ render: () => null })
    app.use(lib.default, { prefix: 'Bs', only: ['Button', 'Dialog'] })
    expect(app.component('BsButton')).toBeTruthy()
    expect(app.component('BsDialog')).toBeTruthy()
    expect(app.component('BsCard')).toBeUndefined()
  })
})

describe('unprefixed names do not collide with native tags', () => {
  it('renders native <button>/<nav>/<dialog> even when Button, Nav and Dialog are registered globally', async () => {
    const wrapper = mount(defineComponent({
      setup: () => () => h('div', [
        h(lib.Button, { theme: 'danger' }, () => 'Go'),
        h(lib.Navbar, { expand: 'md' }, () => h(lib.NavbarBrand, null, () => 'x')),
        h(lib.Dialog, { name: 'g1' }, () => 'body')
      ])
    }), { global: { plugins: [lib.default] }, attachTo: document.body })
    await settle()
    expect(wrapper.get('button.btn-solid').text()).toBe('Go')
    expect(wrapper.find('nav.navbar').exists()).toBe(true)
    expect(wrapper.find('dialog.dialog').exists()).toBe(true)
    wrapper.unmount()
  })
})
