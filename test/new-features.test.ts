import { describe, expect, it, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createApp, defineComponent, h, ref } from 'vue'
import * as lib from '../src'

const settle = async (ms = 150) => { await flushPromises(); await new Promise(r => setTimeout(r, ms)); await flushPromises() }
afterEach(() => { lib.useBsDialog().closeAll(); document.body.innerHTML = '' })

describe('DialogButton / DrawerButton', () => {
  it('opens the dialog with the given name', async () => {
    const w = mount(defineComponent({ setup: () => () => h('div', [h(lib.DialogButton, { name: 'dlg1', theme: 'danger' }, () => 'Open'), h(lib.Dialog, { name: 'dlg1' }, () => 'Body')]) }), { attachTo: document.body })
    await settle()
    const btn = w.get('button')
    expect(btn.classes()).toEqual(expect.arrayContaining(['btn-solid', 'theme-danger']))
    expect(btn.attributes('aria-controls')).toBe('dlg1')
    await btn.trigger('click'); await settle()
    const dlg = w.findComponent(lib.Dialog)
    expect(dlg.emitted('show')).toHaveLength(1)
    w.unmount()
  })

  it('opens the drawer and mirrors aria-expanded', async () => {
    const w = mount(defineComponent({ setup: () => () => h('div', [h(lib.DrawerButton, { name: 'dr1' }, () => 'Menu'), h(lib.Drawer, { name: 'dr1' }, () => 'Body')]) }), { attachTo: document.body })
    await settle()
    expect(w.get('button').attributes('aria-expanded')).toBe('false')
    await w.get('button').trigger('click'); await settle()
    expect(w.findComponent(lib.Drawer).emitted('show')).toHaveLength(1)
    w.unmount()
  })
})

describe('CloseButton', () => {
  it('closes the nearest Alert automatically', async () => {
    const w = mount(lib.Alert, { slots: { default: () => h(lib.CloseButton) }, attachTo: document.body })
    await settle()
    await w.get('.btn-close').trigger('click'); await settle()
    expect(w.emitted('close')).toHaveLength(1)
    expect(w.emitted('closed')).toHaveLength(1)
    w.unmount()
  })

  it('closes a Toast and a Dialog, and supports target/preventDefault', async () => {
    const toast = mount(lib.Toast, { props: { modelValue: true, autohide: false, animation: false, closable: false }, slots: { default: () => h(lib.CloseButton) }, attachTo: document.body })
    await settle()
    await toast.get('.btn-close').trigger('click'); await settle()
    expect(toast.emitted('hidden')).toHaveLength(1)
    toast.unmount()

    const prevented = mount(lib.Toast, { props: { modelValue: true, autohide: false, animation: false, closable: false }, slots: { default: () => h(lib.CloseButton, { onClick: (e: Event) => e.preventDefault() }) }, attachTo: document.body })
    await settle()
    await prevented.get('.btn-close').trigger('click'); await settle()
    expect(prevented.emitted('hide')).toBeUndefined()
    prevented.unmount()

    const other = mount(lib.Toast, { props: { name: 'tgt', modelValue: true, autohide: false, animation: false, closable: false }, attachTo: document.body })
    const closer = mount(lib.CloseButton, { props: { target: 'tgt' } })
    await settle()
    await closer.trigger('click'); await settle()
    expect(other.emitted('hidden')).toHaveLength(1)
    other.unmount(); closer.unmount()
  })
})

describe('plugins', () => {
  it('app.use(bsToast) exposes $bsToast and inject', () => {
    const app = createApp({ render: () => null }); app.use(lib.bsToast, { delay: 1234 })
    expect(typeof app.config.globalProperties.$bsToast.success).toBe('function')
    expect(app.runWithContext(() => (app as any)._context.provides.bsToast)).toBe(app.config.globalProperties.$bsToast)
  })

  it('app.use(bsDialog) exposes $bsDialog', () => {
    const app = createApp({ render: () => null }); app.use(lib.bsDialog, { confirmText: 'Yes' })
    expect(typeof app.config.globalProperties.$bsDialog.confirm).toBe('function')
  })

  it('confirm resolves { confirmed: true } for the confirm button', async () => {
    const dialog = lib.useBsDialog()
    const promise = dialog.confirm('Delete?', 'Confirm', { confirmText: 'Yes', cancelText: 'No' })
    await settle(250)
    const dlg = document.querySelector('dialog')!
    expect(dlg.querySelector('.dialog-title')!.textContent).toBe('Confirm')
    const buttons = [...dlg.querySelectorAll('.dialog-footer button')]
    expect(buttons.map(b => b.textContent!.trim())).toEqual(['No', 'Yes'])
    ;(buttons[1] as HTMLElement).click()
    const result = await promise
    expect(result).toMatchObject({ confirmed: true, button: 'confirm', index: 1, reason: 'button' })
    await settle(100)
    expect(document.querySelector('dialog')).toBeNull()
  })

  it('cancel button, header close and custom buttons are reported', async () => {
    const dialog = lib.useBsDialog()
    let p = dialog({ message: 'x', buttons: [{ text: 'Save', value: 'save', confirm: true }, { text: 'Discard', value: 'discard' }, { text: 'Later', value: 'later' }] })
    await settle(250)
    ;(document.querySelectorAll('.dialog-footer button')[1] as HTMLElement).click()
    expect(await p).toMatchObject({ confirmed: false, button: 'discard', index: 1, reason: 'button' })
    await settle(100)

    p = dialog.alert('Heads up')
    await settle(250)
    expect(document.querySelectorAll('.dialog-footer button')).toHaveLength(1)
    ;(document.querySelector('dialog .btn-close') as HTMLElement).click()
    expect(await p).toMatchObject({ confirmed: false, button: null, index: -1, reason: 'close' })
  })
})
