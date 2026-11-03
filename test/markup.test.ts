import { describe, expect, it, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import * as lib from '../src'

const settle = async (ms = 120) => { await flushPromises(); await new Promise(r => setTimeout(r, ms)); await flushPromises() }
afterEach(() => { document.body.innerHTML = '' })

describe('markup follows the official Bootstrap 6 docs', () => {
  it('Breadcrumb: divider li + item with aria-current and active link', () => {
    const w = mount(defineComponent({ setup: () => () => h(lib.Breadcrumb, null, () => [h(lib.BreadcrumbItem, { href: '/', divider: false }, () => 'Home'), h(lib.BreadcrumbItem, { href: '#', active: true }, () => 'Data')]) }))
    expect(w.findAll('li.breadcrumb-divider')).toHaveLength(1)
    expect(w.get('li[aria-current="page"] a.breadcrumb-link.active').text()).toBe('Data')
  })

  it('Avatar status has role=img and label; theme class for initials', () => {
    const w = mount(lib.Avatar, { props: { initials: 'AB', theme: 'primary', status: 'online' } })
    expect(w.classes()).toContain('theme-primary')
    expect(w.get('.avatar-status.status-online').attributes('role')).toBe('img')
    expect(w.get('.avatar-status').attributes('aria-label')).toBe('Online')
  })

  it('Button group sets role and size classes; toolbar role', () => {
    const g = mount(lib.ButtonGroup, { props: { size: 'sm', divider: true, label: 'x' } })
    expect(g.attributes('role')).toBe('group')
    expect(g.classes()).toEqual(expect.arrayContaining(['btn-group', 'btn-group-sm', 'btn-group-divider']))
    expect(mount(lib.ButtonToolbar).attributes('role')).toBe('toolbar')
  })

  it('Disabled link button gets role, tabindex and aria-disabled', () => {
    const w = mount(lib.Button, { props: { href: '#', disabled: true } })
    expect(w.attributes()).toMatchObject({ role: 'button', tabindex: '-1', 'aria-disabled': 'true' })
  })

  it('Navbar renders responsive expand, container and nav list', () => {
    const w = mount(lib.Navbar, { props: { expand: 'md', dark: true }, slots: { default: () => h(lib.NavbarNav) } })
    expect(w.classes()).toContain('md:navbar-expand')
    expect(w.attributes('data-bs-theme')).toBe('dark')
    expect(w.find('div.container-fluid ul.nav.navbar-nav').exists()).toBe(true)
  })

  it('Stepper items and overflow wrapper', () => {
    const w = mount(lib.Stepper, { props: { horizontal: 'sm', overflow: true }, slots: { default: () => h(lib.StepperItem, { active: true, theme: 'success' }, () => 'One') } })
    expect(w.classes()).toContain('stepper-overflow')
    expect(w.get('ol').classes()).toContain('sm:stepper-horizontal')
    expect(w.get('li').classes()).toEqual(expect.arrayContaining(['stepper-item', 'active', 'theme-success']))
  })

  it('Menu item selected renders the check icon, description content', () => {
    const w = mount(lib.MenuItem, { props: { selected: true, description: 'Visible', theme: 'danger' }, slots: { default: 'Label' } })
    expect(w.classes()).toEqual(expect.arrayContaining(['menu-item', 'selected', 'theme-danger']))
    expect(w.find('.menu-item-content .menu-item-description').text()).toBe('Visible')
    expect(w.find('svg.menu-item-check').exists()).toBe(true)
  })

  it('Placeholder bars use col-* inside an animated wrapper', () => {
    const w = mount(lib.PlaceholderWrap, { props: { animation: 'wave' }, slots: { default: () => h(lib.Placeholder, { cols: 6 }) } })
    expect(w.classes()).toContain('placeholder-wave')
    expect(w.get('.placeholder').classes()).toContain('col-6')
  })

  it('Stacked progress puts the width on .progress', () => {
    const w = mount(lib.Progress, { props: { value: 30, stacked: true } })
    expect(w.attributes('style')).toContain('width: 30%')
  })

  it('Pagination keeps .page-item list items', () => {
    const w = mount(lib.Pagination, { props: { currentPage: 2, lastPage: 3 } })
    expect(w.findAll('li.page-item').length).toBeGreaterThan(2)
    expect(w.get('li.page-item.active .page-link').text()).toBe('2')
  })
})

describe('behavior', () => {
  it('Carousel renders indicators for its items, marks first active and exposes controls', async () => {
    const w = mount(defineComponent({ setup: () => () => h(lib.Carousel, { name: 'c1', playPause: true, overlay: true, items: 2 }, () => [h(lib.CarouselItem, { interval: 1000 }, () => 'a'), h(lib.CarouselItem, null, () => 'b')]) }), { attachTo: document.body })
    await settle()
    expect(w.findAll('.carousel-indicators button')).toHaveLength(2)
    expect(w.get('.carousel-item').classes()).toContain('active')
    expect(w.get('.carousel-item').attributes('data-bs-interval')).toBe('1000')
    expect(w.find('.carousel-overlay-controls .carousel-control-play-pause').exists()).toBe(true)
    expect(w.find('[data-bs-slide="prev"]').exists()).toBe(true)
    w.unmount()
  })

  it('Toggler toggles a class on its target and emits toggle/toggled', async () => {
    document.body.innerHTML = '<div id="panel" class="x"></div>'
    const w = mount(lib.Toggler, { props: { target: '#panel', value: 'on' }, slots: { default: 'go' }, attachTo: document.body })
    await settle()
    await w.trigger('click')
    expect(document.getElementById('panel')!.classList.contains('on')).toBe(true)
    expect(w.emitted('toggle')).toHaveLength(1)
    expect(w.emitted('toggled')).toHaveLength(1)
    await w.trigger('click')
    expect(document.getElementById('panel')!.classList.contains('on')).toBe(false)
    w.unmount()
  })

  it('Collapse trigger reflects aria-expanded', async () => {
    const w = mount(defineComponent({ setup: () => () => h('div', [h(lib.CollapseTrigger, { name: 'cx' }, () => 'T'), h(lib.Collapse, { name: 'cx' }, () => 'body')]) }), { attachTo: document.body })
    await settle()
    expect(w.get('button').attributes('aria-expanded')).toBe('false')
    await w.get('button').trigger('click'); await settle()
    expect(w.get('button').attributes('aria-expanded')).toBe('true')
    w.unmount()
  })

  it('Tabs in list-group mode render list-group items', async () => {
    const w = mount(defineComponent({ setup: () => () => h(lib.Tabs, { listGroup: true }, () => [h(lib.TabList, null, () => [h(lib.TabButton, { name: 'a' }, () => 'A')]), h(lib.TabContent, null, () => [h(lib.TabPane, { name: 'a' }, () => 'PA')])]) }), { attachTo: document.body })
    await settle()
    expect(w.find('.list-group a.list-group-item.list-group-item-action.active[role="tab"]').exists()).toBe(true)
    w.unmount()
  })
})
