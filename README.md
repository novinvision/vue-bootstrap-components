<div align="center">

# vue3-bootstrap-components

**Bootstrap 6 components for Vue 3** — Bootstrap JavaScript is loaded lazily and unloaded when no longer used, every Bootstrap event is emitted, every option is a typed prop, and no CSS is bundled.

[English](#english) · [فارسی](#فارسی)

</div>

---

<a id="english"></a>

# English

> **v3** targets **Bootstrap 6** (`bootstrap@^6.0.0-alpha.1`). Need Bootstrap 5? Stay on `vue3-bootstrap-components@2.1.4`. See [Migrating from v2](#migrating-from-v2).

## Contents

- [Features](#features) · [Installation](#installation) · [Load Bootstrap CSS yourself](#load-bootstrap-css-yourself) · [Usage](#usage)
- [How lazy loading works](#how-lazy-loading-works) · [Events](#events) · [Props & v-model](#props--v-model) · [Programmatic control](#programmatic-control) · [Toasts](#toasts) · [Plugins: bsToast & bsDialog](#plugins-bstoast-and-bsdialog)
- [IDE support & imports](#ide-support--imports) · [SSR / Inertia.js](#ssr--inertiajs) · [Component reference](#component-reference) · [Migrating from v2](#migrating-from-v2) · [Notes](#notes)

## Features

- All Bootstrap 6 components, from Accordion to Tooltip, including the new ones: **Avatar, Chips, Combobox, Datepicker, Nav overflow, OTP input, Password strength, Stepper, Toggler, Prose**.
- Bootstrap's JavaScript is imported **only when a component that needs it is mounted** and released when the last such component is unmounted.
- Every Bootstrap event (`show.bs.dialog`, `slid.bs.carousel`, `change.bs.combobox` ...) is emitted as a Vue event with the original event object.
- Every Bootstrap option is a typed, documented prop; `v-model` where it makes sense.
- **No CSS is shipped or injected.** You load Bootstrap's stylesheet.
- ESM-only, tree-shakeable, fully typed (`.d.ts` for every component), Volar/IDE friendly.

## Installation

```bash
npm install vue3-bootstrap-components bootstrap@6.0.0-alpha.1
```

`@floating-ui/dom` (used by Menu, Tooltip, Popover, Combobox and Nav overflow) is installed automatically as a dependency of this package. Only the Datepicker needs an extra optional peer:

```bash
npm install vanilla-calendar-pro      # Datepicker only
```

Requires **Vue ≥ 3.4**.

## Load Bootstrap CSS yourself

The package never loads Bootstrap styles. Import them once in your entry file (or use a CDN `<link>`, or compile your own Sass):

```js
// main.js
import 'bootstrap/dist/css/bootstrap.min.css'
```

## Usage

### 1. Global registration (plugin)

```js
import { createApp } from 'vue'
import Vue3BootstrapComponents from 'vue3-bootstrap-components'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App)
  .use(Vue3BootstrapComponents, {
    // prefix: 'Bs',                  // default '' → <Button>; use 'Bs' for <BsButton>
    // only: ['Button', 'Dialog'],// register a subset
    // toast: { placement: 'top-end', delay: 4000 } // defaults for the toast API
  })
  .mount('#app')
```

### 2. Local imports (recommended — tree-shakeable)

```vue
<script setup>
import { Button, Dialog, DialogBody } from 'vue3-bootstrap-components'
// or per component folder:
// import { Dialog } from 'vue3-bootstrap-components/components/Dialog'
</script>
```

Every component is a PascalCase named export (`Button`, `Dialog`, `Menu` ...), so IDEs auto-import it. Use them in SFCs / render functions (PascalCase is always treated as a component, never as the native tag). If a name clashes with one of your own components, import with an alias (`import { Dialog as BsDialog } from '...'`) or register globally with `prefix: 'Bs'`. In-DOM templates (inside plain HTML files) are case-insensitive, so use a prefix there and kebab-case (`<bs-dialog>`).

## How lazy loading works

1. Components render without any Bootstrap JavaScript (also on the server).
2. On `onMounted`, the component asks the loader for its plugin. The first request does `import('bootstrap/js/dist/<plugin>.js')` — your bundler turns this into a separate chunk that is downloaded only when needed.
3. The loader is **reference counted** per plugin. When the **last** component of a plugin is unmounted it
   - disposes every remaining Bootstrap instance of that plugin,
   - removes all listeners Bootstrap registered on `document`/`window` for it,
   - drops its references.
4. Mounting again later simply loads and wires everything up again.

> ES modules cannot be evicted from the browser's module cache, so the *code* of an already downloaded plugin stays cached; what is unloaded is everything that is alive (instances, DOM listeners, references). Bootstrap's `data-bs-*` data API is intentionally **not** active while using this package — behavior is driven by Vue. Use the provided components (`DialogTrigger`, `CollapseTrigger`, `DialogClose`, ...) or `data-bs-dismiss="dialog|drawer"` *inside* a Dialog/Drawer.

You can inspect the loader at any time:

```js
import { getLoaderState } from 'vue3-bootstrap-components'
getLoaderState() // { dialog: { references: 1, loaded: true, instances: 1 }, ... }
```

## Events

Each Bootstrap event is emitted with the same short name (without the `.bs.<plugin>` suffix). The payload is Bootstrap's native event object (with `relatedTarget`, `value`, ... attached). Cancelable events can be cancelled with `event.preventDefault()`.

```vue
<Dialog v-model="open"
  @show="e => e.preventDefault()"      <!-- cancel opening -->
  @shown="onShown"
  @hide-prevented="onHidePrevented" />
```

Multi-word events use camelCase in `emit` and kebab-case in templates (`@hide-prevented`, `@strength-change`).

## Props & v-model

Every Bootstrap option (see Bootstrap's docs) is a prop with the same name. Changing a prop recreates the Bootstrap instance. Open/close components (`Dialog`, `Drawer`, `Collapse`, `Toast`, `Menu`, `Tooltip`, `Popover`) support `v-model` (boolean). `Tabs`, `Carousel`, `Chips`, `Combobox`, `Datepicker`, `OtpInput`, `FormRange` and form controls support `v-model` with their natural value.

## Programmatic control

- **By template ref:** `ref.value.show()`, `.hide()`, `.toggle()`, `.getInstance()` (the raw Bootstrap instance).
- **By name, from anywhere:**

```js
import { useOverlay } from 'vue3-bootstrap-components'
useOverlay('confirm').show()      // <Dialog name="confirm">
useOverlay('main-nav').toggle()   // <Collapse name="main-nav"> / <Drawer name="main-nav">
```

## Toasts

```js
import { useBsToast } from 'vue3-bootstrap-components'
const toast = useBsToast()                // also available as this.$bsToast
toast.success('Saved')                    // primary | accent | secondary | success | danger | warning | info | inverse
toast('Message', 'info', 'Title', '2 min ago', { placement: 'top-center', delay: 3000, autohide: true })
const id = toast.danger('Failed', 'Error', null, { autohide: false })
toast.dismiss(id); toast.clear()
```

Placements: `top|middle|bottom` + `start|center|end`. Options: `animation`, `autohide`, `delay`, `placement`, `maxVisible`.

## Plugins: `bsToast` and `bsDialog`

Two small plugins that you can install independently of the component plugin. Once installed they are available as `this.$bsToast` / `this.$bsDialog` (Options API), `inject('bsToast')` / `inject('bsDialog')`, and through `useBsToast()` / `useBsDialog()` in `<script setup>`.

```js
import { createApp } from 'vue'
import { bsToast, bsDialog } from 'vue3-bootstrap-components'
// or: import bsToast from 'vue3-bootstrap-components/plugins/toast'

createApp(App)
  .use(bsToast, { placement: 'top-end', delay: 4000 })
  .use(bsDialog, { confirmText: 'Yes', cancelText: 'No', dir: 'rtl' })   // defaults for every call
  .mount('#app')
```

(`app.use(Vue3BootstrapComponents)` installs both for you.)

### `$bsDialog` — promise-based confirm / alert

Every call resolves (it never rejects) with `{ confirmed, button, index, reason }`:

| Field | Meaning |
|---|---|
| `confirmed` | `true` only if a *confirm* button was clicked |
| `button` | `value` of the clicked button (`'confirm'` / `'cancel'` by default), `null` if dismissed |
| `index` | index of the clicked button, `-1` if dismissed |
| `reason` | `'button'`, `'close'` (header ×), `'escape'` or `'backdrop'` |

```js
// Options API
const { confirmed } = await this.$bsDialog.confirm('Delete this item?', 'Confirm', { confirmTheme: 'danger', confirmText: 'Delete' })
if (confirmed) remove()

this.$bsDialog.confirm('Publish now?').then(result => { if (result.confirmed) publish() })
this.$bsDialog.alert('Saved successfully', 'Done')

// custom buttons
const r = await this.$bsDialog({
  title: 'Unsaved changes', message: 'What do you want to do?', backdrop: 'static', size: 'sm',
  buttons: [
    { text: 'Save', value: 'save', confirm: true, theme: 'success' },
    { text: 'Discard', value: 'discard', theme: 'danger', variant: 'outline' },
    { text: 'Cancel', value: 'cancel', variant: 'text' }
  ]
})
r.button // 'save' | 'discard' | 'cancel' | null
```

```vue
<script setup>
import { useBsDialog } from 'vue3-bootstrap-components'
const dialog = useBsDialog()
async function onDelete() { if ((await dialog.confirm('Sure?')).confirmed) { /* … */ } }
</script>
```

Methods: `$bsDialog(options | message)`, `.show()`, `.confirm(message, title?, options?)`, `.alert(message, title?, options?)`, `.closeAll()`.

| Option | Type | Default | Description |
|---|---|---|---|
| `title` / `message` | `string` | — | Header and body text |
| `html` | `boolean` | `false` | Render `message` as HTML (trusted content only) |
| `buttons` | `{ text, value?, confirm?, theme?, variant?, size?, class?, disabled?, autofocus? }[]` | confirm/cancel | Custom buttons |
| `confirmText` / `cancelText` | `string` | `'OK'` / `'Cancel'` | Default button labels |
| `confirmTheme` / `cancelTheme` | `ThemeColor` | `'primary'` / `'secondary'` | Default button colors |
| `confirmVariant` / `cancelVariant` | button variant | `'solid'` / `'subtle'` | Default button styles |
| `showCancel` | `boolean` | `true` (`false` for `alert`) | Show the cancel button |
| `showClose` / `closeLabel` | `boolean` / `string` | `true` / `'Close'` | Header close button |
| `backdrop` | `boolean \| 'static'` | `true` | Bootstrap option (`'static'` = not dismissable by outside click) |
| `keyboard` / `modal` | `boolean` | `true` | Bootstrap options |
| `size` | `'sm'\|'lg'\|'xl'\|'fullscreen'` | — | Dialog size |
| `fullscreenBelow` | `'sm'\|'md'\|'lg'` | — | Fullscreen below a breakpoint |
| `scrollable` / `instant` | `boolean` | `false` | Modifier classes |
| `animation` | `'slide-up'\|'slide-down'` | — | Entry animation |
| `dir` | `'rtl'\|'ltr'` | — | Text direction |
| `class` | `string` | — | Extra classes on the `<dialog>` |

Each call mounts a temporary dialog and removes it (and releases the lazily loaded Bootstrap `dialog` plugin) when it closes.

### `$bsToast`

```js
this.$bsToast.success('Saved')
this.$bsToast('Message', 'info', 'Title', '2 min ago', { placement: 'top-center', delay: 3000 })
```

See [Toasts](#toasts) for all options.

## IDE support & imports

- `package.json` `exports` expose the root entry, `./plugin`, `./composables`, `./components/*` and `./global`, each with its own `.d.ts`.
- Every component has JSDoc-documented props and typed emits, so completion and hover docs work in VS Code (Volar), WebStorm and others.
- For autocompletion of **globally registered** components add this to `tsconfig.json`:

```json
{ "compilerOptions": { "types": ["vue3-bootstrap-components/global"] } }
```

## SSR / Inertia.js

Nothing from Bootstrap runs on the server — plugins are loaded in `onMounted`. Dialogs, Drawers, Menus, Popovers and Tooltips close automatically on Inertia GET visits (`closeOnInertia`, default `true`).

## Component reference

Conventions: *Theme colors* (`ThemeColor`) are `primary | accent | success | danger | warning | info | inverse | secondary`. *Breakpoints* are `sm | md | lg | xl | 2xl`. Any Bootstrap option listed as "Bootstrap option" has the same meaning as in Bootstrap's documentation.

### Content & layout

#### Accordion

Native `<details>`-based accordion (no JavaScript needed in Bootstrap 6).

**Exports:** `Accordion`, `AccordionItem`

| Prop | Type | Default | Description |
|---|---|---|---|
| Accordion · `exclusive` | `boolean` | `false` | Only one item open at a time |
| Accordion · `small / gap / flush` | `boolean` | `false` | `.accordion-sm`, `.accordion-gap`, `.accordion-flush` |
| AccordionItem · `title` | `string` | `—` | Header text (or `title` slot) |
| AccordionItem · `modelValue` | `boolean` | `—` | Open state (`v-model`) |
| AccordionItem · `theme` | `ThemeColor` | `—` | Theme color of the open item |

| Event | Payload | Description |
|---|---|---|
| `toggle` | `native event` | Native `<details>` toggle event (AccordionItem) |
| `update:modelValue` | `boolean` | Item opened/closed |

```vue
<Accordion exclusive>
  <AccordionItem title="Item 1" v-model="open1">Content 1</AccordionItem>
  <AccordionItem title="Item 2">Content 2</AccordionItem>
</Accordion>
```

#### Alert

Alert with optional dismiss button (Bootstrap `alert` plugin).

**Exports:** `Alert`, `AlertHeading`, `AlertLink`

**Bootstrap JS loaded lazily:** `alert`

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `ThemeColor` | `'warning'` | `.theme-*` color |
| `dismissible` | `boolean` | `false` | Show close button |
| `modelValue` | `boolean` | `true` | Visibility (`v-model`) |
| `instant` | `boolean` | `false` | No fade (`.alert-instant`) |
| `closeLabel` | `string` | `'Close'` | Close button aria-label |

| Event | Payload | Description |
|---|---|---|
| `close` | `BsEvent` | `close.bs.alert` — cancelable |
| `closed` | `BsEvent` | `closed.bs.alert` |
| `update:modelValue` | `boolean` | Fired when it opens/closes |

```vue
<Alert theme="success" dismissible @closed="onClosed">
  <AlertHeading>Done</AlertHeading> Saved successfully.
</Alert>
```

#### Avatar

User avatar with image/initials and presence status; stack several avatars.

**Exports:** `Avatar`, `AvatarStack`

| Prop | Type | Default | Description |
|---|---|---|---|
| `src / alt` | `string` | `—` | Image |
| `initials` | `string` | `—` | Fallback text |
| `size` | `'xs'\|'sm'\|'lg'\|'xl'` | `—` | Size |
| `status` | `'online'\|'offline'\|'away'\|'busy'` | `—` | Presence dot |
| `subtle` | `boolean` | `false` | Tinted background |
| `theme` | `ThemeColor` | `—` | Color for initials avatars |
| AvatarStack · `size` | `'xs'\|'sm'\|'lg'\|'xl'` | `—` | Stack size |

```vue
<AvatarStack size="sm">
  <Avatar src="/u1.jpg" alt="A" /><Avatar initials="MK" status="online" />
</AvatarStack>
```

#### Badge

Badge.

**Exports:** `Badge`

| Prop | Type | Default | Description |
|---|---|---|---|
| `theme` | `ThemeColor` | `'primary'` | Theme color |
| `variant` | `'solid'\|'subtle'\|'outline'` | `'solid'` | Style |
| `large` | `boolean` | `false` | `.badge-lg` |
| `pill` | `boolean` | `false` | `.rounded-pill` |
| `as` | `string` | `'span'` | Tag |

```vue
<Badge theme="danger" variant="subtle">New</Badge>
```

#### Breadcrumb

Breadcrumb with divider items (Bootstrap 6 markup).

**Exports:** `Breadcrumb`, `BreadcrumbItem`

| Prop | Type | Default | Description |
|---|---|---|---|
| Breadcrumb · `label` | `string` | `'breadcrumb'` | Nav aria-label |
| BreadcrumbItem · `href` | `string` | `—` | Link |
| BreadcrumbItem · `active` | `boolean` | `false` | Current page |
| BreadcrumbItem · `divider` | `boolean` | `true` | Divider before item (set `false` on the first) |
| BreadcrumbItem · `separator` | `string` | `—` | Custom divider text such as `/` (default chevron) |

```vue
<Breadcrumb>
  <BreadcrumbItem href="/" :divider="false">Home</BreadcrumbItem>
  <BreadcrumbItem active>Library</BreadcrumbItem>
</Breadcrumb>
```

#### Button

Buttons (Bootstrap 6: `variant` + `theme`), checkbox/radio toggle buttons, groups and toolbars. See also **Close button**.

**Exports:** `Button`, `ToggleButton`, `ButtonGroup`, `ButtonToolbar`

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `'solid'\|'outline'\|'subtle'\|'text'\|'styled'\|'link'` | `'solid'` | Button style (`.btn-solid` ...) |
| `theme` | `ThemeColor` | `'primary'` | `.theme-*` |
| `size` | `'xs'\|'sm'\|'lg'` | `—` | Size |
| `icon` | `boolean` | `false` | `.btn-icon` |
| `href` | `string` | `—` | Renders `<a>` |
| `type` | `'button'\|'submit'\|'reset'` | `'button'` | Button type |
| `active / disabled` | `boolean` | `false` | State |
| `toggle + pressed` | `boolean` | `false` | Toggle button, `v-model:pressed` |
| ToggleButton · `modelValue, type, value, name` | `—` | `—` | `.btn-check` toggle (checkbox/radio) |
| ButtonGroup · `vertical / divider / size / label` | `boolean / boolean / 'xs'\|'sm'\|'lg' / string` | `false` | `.btn-group-vertical`, `.btn-group-divider`, `.btn-group-sm`, `aria-label` |
| ButtonToolbar · `label` | `string` | `—` | Toolbar aria-label |

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Click |
| `update:pressed` | `boolean` | Toggle state |

```vue
<Button theme="danger" variant="outline" size="sm" @click="remove">Delete</Button>
<ButtonGroup><Button>A</Button><Button>B</Button></ButtonGroup>
```

#### CloseButton

Close button. Inside an Alert, Toast, Dialog or Drawer it closes the nearest parent automatically (like `data-bs-dismiss`); or point it at any component with `target`.

**Exports:** `CloseButton`

| Prop | Type | Default | Description |
|---|---|---|---|
| `dismiss` | `'alert'\|'toast'\|'dialog'\|'drawer'` | `auto` | Force which kind of parent to close (default: nearest) |
| `target` | `string` | `—` | `name` of any Dialog/Drawer/Toast/Collapse to close instead |
| `label` | `string` | `'Close'` | aria-label |
| `disabled` | `boolean` | `false` | Disabled |

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Before the parent closes; `event.preventDefault()` keeps it open |

```vue
<Alert theme="info">Hello <CloseButton class="ms-auto" /></Alert>
<Dialog name="d"><DialogHeader><DialogTitle>T</DialogTitle><CloseButton /></DialogHeader></Dialog>
<CloseButton target="d" />  <!-- closes the dialog named "d" from anywhere -->
```

#### Card

Card and its parts.

**Exports:** `Card`, `CardHeader`, `CardBody`, `CardFooter`, `CardTitle`, `CardSubtitle`, `CardText`, `CardImg`, `CardImgOverlay`, `CardGroup`

| Prop | Type | Default | Description |
|---|---|---|---|
| Card · `subtle / translucent / row` | `boolean` | `false` | `.card-subtle`, `.card-translucent`, `.card-row` |
| Card · `theme` | `ThemeColor` | `—` | Theme color |
| CardImg · `src, alt, position` | `'top'\|'bottom'\|'start'\|'end'\|'none'` | `'top'` | Image placement |

```vue
<Card>
  <CardImg src="/a.jpg" alt="" />
  <CardBody><CardTitle>Title</CardTitle><CardText>Text</CardText></CardBody>
</Card>
```

#### Container

Container.

**Exports:** `Container`

| Prop | Type | Default | Description |
|---|---|---|---|
| `fluid` | `boolean` | `false` | `.container-fluid` |
| `breakpoint` | `'sm'\|'md'\|'lg'\|'xl'\|'2xl'` | `—` | Responsive container (`.md:container`) |

```vue
<Container breakpoint="lg">…</Container>
```

#### ListGroup

List group.

**Exports:** `ListGroup`, `ListGroupItem`

| Prop | Type | Default | Description |
|---|---|---|---|
| ListGroup · `flush / numbered / horizontal` | `boolean \| breakpoint` | `false` | Modifiers |
| ListGroupItem · `action, href, active, disabled, theme` | `—` | `—` | Interactive item (`<a>`/`<button>`) |

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Item click |

```vue
<ListGroup>
  <ListGroupItem action href="/a" active>A</ListGroupItem>
  <ListGroupItem>B</ListGroupItem>
</ListGroup>
```

#### Pagination

Pager. Feed it a Laravel/Inertia paginator `links` array, or `currentPage` + `lastPage`.

**Exports:** `Pagination`

| Prop | Type | Default | Description |
|---|---|---|---|
| `links` | `PaginationLink[]` | `—` | Laravel paginator links |
| `currentPage / lastPage` | `number` | `—` | Alternative to `links` |
| `siblings` | `number` | `2` | Pages around the current one |
| `size` | `'sm'\|'lg'` | `—` | Size |
| `hideSinglePage` | `boolean` | `true` | Hide with one page |
| `nofollow` | `boolean` | `true` | `rel="nofollow"` on links |

| Event | Payload | Description |
|---|---|---|
| `page` | `{ page, url, event }` | A page was clicked |

```vue
<Pagination :links="users.links" @page="({ url }) => router.visit(url)" />
```

#### Placeholder

Loading placeholders: `Placeholder` bars (`.placeholder.col-*`) inside a `PlaceholderWrap` that provides the animation.

**Exports:** `Placeholder`, `PlaceholderWrap`

| Prop | Type | Default | Description |
|---|---|---|---|
| Placeholder · `cols` | `number` | `—` | Grid width 1–12 (`.col-6`) |
| Placeholder · `size` | `'xs'\|'sm'\|'lg'` | `—` | Size |
| Placeholder · `width` | `string` | `—` | CSS width |
| PlaceholderWrap · `animation` | `'glow'\|'wave'\|'pulse'` | `'glow'` | Animation |

```vue
<PlaceholderWrap animation="wave">
  <Placeholder :cols="6" /> <Placeholder :cols="4" size="lg" />
</PlaceholderWrap>
```

#### Progress

Progress bar.

**Exports:** `Progress`, `ProgressStacked`

| Prop | Type | Default | Description |
|---|---|---|---|
| `value / min / max` | `number` | `0 / 0 / 100` | Value range |
| `theme` | `ThemeColor` | `—` | Color |
| `striped / animated` | `boolean` | `false` | Style |
| `label` | `string \| boolean` | `—` | Text (`true` = percent) |
| `height` | `string` | `—` | CSS height |
| `stacked` | `boolean` | `false` | Inside `ProgressStacked`: width goes on `.progress` |

```vue
<Progress :value="60" theme="success" label striped />
<ProgressStacked>
  <Progress stacked :value="15" /> <Progress stacked :value="30" theme="success" />
</ProgressStacked>
```

#### Spinner

Spinner.

**Exports:** `Spinner`

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | `'border'\|'grow'\|'rotate'` | `'border'` | Type |
| `small` | `boolean` | `false` | `.spinner-sm` |
| `label` | `string` | `'Loading...'` | Screen-reader text |

```vue
<Spinner type="grow" small />
```

#### Stepper

Stepper (new in Bootstrap 6).

**Exports:** `Stepper`, `StepperItem`

| Prop | Type | Default | Description |
|---|---|---|---|
| Stepper · `horizontal` | `boolean \| breakpoint` | `false` | `.stepper-horizontal` or `.sm:stepper-horizontal` (needs `.contains-inline` parent) |
| Stepper · `overflow` | `boolean` | `false` | Wraps in `.stepper-overflow` for scrolling |
| StepperItem · `active` | `boolean` | `false` | Completed/current step |
| StepperItem · `theme` | `ThemeColor` | `—` | Theme color |

```vue
<Stepper horizontal>
  <StepperItem active>Account</StepperItem>
  <StepperItem active theme="success">Email</StepperItem>
  <StepperItem>Profile</StepperItem>
</Stepper>
```

#### Prose

Scope for rich-text typography (`.prose`, new in Bootstrap 6).

**Exports:** `Prose`

| Prop | Type | Default | Description |
|---|---|---|---|
| `as` | `string` | `'div'` | Tag |

```vue
<Prose v-html="article.body" />
```

### Forms

#### Form

Form building blocks. `FormRange` uses the Bootstrap `range` plugin.

**Exports:** `FormField`, `FormControl`, `Check`, `Radio`, `Switch`, `FormRange`, `InputGroup`, `InputGroupText`, `InputGroupButton`, `FormAdorn`, `FormAdornIcon`, `FormAdornText`

**Bootstrap JS loaded lazily:** `range (FormRange)`

| Prop | Type | Default | Description |
|---|---|---|---|
| FormControl · `v-model, as, type, valid, invalid` | `—` | `as='input'` | `input` / `textarea` / `select` |
| Check / Switch · `v-model, label, value, size, disabled` | `—` | `—` | Boolean or array model |
| Radio · `v-model, value, label` | `—` | `—` | Radio |
| FormRange · `v-model, min, max, step, bubble, formatter` | `—` | `—` | Range with value bubble |
| InputGroup · `size` | `'sm'\|'lg'` | `—` | Input group size |

| Event | Payload | Description |
|---|---|---|
| `changed` | `{ value }` | FormRange: `changed.bs.range` |

```vue
<FormField><Check v-model="agree" label="I agree" /></FormField>
<FormControl v-model="name" placeholder="Name" />
<FormRange v-model="volume" :min="0" :max="100" bubble @changed="onChanged" />
```

### Overlays & interactive

#### Dialog

Native `<dialog>` modal (replaces Bootstrap 5 Modal).

**Exports:** `Dialog`, `DialogHeader`, `DialogTitle`, `DialogBody`, `DialogFooter`, `DialogClose`, `DialogButton`, `DialogTrigger`

**Bootstrap JS loaded lazily:** `dialog`

| Prop | Type | Default | Description |
|---|---|---|---|
| DialogButton · `name` | `string` | `required` | `name` of the dialog to open (like `data-bs-target`) |
| DialogButton · `action` | `'toggle'\|'show'\|'hide'` | `'toggle'` | What the click does |
| DialogButton · `variant / theme / size / icon / disabled / active` | `—` | `'solid' / 'primary'` | Same as `Button` |
| `name` | `string` | `—` | Id; lets `useOverlay(name)` and `DialogTrigger` control it |
| `modelValue` | `boolean` | `false` | Open state (`v-model`) |
| `backdrop` | `boolean \| 'static'` | `true` | Bootstrap option `backdrop` |
| `keyboard` | `boolean` | `true` | Close with Esc |
| `modal` | `boolean` | `true` | `false` = non-modal |
| `size` | `'sm'\|'lg'\|'xl'\|'fullscreen'` | `—` | `.dialog-sm` 280px, `-lg` 800px, `-xl` 1140px |
| `fullscreenBelow` | `'sm'\|'md'\|'lg'` | `—` | `.md-down:dialog-fullscreen` |
| `scrollable` | `boolean` | `false` | `.dialog-scrollable` |
| `animation` | `'slide-up'\|'slide-down'` | `—` | Entry animation |
| `instant` | `boolean` | `false` | No animation |
| `title` | `string` | `—` | Quick header with close button |
| `closeOnInertia` | `boolean` | `true` | Hide on Inertia visit |

| Event | Payload | Description |
|---|---|---|
| `click (DialogButton)` | `MouseEvent` | Before opening; `preventDefault()` cancels |
| `show` | `BsEvent` | `show.bs.dialog` — cancelable (`event.preventDefault()`) |
| `shown` | `BsEvent` | `shown.bs.dialog` |
| `hide` | `BsEvent` | `hide.bs.dialog` — cancelable |
| `hidden` | `BsEvent` | `hidden.bs.dialog` |
| `hidePrevented` | `BsEvent` | `hidePrevented.bs.dialog` |
| `cancel` | `BsEvent` | `cancel.bs.dialog` (Esc) |
| `update:modelValue` | `boolean` | Fired when it opens/closes |

```vue
<DialogButton name="confirm" theme="danger">Open dialog</DialogButton>

<Dialog name="confirm" backdrop="static" @shown="onShown" @hide-prevented="shake">
  <DialogHeader><DialogTitle>Confirm</DialogTitle><CloseButton /></DialogHeader>
  <DialogBody>Are you sure?</DialogBody>
  <DialogFooter><DialogClose>Cancel</DialogClose><Button @click="ok">OK</Button></DialogFooter>
</Dialog>

<!-- or control it with v-model / useOverlay('confirm').show() -->
```

#### Drawer

Slide-in panel (replaces Bootstrap 5 Offcanvas).

**Exports:** `Drawer`, `DrawerHeader`, `DrawerTitle`, `DrawerBody`, `DrawerFooter`, `DrawerClose`, `DrawerButton`, `DrawerTrigger`

**Bootstrap JS loaded lazily:** `drawer`

| Prop | Type | Default | Description |
|---|---|---|---|
| DrawerButton · `name` | `string` | `required` | `name` of the drawer to open |
| DrawerButton · `action` | `'toggle'\|'show'\|'hide'` | `'toggle'` | What the click does (also sets `aria-expanded`) |
| DrawerButton · `variant / theme / size / icon / disabled / active` | `—` | `'solid' / 'primary'` | Same as `Button` |
| `name` | `string` | `—` | Id; lets `useOverlay(name)` and `DrawerTrigger` control it |
| `modelValue` | `boolean` | `false` | Open state (`v-model`) |
| `placement` | `'start'\|'end'\|'top'\|'bottom'\|'fullscreen'` | `'start'` | Edge (or fullscreen) |
| `backdrop` | `boolean \| 'static'` | `true` | Bootstrap option |
| `keyboard` | `boolean` | `true` | Close with Esc |
| `scroll` | `boolean` | `false` | Allow page scroll |
| `responsive` | `breakpoint` | `—` | Inline from breakpoint (`.md:drawer`) |
| `sheet / fitContent / translucent / instant` | `boolean` | `false` | Modifier classes |
| `title` | `string` | `—` | Quick header |

| Event | Payload | Description |
|---|---|---|
| `show` | `BsEvent` | `show.bs.drawer` — cancelable (`event.preventDefault()`) |
| `shown` | `BsEvent` | `shown.bs.drawer` |
| `hide` | `BsEvent` | `hide.bs.drawer` — cancelable |
| `hidden` | `BsEvent` | `hidden.bs.drawer` |
| `hidePrevented` | `BsEvent` | `hidePrevented.bs.drawer` |
| `update:modelValue` | `boolean` | Fired when it opens/closes |

```vue
<DrawerButton name="menu">Open menu</DrawerButton>

<Drawer name="menu" placement="end" title="Menu">
  <DrawerBody>…</DrawerBody>
</Drawer>
```

#### Collapse

Collapsible region.

**Exports:** `Collapse`, `CollapseTrigger`

**Bootstrap JS loaded lazily:** `collapse`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `—` | Id; lets `useOverlay(name)` and `CollapseTrigger` control it |
| `modelValue` | `boolean` | `false` | Open state (`v-model`) |
| `parent` | `string` | `—` | Selector of a container: opening closes siblings |
| `horizontal` | `boolean` | `false` | `.collapse-horizontal` (give the child a width) |

| Event | Payload | Description |
|---|---|---|
| `show` | `BsEvent` | `show.bs.collapse` — cancelable (`event.preventDefault()`) |
| `shown` | `BsEvent` | `shown.bs.collapse` |
| `hide` | `BsEvent` | `hide.bs.collapse` — cancelable |
| `hidden` | `BsEvent` | `hidden.bs.collapse` |
| `update:modelValue` | `boolean` | Fired when it opens/closes |

```vue
<CollapseTrigger name="more"><Button>Toggle</Button></CollapseTrigger>
<Collapse name="more" @shown="log">Hidden content</Collapse>
```

#### Menu

Menu (replaces Bootstrap 5 Dropdown), with submenus. Uses Floating UI (installed automatically).

**Exports:** `Menu`, `MenuToggle`, `MenuContent`, `MenuItem`, `MenuHeader`, `MenuText`, `MenuDivider`, `Submenu`

**Bootstrap JS loaded lazily:** `menu (+ Floating UI)`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `—` | Id; lets `useOverlay(name)` and `useOverlay` control it |
| `modelValue` | `boolean` | `false` | Open state (`v-model`) |
| `autoClose` | `boolean \| 'inside' \| 'outside'` | `true` | Bootstrap option |
| `placement` | `string` | `'bottom-start'` | Supports responsive e.g. `bottom-start md:top-end` |
| `offset` | `[number, number]` | `[0, 2]` | Offset |
| `boundary / container / display / strategy / reference` | `—` | `—` | Bootstrap options |
| `floatingConfig` | `object \| fn` | `null` | Floating UI config |
| `submenuTrigger / submenuDelay` | `'hover'\|'click'\|'both' / number` | `'both' / 100` | Submenu behavior |
| `as` | `string` | `'div'` | Wrapper tag (`li` in navs) |
| MenuToggle · `variant, theme, size, split` | `—` | `'solid', 'secondary'` | Toggle button |
| MenuItem · `href, active, selected, disabled, theme, description, check` | `—` | `—` | Item; `selected` shows the check mark; `icon` slot |
| MenuContent · `scrollable / translucent` | `boolean` | `false` | `.menu-scrollable`, `.menu-translucent` |

| Event | Payload | Description |
|---|---|---|
| `show` | `BsEvent` | `show.bs.menu` — cancelable (`event.preventDefault()`) |
| `shown` | `BsEvent` | `shown.bs.menu` |
| `hide` | `BsEvent` | `hide.bs.menu` — cancelable |
| `hidden` | `BsEvent` | `hidden.bs.menu` |
| `update:modelValue` | `boolean` | Fired when it opens/closes |

```vue
<Menu placement="bottom-end" @shown="onShown">
  <MenuToggle>Actions</MenuToggle>
  <MenuContent>
    <MenuHeader>Account</MenuHeader>
    <MenuItem href="/profile">Profile</MenuItem>
    <MenuDivider />
    <Submenu><MenuItem>More</MenuItem><MenuContent><MenuItem>Sub item</MenuItem></MenuContent></Submenu>
  </MenuContent>
</Menu>
```

#### Tabs

Tabs. Buttons and panes are linked by `name`.

**Exports:** `Tabs`, `TabList`, `TabButton`, `TabContent`, `TabPane`

**Bootstrap JS loaded lazily:** `tab`

| Prop | Type | Default | Description |
|---|---|---|---|
| Tabs · `modelValue` | `string` | `first tab` | Active tab name (`v-model`) |
| Tabs · `fade` | `boolean` | `true` | Fade transition |
| Tabs · `listGroup` | `boolean` | `false` | Use list-group items as triggers |
| TabList · `variant` | `'tabs'\|'pills'\|'underline'\|'none'` | `'tabs'` | Nav style |
| TabList · `fill / justified / vertical` | `boolean` | `false` | Nav modifiers |
| TabButton · `name, disabled` | `string, boolean` | `—` | Tab id |
| TabPane · `name` | `string` | `—` | Matching tab |

| Event | Payload | Description |
|---|---|---|
| `show / shown / hide / hidden` | `BsEvent` | `*.bs.tab` (on Tabs and TabButton) |
| `update:modelValue` | `string` | Active tab changed |

```vue
<Tabs v-model="tab" @shown="onShown">
  <TabList variant="pills"><TabButton name="home">Home</TabButton><TabButton name="settings">Settings</TabButton></TabList>
  <TabContent><TabPane name="home">…</TabPane><TabPane name="settings">…</TabPane></TabContent>
</Tabs>
```

#### Toast

Declarative `<Toast>` and an imperative API via the **`bsToast` plugin** (`this.$bsToast`, `useBsToast()`).

**Exports:** `Toast`, `ToastContainer`, `useBsToast`

**Bootstrap JS loaded lazily:** `toast`

| Prop | Type | Default | Description |
|---|---|---|---|
| `name` | `string` | `—` | Id; lets `useOverlay(name)` and `useOverlay` control it |
| `modelValue` | `boolean` | `false` | Visibility (`v-model`) |
| `autohide / delay / animation` | `boolean / number / boolean` | `true / 5000 / true` | Bootstrap options |
| `theme` | `ThemeColor` | `—` | Color |
| `title / meta` | `string` | `—` | Header title and small text |
| `closable` | `boolean` | `true` | Close button |
| `translucent / instant` | `boolean` | `false` | Modifiers |

| Event | Payload | Description |
|---|---|---|
| `show` | `BsEvent` | `show.bs.toast` — cancelable (`event.preventDefault()`) |
| `shown` | `BsEvent` | `shown.bs.toast` |
| `hide` | `BsEvent` | `hide.bs.toast` — cancelable |
| `hidden` | `BsEvent` | `hidden.bs.toast` |
| `update:modelValue` | `boolean` | Fired when it opens/closes |

```vue
<!-- declarative -->
<Toast v-model="visible" theme="success" title="Saved" @hidden="onHidden">Profile updated</Toast>

<!-- imperative -->
const toast = useBsToast()
toast.success('Saved', 'Done', null, { placement: 'top-end', delay: 3000 })
toast('Hello', 'info')
```

#### Tooltip

Tooltip around any content. Uses Floating UI (installed automatically).

**Exports:** `Tooltip`

**Bootstrap JS loaded lazily:** `tooltip (+ Floating UI)`

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `required` | Tooltip text |
| `modelValue` | `boolean` | `false` | Open state (`v-model`) |
| `disabled` | `boolean` | `false` | Disable |
| `placement` | `FloatingPlacement` | `'top'` | Placement |
| `trigger` | `string` | `'hover focus'` | `hover`, `focus`, `click`, `manual` |
| `html / sanitize / animation` | `boolean` | `false / true / true` | Bootstrap options |
| `delay / offset / container / boundary` | `—` | `—` | Bootstrap options |
| `customClass / fallbackPlacements / allowList / sanitizeFn / template / floatingConfig` | `—` | `—` | Bootstrap options |
| `as` | `string` | `'span'` | Wrapper tag |

| Event | Payload | Description |
|---|---|---|
| `show` | `BsEvent` | `show.bs.tooltip` — cancelable (`event.preventDefault()`) |
| `shown` | `BsEvent` | `shown.bs.tooltip` |
| `hide` | `BsEvent` | `hide.bs.tooltip` — cancelable |
| `hidden` | `BsEvent` | `hidden.bs.tooltip` |
| `inserted` | `BsEvent` | `inserted.bs.tooltip` |
| `update:modelValue` | `boolean` | Fired when it opens/closes |

```vue
<Tooltip title="Copy" placement="bottom"><Button icon>⧉</Button></Tooltip>
```

#### Popover

Popover. Same options as Tooltip plus `content`; default trigger is `click`.

**Exports:** `Popover`

**Bootstrap JS loaded lazily:** `popover (+ Floating UI)`

| Prop | Type | Default | Description |
|---|---|---|---|
| `title / content` | `string` | `—` | Header / body (HTML with `html`) |
| `modelValue` | `boolean` | `false` | Open state (`v-model`) |
| `placement` | `FloatingPlacement` | `'right'` | Placement |
| `trigger` | `string` | `'click'` | Trigger |
| `…` | `—` | `—` | All Tooltip props |

| Event | Payload | Description |
|---|---|---|
| `show` | `BsEvent` | `show.bs.popover` — cancelable (`event.preventDefault()`) |
| `shown` | `BsEvent` | `shown.bs.popover` |
| `hide` | `BsEvent` | `hide.bs.popover` — cancelable |
| `hidden` | `BsEvent` | `hidden.bs.popover` |
| `inserted` | `BsEvent` | `inserted.bs.popover` |
| `update:modelValue` | `boolean` | Fired when it opens/closes |

```vue
<Popover title="Hello" content="Popover body" placement="top"><Button>Click</Button></Popover>
```

#### Carousel

Carousel (Bootstrap 6 scroll-snap carousel).

**Exports:** `Carousel`, `CarouselItem`

**Bootstrap JS loaded lazily:** `carousel`

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `number` | `0` | Active slide index (`v-model`) |
| `autoplay` | `boolean` | `false` | Bootstrap option |
| `ends` | `'loop'\|'wrap'\|'stop'` | `'loop'` | Behavior at the ends |
| `interval` | `number` | `5000` | ms |
| `keyboard / pause` | `boolean / 'hover'\|false` | `true / 'hover'` | Bootstrap options |
| `indicators / controls / playPause` | `boolean` | `true / true / false` | Built-in UI |
| `fade / center / auto / overlay` | `boolean` | `false` | Modifier classes (`.carousel-fade`, `-center`, `-auto`, `-overlay`) |
| `items / gap / peek` | `number / string / string` | `—` | `--bs-carousel-items`, `--bs-carousel-items-gap`, `--bs-carousel-items-peek` |
| `controlsPlacement` | `'top'\|'bottom'` | `'bottom'` | Where built-in controls sit when not overlaid |
| CarouselItem · `interval` | `number` | `—` | Per-slide delay (`data-bs-interval`) |

| Event | Payload | Description |
|---|---|---|
| `slide` | `{ relatedTarget, direction, from, to }` | `slide.bs.carousel` — cancelable |
| `slid` | `{ relatedTarget, direction, from, to }` | `slid.bs.carousel` |
| `update:modelValue` | `number` | Active slide changed |

```vue
<Carousel v-model="index" autoplay :interval="4000" @slid="onSlid">
  <CarouselItem><img src="/1.jpg" class="d-block w-100" alt=""></CarouselItem>
  <CarouselItem><img src="/2.jpg" class="d-block w-100" alt=""></CarouselItem>
</Carousel>
```

#### Chips

Tag/chip input (new in Bootstrap 6). `Chip` is a static chip.

**Exports:** `Chips`, `Chip`

**Bootstrap JS loaded lazily:** `chips`

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string[]` | `[]` | Chip values (`v-model`) |
| `separator` | `string \| null` | `','` | Creates a chip while typing |
| `allowDuplicates` | `boolean` | `false` | Allow duplicates |
| `maxChips` | `number \| null` | `null` | Limit |
| `placeholder / dismissible / dismissIcon / createOnBlur` | `—` | `—` | Bootstrap options |

| Event | Payload | Description |
|---|---|---|
| `add` | `{ value }` | `add.bs.chips` — cancelable |
| `remove` | `{ value, chip }` | `remove.bs.chips` — cancelable |
| `change` | `{ values }` | `change.bs.chips` |
| `select` | `{ selected }` | `select.bs.chips` |
| `update:modelValue` | `string[]` | Values changed |

```vue
<Chips v-model="tags" placeholder="Add tag…" :max-chips="5" @add="onAdd" />
```

#### Combobox

Searchable select (new in Bootstrap 6).

**Exports:** `Combobox`

**Bootstrap JS loaded lazily:** `combobox (+ menu, Floating UI)`

| Prop | Type | Default | Description |
|---|---|---|---|
| `options` | `{ value, label?, description?, disabled? }[]` | `required` | Options |
| `modelValue` | `string \| number \| array \| null` | `null` | Selected value(s) (`v-model`) |
| `multiple / search / searchNormalize` | `boolean` | `false` | Bootstrap options |
| `name` | `string` | `—` | Creates a hidden input for form posts |
| `placeholder / placement / offset / boundary` | `—` | `—` | Bootstrap options |
| `disabled / searchPlaceholder / noResultsText` | `—` | `—` | UI |

| Event | Payload | Description |
|---|---|---|
| `change` | `{ value, item }` | `change.bs.combobox` |
| `show / shown / hide / hidden` | `BsEvent` | `*.bs.combobox` |
| `update:modelValue` | `value` | Selection changed |

```vue
<Combobox v-model="country" :options="countries" search placeholder="Country" name="country" />
```

#### Datepicker

Date picker (new in Bootstrap 6). Needs `vanilla-calendar-pro`; model is `YYYY-MM-DD` string(s).

**Exports:** `Datepicker`

**Bootstrap JS loaded lazily:** `datepicker (+ vanilla-calendar-pro)`

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| string[] \| null` | `null` | Selected date(s) (`v-model`) |
| `selectionMode` | `'single'\|'multiple'\|'multiple-ranged'` | `'single'` | Mode |
| `inline` | `boolean` | `false` | Render calendar in place |
| `locale / firstWeekday` | `string / number` | `—` | Locale, e.g. `fa-IR` |
| `dateMin / dateMax / dateFormat / displayMonthsCount / placement / datepickerTheme / vcpOptions` | `—` | `—` | Bootstrap options |

| Event | Payload | Description |
|---|---|---|
| `change` | `BsEvent` | `change.bs.datepicker` |
| `show / shown / hide / hidden` | `BsEvent` | `*.bs.datepicker` |
| `update:modelValue` | `string \| string[] \| null` | Dates changed |

```vue
<Datepicker v-model="date" locale="en-US" placeholder="Pick a date" date-min="2026-01-01" />
```

#### OtpInput

One-time-code input (new in Bootstrap 6).

**Exports:** `OtpInput`

**Bootstrap JS loaded lazily:** `otp-input`

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string` | `''` | Code (`v-model`) |
| `length / groups / separator` | `number / number[] / string` | `—` | Slots layout |
| `type` | `'numeric'\|'alpha'\|'alphanumeric'` | `'numeric'` | Allowed characters |
| `mask` | `boolean` | `false` | Hide characters |
| `size / connected` | `'sm'\|'lg' / boolean` | `—` | Style |

| Event | Payload | Description |
|---|---|---|
| `complete` | `{ value }` | `complete.bs.otpInput` |
| `input` | `{ value }` | `input.bs.otpInput` |
| `update:modelValue` | `string` | Value changed |

```vue
<OtpInput v-model="code" :length="6" @complete="verify" />
```

#### Strength

Password strength meter (new in Bootstrap 6). Put the password input in the default slot.

**Exports:** `Strength`

**Bootstrap JS loaded lazily:** `strength`

| Prop | Type | Default | Description |
|---|---|---|---|
| `minLength` | `number` | `8` | Minimum length |
| `messages` | `{ weak, fair, good, strong }` | `English` | Labels |
| `weights / thresholds / scorer` | `—` | `—` | Scoring options |
| `input` | `string \| HTMLElement` | `auto` | Password input |
| `showText` | `boolean` | `true` | Label under the bar |

| Event | Payload | Description |
|---|---|---|
| `strengthChange` | `{ strength, score, password }` | `strengthChange.bs.strength` |

```vue
<Strength :messages="{ weak: 'Weak', strong: 'Strong' }" @strength-change="e => level = e.strength">
  <FormControl v-model="password" type="password" />
</Strength>
```

#### ScrollSpy

Highlights nav links following the scroll position.

**Exports:** `ScrollSpy`

**Bootstrap JS loaded lazily:** `scrollspy`

| Prop | Type | Default | Description |
|---|---|---|---|
| `target` | `string` | `required` | Selector of the nav |
| `smoothScroll` | `boolean` | `false` | Smooth scrolling |
| `rootMargin / threshold / topMargin` | `—` | `—` | Bootstrap options |
| `as` | `string` | `'div'` | Tag |

| Event | Payload | Description |
|---|---|---|
| `activate` | `{ relatedTarget }` | `activate.bs.scrollspy` |

```vue
<Nav id="toc" variant="pills"><NavItem><NavLink href="#a">A</NavLink></NavItem></Nav>
<ScrollSpy target="#toc" class="overflow-y-auto" style="height:300px"><section id="a">…</section></ScrollSpy>
```

#### Toggler

Toggles a class/attribute (`attribute` + `value`) on itself, or on every element matching `target` (new in Bootstrap 6).

**Exports:** `Toggler`

**Bootstrap JS loaded lazily:** `toggler`

| Prop | Type | Default | Description |
|---|---|---|---|
| `target` | `string` | `—` | Selector of element(s) to toggle; without it the component toggles itself |
| `attribute` | `string` | `'class'` | Attribute to toggle (not `id`) |
| `value` | `string \| number \| boolean` | `—` | Value to toggle — required |

| Event | Payload | Description |
|---|---|---|
| `toggle` | `BsEvent` | `toggle.bs.toggler` — cancelable (fired on the toggled element) |
| `toggled` | `BsEvent` | `toggled.bs.toggler` |

```vue
<Toggler target="#panel" attribute="class" value="bg-subtle-info">Highlight</Toggler>
<div id="panel">…</div>
```

### Navigation

#### Nav

Nav, and `NavOverflow` which moves items that do not fit into a menu (new in Bootstrap 6).

**Exports:** `Nav`, `NavItem`, `NavLink`, `NavOverflow`

**Bootstrap JS loaded lazily:** `nav-overflow (NavOverflow)`

| Prop | Type | Default | Description |
|---|---|---|---|
| Nav · `variant` | `'tabs'\|'pills'\|'underline'\|'none'` | `'none'` | Style |
| Nav · `fill / justified / vertical` | `boolean` | `false` | Modifiers |
| NavLink · `href, active, disabled` | `—` | `—` | Link |
| NavOverflow · `collapseBelow, iconPlacement, menuPlacement, menuStrategy, moreText, moreIcon, threshold` | `—` | `—` | Bootstrap options |

| Event | Payload | Description |
|---|---|---|
| `update / overflow / resize` | `BsEvent` | `*.bs.navoverflow` (NavOverflow) |

```vue
<NavOverflow @update="onUpdate"><Nav><NavItem><NavLink href="#" active>One</NavLink></NavItem></Nav></NavOverflow>
```

#### Navbar

Navbar. `NavbarToggler` can toggle a `Drawer`/`Collapse` by name.

**Exports:** `Navbar`, `NavbarBrand`, `NavbarNav`, `NavbarText`, `NavbarToggler`

| Prop | Type | Default | Description |
|---|---|---|---|
| Navbar · `expand` | `boolean \| breakpoint` | `false` | `.navbar-expand` / `.md:navbar-expand` |
| Navbar · `container` | `'fluid'\|'container'\|breakpoint\|false` | `'fluid'` | Inner container |
| Navbar · `dark / translucent` | `boolean` | `false` | `data-bs-theme="dark"`, `.navbar-translucent` |
| NavbarToggler · `target` | `string` | `—` | Name of the drawer/collapse (reflects `aria-expanded`) |

| Event | Payload | Description |
|---|---|---|
| `click` | `MouseEvent` | Toggler click |

```vue
<Navbar expand="md">
  <NavbarBrand href="/">Brand</NavbarBrand>
  <NavbarToggler target="main-nav" />
  <Drawer name="main-nav" placement="end" title="Menu">
    <DrawerBody><NavbarNav><NavItem><NavLink href="/" active>Home</NavLink></NavItem></NavbarNav></DrawerBody>
  </Drawer>
</Navbar>
```

## Migrating from v2

| v2 (Bootstrap 5) | v3 (Bootstrap 6) |
|---|---|
| `Modal` | `Dialog` (+ `DialogHeader/Title/Body/Footer/Close/Button`) |
| `OffCanvas` | `Drawer` (+ parts, `DrawerButton`) |
| `Dropdown` | `Menu`, `MenuToggle`, `MenuContent`, `MenuItem`, `Submenu` |
| `Tab` | `Tabs`, `TabList`, `TabButton`, `TabContent`, `TabPane` |
| `Toast` / `ToastContainer` / `$bsToast` | `Toast` / `ToastContainer` / `useBsToast()` / `$bsToast` |
| `Collapse`, `Accordion`, `Alert`, `Card`, `ListGroup`, `Nav`, `Spinner`, `Form` | same names |
| `.badge bg-*`, `text-bg-*` | `theme` prop (`.theme-*`) |
| `btn-primary`, `btn-outline-*` | `Button` `variant` + `theme` |

Breaking changes: ESM-only; Vue ≥ 3.4; Bootstrap 6 markup and classes; `data-bs-*` data API is disabled while the package is used; components no longer ship any CSS (v2 Pagination had a tiny stylesheet).

## Notes

- Bootstrap 6 is currently in alpha; its API may still change. This package pins `^6.0.0-alpha.1`.
- Combobox creates a `Menu` internally on its toggle element; Bootstrap 6 alpha logs a harmless "more than one instance per element" warning for this.
- Components that mutate their own DOM (Chips, Combobox, OTP, Strength, Nav overflow, Menu) render their inner markup once and let Bootstrap manage it; do not add reactive children inside Bootstrap-managed areas.

## License

ISC © NovinVision

---

<a id="فارسی"></a>

<div dir="rtl" align="right">

# فارسی

> **نسخه ۳** برای **بوت‌استرپ ۶** (`bootstrap@^6.0.0-alpha.1`) ساخته شده است. اگر هنوز از بوت‌استرپ ۵ استفاده می‌کنید روی `vue3-bootstrap-components@2.1.4` بمانید. بخش [مهاجرت از نسخه ۲](#مهاجرت-از-نسخه-۲) را ببینید.

## فهرست

- [ویژگی‌ها](#ویژگی‌ها) · [نصب](#نصب) · [لود CSS بوت‌استرپ](#لود-css-بوتاسترپ) · [نحوه‌ی استفاده](#نحوهی-استفاده)
- [لود و آن‌لود خودکار جاوااسکریپت](#لود-و-آنلود-خودکار-جاوااسکریپت) · [رویدادها](#رویدادها) · [Props و v-model](#props-و-v-model) · [کنترل برنامه‌نویسی](#کنترل-برنامهنویسی) · [Toast](#toast-دستوری)
- [پشتیبانی IDE و import](#پشتیبانی-ide-و-import) · [SSR و Inertia](#ssr-و-inertiajs) · [مرجع کامپوننت‌ها](#مرجع-کامپوننتها) · [مهاجرت از نسخه ۲](#مهاجرت-از-نسخه-۲) · [نکات](#نکات)

## ویژگی‌ها

- تمام کامپوننت‌های بوت‌استرپ ۶ از Accordion تا Tooltip، از جمله کامپوننت‌های جدید: **Avatar، Chips، Combobox، Datepicker، Nav overflow، OTP input، Password strength، Stepper، Toggler، Prose**.
- جاوااسکریپت بوت‌استرپ **فقط وقتی کامپوننتی که به آن نیاز دارد mount شود** لود می‌شود و با unmount شدن آخرین کامپوننت، آزاد (unload) می‌شود.
- تمام رویدادهای بوت‌استرپ (`show.bs.dialog`، `slid.bs.carousel`، `change.bs.combobox` و …) به صورت رویداد Vue و با همان event اصلی emit می‌شوند.
- تمام گزینه‌های بوت‌استرپ به صورت prop تایپ‌شده و مستند در دسترس‌اند؛ در جاهای مناسب `v-model` هم دارند.
- **هیچ CSS ای همراه پکیج نیست و تزریق نمی‌شود.** استایل بوت‌استرپ را خودتان لود می‌کنید.
- فقط ESM، قابل tree-shake، دارای تایپ کامل (`.d.ts` برای تک‌تک کامپوننت‌ها) و سازگار با IDE/Volar.

## نصب

```bash
npm install vue3-bootstrap-components bootstrap@6.0.0-alpha.1
```

پکیج `@floating-ui/dom` (مورد نیاز Menu، Tooltip، Popover، Combobox و Nav overflow) به صورت خودکار به عنوان dependency همراه این پکیج نصب می‌شود. فقط Datepicker به یک peer اختیاری نیاز دارد:

```bash
npm install vanilla-calendar-pro      # فقط برای Datepicker
```

به **Vue نسخه ۳.۴ یا بالاتر** نیاز دارد.

## لود CSS بوت‌استرپ

پکیج هیچ‌وقت استایل بوت‌استرپ را لود نمی‌کند. یک بار در فایل ورودی import کنید (یا از CDN یا Sass خودتان استفاده کنید):

```js
// main.js
import 'bootstrap/dist/css/bootstrap.min.css'
```

## نحوه‌ی استفاده

### ۱. ثبت سراسری (پلاگین)

```js
import { createApp } from 'vue'
import Vue3BootstrapComponents from 'vue3-bootstrap-components'
import 'bootstrap/dist/css/bootstrap.min.css'

createApp(App)
  .use(Vue3BootstrapComponents, {
    // prefix: 'Bs',                   // پیش‌فرض '' → <Button>؛ با 'Bs' می‌شود <BsButton>
    // only: ['Button', 'Dialog'], // ثبت فقط تعدادی کامپوننت
    // toast: { placement: 'top-end', delay: 4000 } // پیش‌فرض‌های API توست
  })
  .mount('#app')
```

### ۲. import محلی (پیشنهادی — tree-shake می‌شود)

```vue
<script setup>
import { Button, Dialog, DialogBody } from 'vue3-bootstrap-components'
// یا از پوشه‌ی هر کامپوننت:
// import { Dialog } from 'vue3-bootstrap-components/components/Dialog'
</script>
```

تمام کامپوننت‌ها به صورت named export با نام PascalCase (`Button`، `Dialog`، `Menu` و …) عرضه می‌شوند؛ بنابراین IDE آن‌ها را auto-import می‌کند. در SFC و render function استفاده کنید (نام PascalCase همیشه کامپوننت حساب می‌شود، نه تگ بومی). اگر نامی با کامپوننت خودتان تداخل داشت با alias ایمپورت کنید (`import { Dialog as BsDialog } from '...'`) یا هنگام ثبت سراسری `prefix: 'Bs'` بدهید. قالب‌های in-DOM (داخل فایل HTML ساده) به حروف بزرگ/کوچک حساس نیستند؛ آنجا از prefix و kebab-case (`<bs-dialog>`) استفاده کنید.

## لود و آن‌لود خودکار جاوااسکریپت

۱. کامپوننت‌ها بدون هیچ جاوااسکریپت بوت‌استرپی رندر می‌شوند (روی سرور هم).
۲. در `onMounted` کامپوننت از loader پلاگین خودش را می‌خواهد. اولین درخواست `import('bootstrap/js/dist/<plugin>.js')` را اجرا می‌کند؛ باندلر شما این را به chunk جدا تبدیل می‌کند که فقط در صورت نیاز دانلود می‌شود.
۳. loader برای هر پلاگین **شمارنده‌ی مرجع** دارد. وقتی **آخرین** کامپوننت آن پلاگین unmount شود:
   - تمام instanceهای باقی‌مانده‌ی آن پلاگین dispose می‌شوند،
   - تمام listenerهایی که بوت‌استرپ روی `document`/`window` ثبت کرده حذف می‌شوند،
   - ارجاع‌ها آزاد می‌شوند.
۴. در mount بعدی همه‌چیز دوباره لود و وصل می‌شود.

> ماژول‌های ES را نمی‌شود از cache مرورگر بیرون انداخت؛ یعنی *کد* پلاگینِ دانلودشده در cache می‌ماند، ولی هر چیزِ زنده (instanceها، listenerهای DOM، ارجاع‌ها) آزاد می‌شود. «data API» بوت‌استرپ (`data-bs-*`) عمداً هنگام استفاده از این پکیج غیرفعال است و رفتار توسط Vue کنترل می‌شود. از کامپوننت‌های آماده (`DialogTrigger`، `CollapseTrigger`، `DialogClose` و …) یا `data-bs-dismiss="dialog|drawer"` **داخل** Dialog/Drawer استفاده کنید.

وضعیت loader را هر زمان می‌توانید ببینید:

```js
import { getLoaderState } from 'vue3-bootstrap-components'
getLoaderState() // { dialog: { references: 1, loaded: true, instances: 1 }, ... }
```

## رویدادها

هر رویداد بوت‌استرپ با همان نام کوتاه (بدون پسوند `.bs.<plugin>`) emit می‌شود. داده‌ی ارسالی، خودِ event بوت‌استرپ است (به همراه `relatedTarget`، `value` و …). رویدادهای قابل لغو را می‌شود با `event.preventDefault()` لغو کرد.

```vue
<Dialog v-model="open"
  @show="e => e.preventDefault()"      <!-- جلوگیری از باز شدن -->
  @shown="onShown"
  @hide-prevented="onHidePrevented" />
```

رویدادهای چندکلمه‌ای در `emit` به صورت camelCase و در قالب به صورت kebab-case هستند (`@hide-prevented`، `@strength-change`).

## Props و v-model

تمام گزینه‌های بوت‌استرپ (مستندات بوت‌استرپ را ببینید) با همان نام به صورت prop در دسترس‌اند. تغییر prop باعث ساخت مجدد instance بوت‌استرپ می‌شود. کامپوننت‌های باز/بسته‌شونده (`Dialog`، `Drawer`، `Collapse`، `Toast`، `Menu`، `Tooltip`، `Popover`) از `v-model` بولین پشتیبانی می‌کنند. `Tabs`، `Carousel`، `Chips`، `Combobox`، `Datepicker`، `OtpInput`، `FormRange` و کنترل‌های فرم هم `v-model` با مقدار طبیعی خودشان دارند.

## کنترل برنامه‌نویسی

- **با template ref:** `ref.value.show()`، `.hide()`، `.toggle()` و `.getInstance()` (instance خام بوت‌استرپ).
- **با نام، از هر جای برنامه:**

```js
import { useOverlay } from 'vue3-bootstrap-components'
useOverlay('confirm').show()      // <Dialog name="confirm">
useOverlay('main-nav').toggle()   // <Collapse name="main-nav"> / <Drawer name="main-nav">
```

## Toast دستوری

```js
import { useBsToast } from 'vue3-bootstrap-components'
const toast = useBsToast()                // با this.$bsToast هم در دسترس است
toast.success('ذخیره شد')                 // primary | accent | secondary | success | danger | warning | info | inverse
toast('پیام', 'info', 'عنوان', '۲ دقیقه پیش', { placement: 'top-center', delay: 3000, autohide: true })
const id = toast.danger('خطا', 'مشکل', null, { autohide: false })
toast.dismiss(id); toast.clear()
```

جایگاه‌ها: `top|middle|bottom` + `start|center|end`. گزینه‌ها: `animation`، `autohide`، `delay`، `placement`، `maxVisible`.

## پلاگین‌ها: `bsToast` و `bsDialog`

دو پلاگین کوچک که مستقل از پلاگین کامپوننت‌ها نصب می‌شوند. بعد از نصب به صورت `this.$bsToast` و `this.$bsDialog` (Options API)، `inject('bsToast')` و `inject('bsDialog')` و در `<script setup>` با `useBsToast()` و `useBsDialog()` در دسترس‌اند.

```js
import { createApp } from 'vue'
import { bsToast, bsDialog } from 'vue3-bootstrap-components'
// یا: import bsToast from 'vue3-bootstrap-components/plugins/toast'

createApp(App)
  .use(bsToast, { placement: 'top-end', delay: 4000 })
  .use(bsDialog, { confirmText: 'بله', cancelText: 'خیر', dir: 'rtl' })   // پیش‌فرض همه‌ی فراخوانی‌ها
  .mount('#app')
```

(با `app.use(Vue3BootstrapComponents)` هر دو خودکار نصب می‌شوند.)

### `$bsDialog` — تایید/هشدار مبتنی بر Promise

هر فراخوانی با `{ confirmed, button, index, reason }` resolve می‌شود (هیچ‌وقت reject نمی‌شود):

| فیلد | معنی |
|---|---|
| `confirmed` | فقط وقتی `true` است که روی دکمه‌ی *تایید* کلیک شده باشد |
| `button` | مقدار (`value`) دکمه‌ی کلیک‌شده (پیش‌فرض `'confirm'` یا `'cancel'`)، در صورت بستن بدون دکمه `null` |
| `index` | ایندکس دکمه‌ی کلیک‌شده، در صورت بستن بدون دکمه `-1` |
| `reason` | `'button'`، `'close'` (×) ، `'escape'` یا `'backdrop'` |

```js
// Options API
const { confirmed } = await this.$bsDialog.confirm('این مورد حذف شود؟', 'تایید', { confirmTheme: 'danger', confirmText: 'حذف' })
if (confirmed) remove()

this.$bsDialog.confirm('منتشر شود؟').then(result => { if (result.confirmed) publish() })
this.$bsDialog.alert('با موفقیت ذخیره شد', 'انجام شد')

// دکمه‌های دلخواه
const r = await this.$bsDialog({
  title: 'تغییرات ذخیره نشده', message: 'چه کار کنم؟', backdrop: 'static', size: 'sm',
  buttons: [
    { text: 'ذخیره', value: 'save', confirm: true, theme: 'success' },
    { text: 'دور انداختن', value: 'discard', theme: 'danger', variant: 'outline' },
    { text: 'انصراف', value: 'cancel', variant: 'text' }
  ]
})
r.button // 'save' | 'discard' | 'cancel' | null
```

```vue
<script setup>
import { useBsDialog } from 'vue3-bootstrap-components'
const dialog = useBsDialog()
async function onDelete() { if ((await dialog.confirm('مطمئنید؟')).confirmed) { /* … */ } }
</script>
```

متدها: `$bsDialog(options | message)`، `.show()`، `.confirm(message, title?, options?)`، `.alert(message, title?, options?)` و `.closeAll()`.

| گزینه | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `title` / `message` | `string` | — | عنوان و متن |
| `html` | `boolean` | `false` | نمایش `message` به صورت HTML (فقط محتوای مطمئن) |
| `buttons` | `{ text, value?, confirm?, theme?, variant?, size?, class?, disabled?, autofocus? }[]` | تایید/انصراف | دکمه‌های دلخواه |
| `confirmText` / `cancelText` | `string` | `'OK'` / `'Cancel'` | متن دکمه‌های پیش‌فرض |
| `confirmTheme` / `cancelTheme` | `ThemeColor` | `'primary'` / `'secondary'` | رنگ دکمه‌های پیش‌فرض |
| `confirmVariant` / `cancelVariant` | سبک دکمه | `'solid'` / `'subtle'` | سبک دکمه‌های پیش‌فرض |
| `showCancel` | `boolean` | `true` (برای `alert` برابر `false`) | نمایش دکمه‌ی انصراف |
| `showClose` / `closeLabel` | `boolean` / `string` | `true` / `'Close'` | دکمه‌ی بستن در هدر |
| `backdrop` | `boolean \| 'static'` | `true` | گزینه‌ی بوت‌استرپ (`'static'` = با کلیک بیرون بسته نمی‌شود) |
| `keyboard` / `modal` | `boolean` | `true` | گزینه‌های بوت‌استرپ |
| `size` | `'sm'\|'lg'\|'xl'\|'fullscreen'` | — | اندازه |
| `fullscreenBelow` | `'sm'\|'md'\|'lg'` | — | تمام‌صفحه زیر یک breakpoint |
| `scrollable` / `instant` | `boolean` | `false` | کلاس‌های تغییر‌دهنده |
| `animation` | `'slide-up'\|'slide-down'` | — | انیمیشن ورود |
| `dir` | `'rtl'\|'ltr'` | — | جهت متن |
| `class` | `string` | — | کلاس اضافه روی `<dialog>` |

هر فراخوانی یک دیالوگ موقت mount می‌کند و هنگام بسته شدن آن را حذف می‌کند (و پلاگین `dialog` بوت‌استرپ که lazy لود شده بود هم آزاد می‌شود).

### `$bsToast`

```js
this.$bsToast.success('ذخیره شد')
this.$bsToast('پیام', 'info', 'عنوان', '۲ دقیقه پیش', { placement: 'top-center', delay: 3000 })
```

همه‌ی گزینه‌ها در بخش [Toast دستوری](#toast-دستوری) آمده است.

## پشتیبانی IDE و import

- بخش `exports` در `package.json` مسیر اصلی، `./plugin`، `./composables`، `./components/*` و `./global` را با `.d.ts` جداگانه عرضه می‌کند.
- همه‌ی کامپوننت‌ها propهای مستند (JSDoc) و emitهای تایپ‌شده دارند؛ بنابراین auto-complete و راهنما در VS Code (Volar)، WebStorm و سایر IDEها کار می‌کند.
- برای auto-complete کامپوننت‌های **ثبت‌شده‌ی سراسری** این را به `tsconfig.json` اضافه کنید:

```json
{ "compilerOptions": { "types": ["vue3-bootstrap-components/global"] } }
```

## SSR و Inertia.js

هیچ بخشی از بوت‌استرپ روی سرور اجرا نمی‌شود (پلاگین‌ها در `onMounted` لود می‌شوند). Dialog، Drawer، Menu، Popover و Tooltip هنگام ویزیت‌های GET در Inertia خودکار بسته می‌شوند (`closeOnInertia`، پیش‌فرض `true`).

## مرجع کامپوننت‌ها

قراردادها: *رنگ‌های تم* (`ThemeColor`) عبارت‌اند از `primary | accent | success | danger | warning | info | inverse | secondary`. *Breakpointها* عبارت‌اند از `sm | md | lg | xl | 2xl`. هر مورد با عنوان «گزینه‌ی بوت‌استرپ» همان معنی مستندات بوت‌استرپ را دارد. جدول‌ها و مثال‌ها از چپ به راست نمایش داده می‌شوند.

</div>

### محتوا و چیدمان

#### Accordion

آکاردئون مبتنی بر `<details>` بومی (در بوت‌استرپ ۶ به جاوااسکریپت نیاز ندارد).

**اکسپورت‌ها:** `Accordion`, `AccordionItem`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| Accordion · `exclusive` | `boolean` | `false` | فقط یک آیتم همزمان باز باشد |
| Accordion · `small / gap / flush` | `boolean` | `false` | کلاس‌های `.accordion-sm`، `.accordion-gap` و `.accordion-flush` |
| AccordionItem · `title` | `string` | `—` | عنوان (یا اسلات `title`) |
| AccordionItem · `modelValue` | `boolean` | `—` | وضعیت باز بودن (`v-model`) |
| AccordionItem · `theme` | `ThemeColor` | `—` | رنگ تم آیتم باز |

| رویداد | داده | توضیح |
|---|---|---|
| `toggle` | `native event` | رویداد بومی toggle (AccordionItem) |
| `update:modelValue` | `boolean` | باز/بسته شدن آیتم |

```vue
<Accordion exclusive>
  <AccordionItem title="Item 1" v-model="open1">Content 1</AccordionItem>
  <AccordionItem title="Item 2">Content 2</AccordionItem>
</Accordion>
```

#### Alert

هشدار با دکمه‌ی بستن اختیاری (پلاگین `alert` بوت‌استرپ).

**اکسپورت‌ها:** `Alert`, `AlertHeading`, `AlertLink`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `alert`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `theme` | `ThemeColor` | `'warning'` | رنگ تم (`.theme-*`) |
| `dismissible` | `boolean` | `false` | نمایش دکمه‌ی بستن |
| `modelValue` | `boolean` | `true` | نمایش (`v-model`) |
| `instant` | `boolean` | `false` | بدون انیمیشن |
| `closeLabel` | `string` | `'Close'` | aria-label دکمه‌ی بستن |

| رویداد | داده | توضیح |
|---|---|---|
| `close` | `BsEvent` | رویداد `close.bs.alert` — قابل لغو |
| `closed` | `BsEvent` | رویداد `closed.bs.alert` |
| `update:modelValue` | `boolean` | هنگام باز/بسته شدن |

```vue
<Alert theme="success" dismissible @closed="onClosed">
  <AlertHeading>Done</AlertHeading> Saved successfully.
</Alert>
```

#### Avatar

آواتار کاربر با تصویر/حروف اول و وضعیت حضور؛ امکان چیدن چند آواتار روی هم.

**اکسپورت‌ها:** `Avatar`, `AvatarStack`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `src / alt` | `string` | `—` | تصویر |
| `initials` | `string` | `—` | متن جایگزین |
| `size` | `'xs'\|'sm'\|'lg'\|'xl'` | `—` | اندازه |
| `status` | `'online'\|'offline'\|'away'\|'busy'` | `—` | نقطه‌ی وضعیت |
| `subtle` | `boolean` | `false` | پس‌زمینه‌ی ملایم |
| `theme` | `ThemeColor` | `—` | رنگ آواتار حروف |
| AvatarStack · `size` | `'xs'\|'sm'\|'lg'\|'xl'` | `—` | اندازه‌ی گروه |

```vue
<AvatarStack size="sm">
  <Avatar src="/u1.jpg" alt="A" /><Avatar initials="MK" status="online" />
</AvatarStack>
```

#### Badge

نشان (Badge).

**اکسپورت‌ها:** `Badge`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `theme` | `ThemeColor` | `'primary'` | رنگ تم |
| `variant` | `'solid'\|'subtle'\|'outline'` | `'solid'` | سبک |
| `large` | `boolean` | `false` | بزرگ |
| `pill` | `boolean` | `false` | کاملاً گرد |
| `as` | `string` | `'span'` | تگ |

```vue
<Badge theme="danger" variant="subtle">New</Badge>
```

#### Breadcrumb

مسیر ناوبری (Breadcrumb) با جداکننده (مارک‌آپ بوت‌استرپ ۶).

**اکسپورت‌ها:** `Breadcrumb`, `BreadcrumbItem`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| Breadcrumb · `label` | `string` | `'breadcrumb'` | aria-label |
| BreadcrumbItem · `href` | `string` | `—` | لینک |
| BreadcrumbItem · `active` | `boolean` | `false` | صفحه‌ی جاری |
| BreadcrumbItem · `divider` | `boolean` | `true` | جداکننده قبل از آیتم (برای اولی `false` بگذارید) |
| BreadcrumbItem · `separator` | `string` | `—` | متن جداکننده مثل `/` (پیش‌فرض: chevron) |

```vue
<Breadcrumb>
  <BreadcrumbItem href="/" :divider="false">Home</BreadcrumbItem>
  <BreadcrumbItem active>Library</BreadcrumbItem>
</Breadcrumb>
```

#### Button

دکمه‌ها (در بوت‌استرپ ۶: `variant` + `theme`)، دکمه‌های toggle (چک‌باکس/رادیو)، گروه دکمه و نوار ابزار. **Close button** را هم ببینید.

**اکسپورت‌ها:** `Button`, `ToggleButton`, `ButtonGroup`, `ButtonToolbar`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `variant` | `'solid'\|'outline'\|'subtle'\|'text'\|'styled'\|'link'` | `'solid'` | سبک دکمه |
| `theme` | `ThemeColor` | `'primary'` | رنگ تم |
| `size` | `'xs'\|'sm'\|'lg'` | `—` | اندازه |
| `icon` | `boolean` | `false` | دکمه‌ی آیکن |
| `href` | `string` | `—` | رندر به صورت `<a>` |
| `type` | `'button'\|'submit'\|'reset'` | `'button'` | نوع دکمه |
| `active / disabled` | `boolean` | `false` | وضعیت |
| `toggle + pressed` | `boolean` | `false` | دکمه‌ی toggle با `v-model:pressed` |
| ToggleButton · `modelValue, type, value, name` | `—` | `—` | دکمه‌ی toggle (`.btn-check`) |
| ButtonGroup · `vertical / divider / size / label` | `boolean / boolean / 'xs'\|'sm'\|'lg' / string` | `false` | گروه عمودی، جداکننده، اندازه و aria-label |
| ButtonToolbar · `label` | `string` | `—` | aria-label نوار ابزار |

| رویداد | داده | توضیح |
|---|---|---|
| `click` | `MouseEvent` | کلیک |
| `update:pressed` | `boolean` | وضعیت toggle |

```vue
<Button theme="danger" variant="outline" size="sm" @click="remove">Delete</Button>
<ButtonGroup><Button>A</Button><Button>B</Button></ButtonGroup>
```

#### CloseButton

دکمه‌ی بستن. داخل Alert، Toast، Dialog یا Drawer به‌صورت خودکار نزدیک‌ترین والد را می‌بندد (مثل `data-bs-dismiss`)؛ یا با `target` به هر کامپوننتی اشاره کند.

**اکسپورت‌ها:** `CloseButton`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `dismiss` | `'alert'\|'toast'\|'dialog'\|'drawer'` | `auto` | نوع والدی که بسته شود (پیش‌فرض: نزدیک‌ترین) |
| `target` | `string` | `—` | نام هر Dialog/Drawer/Toast/Collapse برای بستن |
| `label` | `string` | `'Close'` | aria-label |
| `disabled` | `boolean` | `false` | غیرفعال |

| رویداد | داده | توضیح |
|---|---|---|
| `click` | `MouseEvent` | قبل از بسته شدن والد؛ با `preventDefault()` باز می‌ماند |

```vue
<Alert theme="info">Hello <CloseButton class="ms-auto" /></Alert>
<Dialog name="d"><DialogHeader><DialogTitle>T</DialogTitle><CloseButton /></DialogHeader></Dialog>
<CloseButton target="d" />  <!-- closes the dialog named "d" from anywhere -->
```

#### Card

کارت و بخش‌های آن.

**اکسپورت‌ها:** `Card`, `CardHeader`, `CardBody`, `CardFooter`, `CardTitle`, `CardSubtitle`, `CardText`, `CardImg`, `CardImgOverlay`, `CardGroup`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| Card · `subtle / translucent / row` | `boolean` | `false` | کلاس‌های `.card-subtle`، `.card-translucent` و `.card-row` |
| Card · `theme` | `ThemeColor` | `—` | رنگ تم |
| CardImg · `src, alt, position` | `'top'\|'bottom'\|'start'\|'end'\|'none'` | `'top'` | جایگاه تصویر |

```vue
<Card>
  <CardImg src="/a.jpg" alt="" />
  <CardBody><CardTitle>Title</CardTitle><CardText>Text</CardText></CardBody>
</Card>
```

#### Container

کانتینر.

**اکسپورت‌ها:** `Container`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `fluid` | `boolean` | `false` | عرض کامل |
| `breakpoint` | `'sm'\|'md'\|'lg'\|'xl'\|'2xl'` | `—` | کانتینر واکنش‌گرا (`.md:container`) |

```vue
<Container breakpoint="lg">…</Container>
```

#### ListGroup

گروه لیست.

**اکسپورت‌ها:** `ListGroup`, `ListGroupItem`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| ListGroup · `flush / numbered / horizontal` | `boolean \| breakpoint` | `false` | حالت‌ها |
| ListGroupItem · `action, href, active, disabled, theme` | `—` | `—` | آیتم تعاملی (`<a>`/`<button>`) |

| رویداد | داده | توضیح |
|---|---|---|
| `click` | `MouseEvent` | کلیک آیتم |

```vue
<ListGroup>
  <ListGroupItem action href="/a" active>A</ListGroupItem>
  <ListGroupItem>B</ListGroupItem>
</ListGroup>
```

#### Pagination

صفحه‌بندی. آرایه‌ی `links` پیجینیتور لاراول/اینرشیا یا `currentPage` و `lastPage` را بدهید.

**اکسپورت‌ها:** `Pagination`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `links` | `PaginationLink[]` | `—` | لینک‌های پیجینیتور لاراول |
| `currentPage / lastPage` | `number` | `—` | جایگزین `links` |
| `siblings` | `number` | `2` | تعداد صفحات اطراف صفحه‌ی جاری |
| `size` | `'sm'\|'lg'` | `—` | اندازه |
| `hideSinglePage` | `boolean` | `true` | پنهان‌سازی با یک صفحه |
| `nofollow` | `boolean` | `true` | افزودن `rel="nofollow"` |

| رویداد | داده | توضیح |
|---|---|---|
| `page` | `{ page, url, event }` | کلیک روی یک صفحه |

```vue
<Pagination :links="users.links" @page="({ url }) => router.visit(url)" />
```

#### Placeholder

Placeholder بارگذاری: میله‌های `Placeholder` (`.placeholder.col-*`) داخل `PlaceholderWrap` که انیمیشن را تعیین می‌کند.

**اکسپورت‌ها:** `Placeholder`, `PlaceholderWrap`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| Placeholder · `cols` | `number` | `—` | عرض گرید ۱ تا ۱۲ |
| Placeholder · `size` | `'xs'\|'sm'\|'lg'` | `—` | اندازه |
| Placeholder · `width` | `string` | `—` | عرض (CSS) |
| PlaceholderWrap · `animation` | `'glow'\|'wave'\|'pulse'` | `'glow'` | انیمیشن |

```vue
<PlaceholderWrap animation="wave">
  <Placeholder :cols="6" /> <Placeholder :cols="4" size="lg" />
</PlaceholderWrap>
```

#### Progress

نوار پیشرفت.

**اکسپورت‌ها:** `Progress`, `ProgressStacked`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `value / min / max` | `number` | `0 / 0 / 100` | بازه‌ی مقدار |
| `theme` | `ThemeColor` | `—` | رنگ |
| `striped / animated` | `boolean` | `false` | سبک |
| `label` | `string \| boolean` | `—` | متن (`true` = درصد) |
| `height` | `string` | `—` | ارتفاع (CSS) |
| `stacked` | `boolean` | `false` | داخل `ProgressStacked`: عرض روی `.progress` اعمال می‌شود |

```vue
<Progress :value="60" theme="success" label striped />
<ProgressStacked>
  <Progress stacked :value="15" /> <Progress stacked :value="30" theme="success" />
</ProgressStacked>
```

#### Spinner

اسپینر.

**اکسپورت‌ها:** `Spinner`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `type` | `'border'\|'grow'\|'rotate'` | `'border'` | نوع |
| `small` | `boolean` | `false` | کوچک |
| `label` | `string` | `'Loading...'` | متن screen-reader |

```vue
<Spinner type="grow" small />
```

#### Stepper

Stepper (جدید در بوت‌استرپ ۶).

**اکسپورت‌ها:** `Stepper`, `StepperItem`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| Stepper · `horizontal` | `boolean \| breakpoint` | `false` | افقی یا از یک breakpoint |
| Stepper · `overflow` | `boolean` | `false` | قرار دادن در `.stepper-overflow` برای اسکرول |
| StepperItem · `active` | `boolean` | `false` | مرحله‌ی تکمیل‌شده/جاری |
| StepperItem · `theme` | `ThemeColor` | `—` | رنگ تم |

```vue
<Stepper horizontal>
  <StepperItem active>Account</StepperItem>
  <StepperItem active theme="success">Email</StepperItem>
  <StepperItem>Profile</StepperItem>
</Stepper>
```

#### Prose

محدوده‌ی تایپوگرافی متن‌های غنی (`.prose`، جدید در بوت‌استرپ ۶).

**اکسپورت‌ها:** `Prose`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `as` | `string` | `'div'` | تگ |

```vue
<Prose v-html="article.body" />
```

### فرم‌ها

#### Form

اجزای فرم. `FormRange` از پلاگین `range` بوت‌استرپ استفاده می‌کند.

**اکسپورت‌ها:** `FormField`, `FormControl`, `Check`, `Radio`, `Switch`, `FormRange`, `InputGroup`, `InputGroupText`, `InputGroupButton`, `FormAdorn`, `FormAdornIcon`, `FormAdornText`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `range (FormRange)`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| FormControl · `v-model, as, type, valid, invalid` | `—` | `as='input'` | `input` / `textarea` / `select` |
| Check / Switch · `v-model, label, value, size, disabled` | `—` | `—` | مدل بولین یا آرایه |
| Radio · `v-model, value, label` | `—` | `—` | رادیو |
| FormRange · `v-model, min, max, step, bubble, formatter` | `—` | `—` | رنج با حباب مقدار |
| InputGroup · `size` | `'sm'\|'lg'` | `—` | اندازه‌ی گروه ورودی |

| رویداد | داده | توضیح |
|---|---|---|
| `changed` | `{ value }` | FormRange: رویداد `changed.bs.range` |

```vue
<FormField><Check v-model="agree" label="I agree" /></FormField>
<FormControl v-model="name" placeholder="Name" />
<FormRange v-model="volume" :min="0" :max="100" bubble @changed="onChanged" />
```

### اورلی و تعاملی

#### Dialog

مودال بر پایه‌ی `<dialog>` بومی (جایگزین Modal بوت‌استرپ ۵).

**اکسپورت‌ها:** `Dialog`, `DialogHeader`, `DialogTitle`, `DialogBody`, `DialogFooter`, `DialogClose`, `DialogButton`, `DialogTrigger`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `dialog`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| DialogButton · `name` | `string` | `required` | نام دیالوگی که باید باز شود (مثل `data-bs-target`) |
| DialogButton · `action` | `'toggle'\|'show'\|'hide'` | `'toggle'` | عملکرد کلیک |
| DialogButton · `variant / theme / size / icon / disabled / active` | `—` | `'solid' / 'primary'` | مثل `Button` |
| `name` | `string` | `—` | شناسه؛ امکان کنترل با `useOverlay(name)` و `DialogTrigger` |
| `modelValue` | `boolean` | `false` | وضعیت باز بودن (`v-model`) |
| `backdrop` | `boolean \| 'static'` | `true` | گزینه‌ی `backdrop` |
| `keyboard` | `boolean` | `true` | بستن با Esc |
| `modal` | `boolean` | `true` | `false` = غیرمودال |
| `size` | `'sm'\|'lg'\|'xl'\|'fullscreen'` | `—` | اندازه |
| `fullscreenBelow` | `'sm'\|'md'\|'lg'` | `—` | تمام‌صفحه زیر breakpoint |
| `scrollable` | `boolean` | `false` | اسکرول داخلی |
| `animation` | `'slide-up'\|'slide-down'` | `—` | انیمیشن ورود |
| `instant` | `boolean` | `false` | بدون انیمیشن |
| `title` | `string` | `—` | هدر سریع با دکمه‌ی بستن |
| `closeOnInertia` | `boolean` | `true` | بستن هنگام ویزیت Inertia |

| رویداد | داده | توضیح |
|---|---|---|
| `click (DialogButton)` | `MouseEvent` | قبل از باز شدن؛ با `preventDefault()` لغو می‌شود |
| `show` | `BsEvent` | رویداد `show.bs.dialog` — قابل لغو با `preventDefault()` |
| `shown` | `BsEvent` | رویداد `shown.bs.dialog` |
| `hide` | `BsEvent` | رویداد `hide.bs.dialog` — قابل لغو |
| `hidden` | `BsEvent` | رویداد `hidden.bs.dialog` |
| `hidePrevented` | `BsEvent` | رویداد `hidePrevented.bs.dialog` |
| `cancel` | `BsEvent` | رویداد `cancel.bs.dialog` (Esc) |
| `update:modelValue` | `boolean` | هنگام باز/بسته شدن |

```vue
<DialogButton name="confirm" theme="danger">Open dialog</DialogButton>

<Dialog name="confirm" backdrop="static" @shown="onShown" @hide-prevented="shake">
  <DialogHeader><DialogTitle>Confirm</DialogTitle><CloseButton /></DialogHeader>
  <DialogBody>Are you sure?</DialogBody>
  <DialogFooter><DialogClose>Cancel</DialogClose><Button @click="ok">OK</Button></DialogFooter>
</Dialog>

<!-- or control it with v-model / useOverlay('confirm').show() -->
```

#### Drawer

پنل کشویی (جایگزین Offcanvas بوت‌استرپ ۵).

**اکسپورت‌ها:** `Drawer`, `DrawerHeader`, `DrawerTitle`, `DrawerBody`, `DrawerFooter`, `DrawerClose`, `DrawerButton`, `DrawerTrigger`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `drawer`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| DrawerButton · `name` | `string` | `required` | نام drawer که باید باز شود |
| DrawerButton · `action` | `'toggle'\|'show'\|'hide'` | `'toggle'` | عملکرد کلیک (و `aria-expanded`) |
| DrawerButton · `variant / theme / size / icon / disabled / active` | `—` | `'solid' / 'primary'` | مثل `Button` |
| `name` | `string` | `—` | شناسه؛ امکان کنترل با `useOverlay(name)` و `DrawerTrigger` |
| `modelValue` | `boolean` | `false` | وضعیت باز بودن (`v-model`) |
| `placement` | `'start'\|'end'\|'top'\|'bottom'\|'fullscreen'` | `'start'` | لبه (یا تمام‌صفحه) |
| `backdrop` | `boolean \| 'static'` | `true` | گزینه‌ی بوت‌استرپ |
| `keyboard` | `boolean` | `true` | بستن با Esc |
| `scroll` | `boolean` | `false` | اسکرول صفحه |
| `responsive` | `breakpoint` | `—` | درون‌خطی از یک breakpoint |
| `sheet / fitContent / translucent / instant` | `boolean` | `false` | کلاس‌های تغییر‌دهنده |
| `title` | `string` | `—` | هدر سریع |

| رویداد | داده | توضیح |
|---|---|---|
| `show` | `BsEvent` | رویداد `show.bs.drawer` — قابل لغو با `preventDefault()` |
| `shown` | `BsEvent` | رویداد `shown.bs.drawer` |
| `hide` | `BsEvent` | رویداد `hide.bs.drawer` — قابل لغو |
| `hidden` | `BsEvent` | رویداد `hidden.bs.drawer` |
| `hidePrevented` | `BsEvent` | رویداد `hidePrevented.bs.drawer` |
| `update:modelValue` | `boolean` | هنگام باز/بسته شدن |

```vue
<DrawerButton name="menu">Open menu</DrawerButton>

<Drawer name="menu" placement="end" title="Menu">
  <DrawerBody>…</DrawerBody>
</Drawer>
```

#### Collapse

ناحیه‌ی جمع‌شونده.

**اکسپورت‌ها:** `Collapse`, `CollapseTrigger`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `collapse`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `name` | `string` | `—` | شناسه؛ امکان کنترل با `useOverlay(name)` و `CollapseTrigger` |
| `modelValue` | `boolean` | `false` | وضعیت باز بودن (`v-model`) |
| `parent` | `string` | `—` | سلکتور کانتینر: باز شدن، آیتم‌های دیگر را می‌بندد |
| `horizontal` | `boolean` | `false` | جمع شدن افقی (به فرزند عرض بدهید) |

| رویداد | داده | توضیح |
|---|---|---|
| `show` | `BsEvent` | رویداد `show.bs.collapse` — قابل لغو با `preventDefault()` |
| `shown` | `BsEvent` | رویداد `shown.bs.collapse` |
| `hide` | `BsEvent` | رویداد `hide.bs.collapse` — قابل لغو |
| `hidden` | `BsEvent` | رویداد `hidden.bs.collapse` |
| `update:modelValue` | `boolean` | هنگام باز/بسته شدن |

```vue
<CollapseTrigger name="more"><Button>Toggle</Button></CollapseTrigger>
<Collapse name="more" @shown="log">Hidden content</Collapse>
```

#### Menu

منو (جایگزین Dropdown بوت‌استرپ ۵) با زیرمنو. از Floating UI استفاده می‌کند (خودکار نصب می‌شود).

**اکسپورت‌ها:** `Menu`, `MenuToggle`, `MenuContent`, `MenuItem`, `MenuHeader`, `MenuText`, `MenuDivider`, `Submenu`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `menu (+ Floating UI)`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `name` | `string` | `—` | شناسه؛ امکان کنترل با `useOverlay(name)` و `useOverlay` |
| `modelValue` | `boolean` | `false` | وضعیت باز بودن (`v-model`) |
| `autoClose` | `boolean \| 'inside' \| 'outside'` | `true` | گزینه‌ی بوت‌استرپ |
| `placement` | `string` | `'bottom-start'` | پشتیبانی از واکنش‌گرا |
| `offset` | `[number, number]` | `[0, 2]` | فاصله |
| `boundary / container / display / strategy / reference` | `—` | `—` | گزینه‌های بوت‌استرپ |
| `floatingConfig` | `object \| fn` | `null` | پیکربندی Floating UI |
| `submenuTrigger / submenuDelay` | `'hover'\|'click'\|'both' / number` | `'both' / 100` | رفتار زیرمنو |
| `as` | `string` | `'div'` | تگ wrapper |
| MenuToggle · `variant, theme, size, split` | `—` | `'solid', 'secondary'` | دکمه‌ی باز‌کننده |
| MenuItem · `href, active, selected, disabled, theme, description, check` | `—` | `—` | آیتم؛ `selected` تیک را نشان می‌دهد؛ اسلات `icon` |
| MenuContent · `scrollable / translucent` | `boolean` | `false` | اسکرول‌دار / نیمه‌شفاف |

| رویداد | داده | توضیح |
|---|---|---|
| `show` | `BsEvent` | رویداد `show.bs.menu` — قابل لغو با `preventDefault()` |
| `shown` | `BsEvent` | رویداد `shown.bs.menu` |
| `hide` | `BsEvent` | رویداد `hide.bs.menu` — قابل لغو |
| `hidden` | `BsEvent` | رویداد `hidden.bs.menu` |
| `update:modelValue` | `boolean` | هنگام باز/بسته شدن |

```vue
<Menu placement="bottom-end" @shown="onShown">
  <MenuToggle>Actions</MenuToggle>
  <MenuContent>
    <MenuHeader>Account</MenuHeader>
    <MenuItem href="/profile">Profile</MenuItem>
    <MenuDivider />
    <Submenu><MenuItem>More</MenuItem><MenuContent><MenuItem>Sub item</MenuItem></MenuContent></Submenu>
  </MenuContent>
</Menu>
```

#### Tabs

تب‌ها. دکمه‌ها و پنل‌ها با `name` به هم وصل می‌شوند.

**اکسپورت‌ها:** `Tabs`, `TabList`, `TabButton`, `TabContent`, `TabPane`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `tab`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| Tabs · `modelValue` | `string` | `first tab` | نام تب فعال (`v-model`) |
| Tabs · `fade` | `boolean` | `true` | انیمیشن fade |
| Tabs · `listGroup` | `boolean` | `false` | استفاده از list-group به جای nav |
| TabList · `variant` | `'tabs'\|'pills'\|'underline'\|'none'` | `'tabs'` | سبک ناوبری |
| TabList · `fill / justified / vertical` | `boolean` | `false` | حالت‌های ناوبری |
| TabButton · `name, disabled` | `string, boolean` | `—` | شناسه‌ی تب |
| TabPane · `name` | `string` | `—` | تب متناظر |

| رویداد | داده | توضیح |
|---|---|---|
| `show / shown / hide / hidden` | `BsEvent` | رویدادهای `*.bs.tab` (روی Tabs و TabButton) |
| `update:modelValue` | `string` | تب فعال تغییر کرد |

```vue
<Tabs v-model="tab" @shown="onShown">
  <TabList variant="pills"><TabButton name="home">Home</TabButton><TabButton name="settings">Settings</TabButton></TabList>
  <TabContent><TabPane name="home">…</TabPane><TabPane name="settings">…</TabPane></TabContent>
</Tabs>
```

#### Toast

`<Toast>` اعلانی و API دستوری از طریق **پلاگین `bsToast`** (`this.$bsToast` و `useBsToast()`).

**اکسپورت‌ها:** `Toast`, `ToastContainer`, `useBsToast`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `toast`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `name` | `string` | `—` | شناسه؛ امکان کنترل با `useOverlay(name)` و `useOverlay` |
| `modelValue` | `boolean` | `false` | نمایش (`v-model`) |
| `autohide / delay / animation` | `boolean / number / boolean` | `true / 5000 / true` | گزینه‌های بوت‌استرپ |
| `theme` | `ThemeColor` | `—` | رنگ |
| `title / meta` | `string` | `—` | عنوان هدر و متن کوچک |
| `closable` | `boolean` | `true` | دکمه‌ی بستن |
| `translucent / instant` | `boolean` | `false` | حالت‌ها |

| رویداد | داده | توضیح |
|---|---|---|
| `show` | `BsEvent` | رویداد `show.bs.toast` — قابل لغو با `preventDefault()` |
| `shown` | `BsEvent` | رویداد `shown.bs.toast` |
| `hide` | `BsEvent` | رویداد `hide.bs.toast` — قابل لغو |
| `hidden` | `BsEvent` | رویداد `hidden.bs.toast` |
| `update:modelValue` | `boolean` | هنگام باز/بسته شدن |

```vue
<!-- declarative -->
<Toast v-model="visible" theme="success" title="Saved" @hidden="onHidden">Profile updated</Toast>

<!-- imperative -->
const toast = useBsToast()
toast.success('Saved', 'Done', null, { placement: 'top-end', delay: 3000 })
toast('Hello', 'info')
```

#### Tooltip

Tooltip دور هر محتوا. از Floating UI استفاده می‌کند (خودکار نصب می‌شود).

**اکسپورت‌ها:** `Tooltip`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `tooltip (+ Floating UI)`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `title` | `string` | `required` | متن tooltip |
| `modelValue` | `boolean` | `false` | وضعیت باز بودن (`v-model`) |
| `disabled` | `boolean` | `false` | غیرفعال |
| `placement` | `FloatingPlacement` | `'top'` | جایگاه |
| `trigger` | `string` | `'hover focus'` | نحوه‌ی فعال‌سازی |
| `html / sanitize / animation` | `boolean` | `false / true / true` | گزینه‌های بوت‌استرپ |
| `delay / offset / container / boundary` | `—` | `—` | گزینه‌های بوت‌استرپ |
| `customClass / fallbackPlacements / allowList / sanitizeFn / template / floatingConfig` | `—` | `—` | گزینه‌های بوت‌استرپ |
| `as` | `string` | `'span'` | تگ wrapper |

| رویداد | داده | توضیح |
|---|---|---|
| `show` | `BsEvent` | رویداد `show.bs.tooltip` — قابل لغو با `preventDefault()` |
| `shown` | `BsEvent` | رویداد `shown.bs.tooltip` |
| `hide` | `BsEvent` | رویداد `hide.bs.tooltip` — قابل لغو |
| `hidden` | `BsEvent` | رویداد `hidden.bs.tooltip` |
| `inserted` | `BsEvent` | رویداد `inserted.bs.tooltip` |
| `update:modelValue` | `boolean` | هنگام باز/بسته شدن |

```vue
<Tooltip title="Copy" placement="bottom"><Button icon>⧉</Button></Tooltip>
```

#### Popover

Popover. گزینه‌ها مثل Tooltip به‌علاوه‌ی `content`؛ trigger پیش‌فرض `click` است.

**اکسپورت‌ها:** `Popover`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `popover (+ Floating UI)`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `title / content` | `string` | `—` | هدر / بدنه (با `html` می‌تواند HTML باشد) |
| `modelValue` | `boolean` | `false` | وضعیت باز بودن (`v-model`) |
| `placement` | `FloatingPlacement` | `'right'` | جایگاه |
| `trigger` | `string` | `'click'` | نحوه‌ی فعال‌سازی |
| `…` | `—` | `—` | تمام propهای Tooltip |

| رویداد | داده | توضیح |
|---|---|---|
| `show` | `BsEvent` | رویداد `show.bs.popover` — قابل لغو با `preventDefault()` |
| `shown` | `BsEvent` | رویداد `shown.bs.popover` |
| `hide` | `BsEvent` | رویداد `hide.bs.popover` — قابل لغو |
| `hidden` | `BsEvent` | رویداد `hidden.bs.popover` |
| `inserted` | `BsEvent` | رویداد `inserted.bs.popover` |
| `update:modelValue` | `boolean` | هنگام باز/بسته شدن |

```vue
<Popover title="Hello" content="Popover body" placement="top"><Button>Click</Button></Popover>
```

#### Carousel

کاروسل (کاروسل مبتنی بر scroll-snap بوت‌استرپ ۶).

**اکسپورت‌ها:** `Carousel`, `CarouselItem`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `carousel`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `modelValue` | `number` | `0` | ایندکس اسلاید فعال (`v-model`) |
| `autoplay` | `boolean` | `false` | گزینه‌ی بوت‌استرپ |
| `ends` | `'loop'\|'wrap'\|'stop'` | `'loop'` | رفتار در ابتدا/انتها |
| `interval` | `number` | `5000` | میلی‌ثانیه |
| `keyboard / pause` | `boolean / 'hover'\|false` | `true / 'hover'` | گزینه‌های بوت‌استرپ |
| `indicators / controls / playPause` | `boolean` | `true / true / false` | اجزای رابط |
| `fade / center / auto / overlay` | `boolean` | `false` | کلاس‌های تغییر‌دهنده |
| `items / gap / peek` | `number / string / string` | `—` | تعداد اسلاید همزمان، فاصله و peek |
| `controlsPlacement` | `'top'\|'bottom'` | `'bottom'` | جایگاه کنترل‌ها |
| CarouselItem · `interval` | `number` | `—` | تاخیر مخصوص هر اسلاید |

| رویداد | داده | توضیح |
|---|---|---|
| `slide` | `{ relatedTarget, direction, from, to }` | رویداد `slide.bs.carousel` — قابل لغو |
| `slid` | `{ relatedTarget, direction, from, to }` | رویداد `slid.bs.carousel` |
| `update:modelValue` | `number` | اسلاید فعال تغییر کرد |

```vue
<Carousel v-model="index" autoplay :interval="4000" @slid="onSlid">
  <CarouselItem><img src="/1.jpg" class="d-block w-100" alt=""></CarouselItem>
  <CarouselItem><img src="/2.jpg" class="d-block w-100" alt=""></CarouselItem>
</Carousel>
```

#### Chips

ورودی تگ/چیپ (جدید در بوت‌استرپ ۶). `Chip` یک چیپ ثابت است.

**اکسپورت‌ها:** `Chips`, `Chip`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `chips`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `modelValue` | `string[]` | `[]` | مقادیر چیپ‌ها (`v-model`) |
| `separator` | `string \| null` | `','` | جداکننده‌ی ساخت چیپ |
| `allowDuplicates` | `boolean` | `false` | اجازه‌ی تکراری |
| `maxChips` | `number \| null` | `null` | حداکثر تعداد |
| `placeholder / dismissible / dismissIcon / createOnBlur` | `—` | `—` | گزینه‌های بوت‌استرپ |

| رویداد | داده | توضیح |
|---|---|---|
| `add` | `{ value }` | رویداد `add.bs.chips` — قابل لغو |
| `remove` | `{ value, chip }` | رویداد `remove.bs.chips` — قابل لغو |
| `change` | `{ values }` | رویداد `change.bs.chips` |
| `select` | `{ selected }` | رویداد `select.bs.chips` |
| `update:modelValue` | `string[]` | مقادیر تغییر کرد |

```vue
<Chips v-model="tags" placeholder="Add tag…" :max-chips="5" @add="onAdd" />
```

#### Combobox

Select قابل جستجو (جدید در بوت‌استرپ ۶).

**اکسپورت‌ها:** `Combobox`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `combobox (+ menu, Floating UI)`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `options` | `{ value, label?, description?, disabled? }[]` | `required` | گزینه‌ها |
| `modelValue` | `string \| number \| array \| null` | `null` | مقدار(های) انتخاب‌شده (`v-model`) |
| `multiple / search / searchNormalize` | `boolean` | `false` | گزینه‌های بوت‌استرپ |
| `name` | `string` | `—` | ساخت input مخفی برای ارسال فرم |
| `placeholder / placement / offset / boundary` | `—` | `—` | گزینه‌های بوت‌استرپ |
| `disabled / searchPlaceholder / noResultsText` | `—` | `—` | رابط کاربری |

| رویداد | داده | توضیح |
|---|---|---|
| `change` | `{ value, item }` | رویداد `change.bs.combobox` |
| `show / shown / hide / hidden` | `BsEvent` | رویدادهای `*.bs.combobox` |
| `update:modelValue` | `value` | انتخاب تغییر کرد |

```vue
<Combobox v-model="country" :options="countries" search placeholder="Country" name="country" />
```

#### Datepicker

انتخاب‌گر تاریخ (جدید در بوت‌استرپ ۶). به `vanilla-calendar-pro` نیاز دارد؛ مدل رشته(های) `YYYY-MM-DD` است.

**اکسپورت‌ها:** `Datepicker`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `datepicker (+ vanilla-calendar-pro)`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `modelValue` | `string \| string[] \| null` | `null` | تاریخ(های) انتخاب‌شده (`v-model`) |
| `selectionMode` | `'single'\|'multiple'\|'multiple-ranged'` | `'single'` | حالت انتخاب |
| `inline` | `boolean` | `false` | نمایش تقویم درون‌خطی |
| `locale / firstWeekday` | `string / number` | `—` | زبان، مثلا `fa-IR` |
| `dateMin / dateMax / dateFormat / displayMonthsCount / placement / datepickerTheme / vcpOptions` | `—` | `—` | گزینه‌های بوت‌استرپ |

| رویداد | داده | توضیح |
|---|---|---|
| `change` | `BsEvent` | رویداد `change.bs.datepicker` |
| `show / shown / hide / hidden` | `BsEvent` | رویدادهای `*.bs.datepicker` |
| `update:modelValue` | `string \| string[] \| null` | تاریخ تغییر کرد |

```vue
<Datepicker v-model="date" locale="en-US" placeholder="Pick a date" date-min="2026-01-01" />
```

#### OtpInput

ورودی کد یکبار مصرف (جدید در بوت‌استرپ ۶).

**اکسپورت‌ها:** `OtpInput`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `otp-input`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `modelValue` | `string` | `''` | کد (`v-model`) |
| `length / groups / separator` | `number / number[] / string` | `—` | چیدمان خانه‌ها |
| `type` | `'numeric'\|'alpha'\|'alphanumeric'` | `'numeric'` | کاراکترهای مجاز |
| `mask` | `boolean` | `false` | پنهان‌سازی کاراکترها |
| `size / connected` | `'sm'\|'lg' / boolean` | `—` | سبک |

| رویداد | داده | توضیح |
|---|---|---|
| `complete` | `{ value }` | رویداد `complete.bs.otpInput` |
| `input` | `{ value }` | رویداد `input.bs.otpInput` |
| `update:modelValue` | `string` | مقدار تغییر کرد |

```vue
<OtpInput v-model="code" :length="6" @complete="verify" />
```

#### Strength

نمایشگر قدرت رمز عبور (جدید در بوت‌استرپ ۶). input رمز را داخل اسلات بگذارید.

**اکسپورت‌ها:** `Strength`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `strength`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `minLength` | `number` | `8` | حداقل طول |
| `messages` | `{ weak, fair, good, strong }` | `English` | برچسب‌ها |
| `weights / thresholds / scorer` | `—` | `—` | گزینه‌های امتیازدهی |
| `input` | `string \| HTMLElement` | `auto` | input رمز |
| `showText` | `boolean` | `true` | برچسب زیر نوار |

| رویداد | داده | توضیح |
|---|---|---|
| `strengthChange` | `{ strength, score, password }` | رویداد `strengthChange.bs.strength` |

```vue
<Strength :messages="{ weak: 'Weak', strong: 'Strong' }" @strength-change="e => level = e.strength">
  <FormControl v-model="password" type="password" />
</Strength>
```

#### ScrollSpy

لینک‌های ناوبری را بر اساس موقعیت اسکرول فعال می‌کند.

**اکسپورت‌ها:** `ScrollSpy`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `scrollspy`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `target` | `string` | `required` | سلکتور ناوبری |
| `smoothScroll` | `boolean` | `false` | اسکرول نرم |
| `rootMargin / threshold / topMargin` | `—` | `—` | گزینه‌های بوت‌استرپ |
| `as` | `string` | `'div'` | تگ |

| رویداد | داده | توضیح |
|---|---|---|
| `activate` | `{ relatedTarget }` | رویداد `activate.bs.scrollspy` |

```vue
<Nav id="toc" variant="pills"><NavItem><NavLink href="#a">A</NavLink></NavItem></Nav>
<ScrollSpy target="#toc" class="overflow-y-auto" style="height:300px"><section id="a">…</section></ScrollSpy>
```

#### Toggler

کلاس/اتربیوت (`attribute` و `value`) را روی خودش یا روی تمام المان‌های منطبق با `target` toggle می‌کند (جدید در بوت‌استرپ ۶).

**اکسپورت‌ها:** `Toggler`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `toggler`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| `target` | `string` | `—` | سلکتور المان(های) هدف؛ بدون آن خودِ کامپوننت toggle می‌شود |
| `attribute` | `string` | `'class'` | اتربیوت (به جز `id`) |
| `value` | `string \| number \| boolean` | `—` | مقدار — الزامی |

| رویداد | داده | توضیح |
|---|---|---|
| `toggle` | `BsEvent` | رویداد `toggle.bs.toggler` — قابل لغو (روی المان toggle‌شونده) |
| `toggled` | `BsEvent` | رویداد `toggled.bs.toggler` |

```vue
<Toggler target="#panel" attribute="class" value="bg-subtle-info">Highlight</Toggler>
<div id="panel">…</div>
```

### ناوبری

#### Nav

Nav، و `NavOverflow` که آیتم‌های جا نشده را به منو منتقل می‌کند (جدید در بوت‌استرپ ۶).

**اکسپورت‌ها:** `Nav`, `NavItem`, `NavLink`, `NavOverflow`

**جاوااسکریپت بوت‌استرپ که lazy لود می‌شود:** `nav-overflow (NavOverflow)`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| Nav · `variant` | `'tabs'\|'pills'\|'underline'\|'none'` | `'none'` | سبک |
| Nav · `fill / justified / vertical` | `boolean` | `false` | حالت‌ها |
| NavLink · `href, active, disabled` | `—` | `—` | لینک |
| NavOverflow · `collapseBelow, iconPlacement, menuPlacement, menuStrategy, moreText, moreIcon, threshold` | `—` | `—` | گزینه‌های بوت‌استرپ |

| رویداد | داده | توضیح |
|---|---|---|
| `update / overflow / resize` | `BsEvent` | رویدادهای `*.bs.navoverflow` (NavOverflow) |

```vue
<NavOverflow @update="onUpdate"><Nav><NavItem><NavLink href="#" active>One</NavLink></NavItem></Nav></NavOverflow>
```

#### Navbar

Navbar. `NavbarToggler` می‌تواند یک `Drawer`/`Collapse` را با نام باز/بسته کند.

**اکسپورت‌ها:** `Navbar`, `NavbarBrand`, `NavbarNav`, `NavbarText`, `NavbarToggler`

| Prop | نوع | پیش‌فرض | توضیح |
|---|---|---|---|
| Navbar · `expand` | `boolean \| breakpoint` | `false` | حالت گسترده |
| Navbar · `container` | `'fluid'\|'container'\|breakpoint\|false` | `'fluid'` | کانتینر داخلی |
| Navbar · `dark / translucent` | `boolean` | `false` | تیره / نیمه‌شفاف |
| NavbarToggler · `target` | `string` | `—` | نام drawer/collapse (aria-expanded را به‌روز نگه می‌دارد) |

| رویداد | داده | توضیح |
|---|---|---|
| `click` | `MouseEvent` | کلیک روی toggler |

```vue
<Navbar expand="md">
  <NavbarBrand href="/">Brand</NavbarBrand>
  <NavbarToggler target="main-nav" />
  <Drawer name="main-nav" placement="end" title="Menu">
    <DrawerBody><NavbarNav><NavItem><NavLink href="/" active>Home</NavLink></NavItem></NavbarNav></DrawerBody>
  </Drawer>
</Navbar>
```

<div dir="rtl" align="right">

## مهاجرت از نسخه ۲

</div>

| نسخه ۲ (بوت‌استرپ ۵) | نسخه ۳ (بوت‌استرپ ۶) |
|---|---|
| `Modal` | `Dialog` (+ `DialogHeader/Title/Body/Footer/Close/Button`) |
| `OffCanvas` | `Drawer` (+ اجزا و `DrawerButton`) |
| `Dropdown` | `Menu`، `MenuToggle`، `MenuContent`، `MenuItem`، `Submenu` |
| `Tab` | `Tabs`، `TabList`، `TabButton`، `TabContent`، `TabPane` |
| `Toast` / `ToastContainer` / `$bsToast` | `Toast` / `ToastContainer` / `useBsToast()` / `$bsToast` |
| `Collapse`، `Accordion`، `Alert`، `Card`، `ListGroup`، `Nav`، `Spinner`، `Form` | همان نام‌ها |
| `.badge bg-*` و `text-bg-*` | prop به نام `theme` (`.theme-*`) |
| `btn-primary` و `btn-outline-*` | `variant` و `theme` در `Button` |

<div dir="rtl" align="right">

تغییرات ناسازگار: فقط ESM؛ Vue ≥ 3.4؛ مارک‌آپ و کلاس‌های بوت‌استرپ ۶؛ data API بوت‌استرپ (`data-bs-*`) هنگام استفاده از پکیج غیرفعال است؛ کامپوننت‌ها دیگر هیچ CSS ای همراه ندارند (Pagination نسخه ۲ یک استایل کوچک داشت).

## نکات

- بوت‌استرپ ۶ هنوز در مرحله‌ی alpha است و API آن ممکن است تغییر کند. این پکیج روی `^6.0.0-alpha.1` تنظیم شده است.
- Combobox به صورت داخلی روی دکمه‌ی خودش یک `Menu` می‌سازد؛ بوت‌استرپ ۶ alpha به همین دلیل یک هشدار بی‌خطر «more than one instance per element» در کنسول می‌نویسد.
- کامپوننت‌هایی که DOM خودشان را تغییر می‌دهند (Chips، Combobox، OTP، Strength، Nav overflow، Menu) مارک‌آپ داخلی را یک بار رندر می‌کنند و مدیریتش با بوت‌استرپ است؛ داخل ناحیه‌های مدیریت‌شده توسط بوت‌استرپ فرزند reactive اضافه نکنید.

## مجوز

ISC © NovinVision

</div>
