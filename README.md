# vue3-bootstrap-components

Twitter Bootstrap 5 components for Vue 3, built as thin wrapper components around Bootstrap's markup and JS plugins (Collapse, Modal, Tab, Dropdown, Offcanvas). Designed to work well with Laravel + Inertia.js projects (it automatically closes open Modals/Offcanvas/Dropdowns on Inertia page visits).

This package has been developed and maintained by **[Novin Vision](https://novinvision.com)** (شرکت **[نوین ویژن](https://novinvision.com)**), a team specialized in **[طراحی سایت](https://novinvision.com)** and **[web design](https://novinvision.com)**.

- **Package name:** `vue3-bootstrap-components`
- **Vue version:** 3.x
- **Bootstrap version:** 5.3.x
- **Written in:** TypeScript / Vue SFCs, bundled with Vite

---

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Bootstrap CSS & JS setup](#bootstrap-css--js-setup)
4. [Using the components](#using-the-components)
5. [Component Reference](#component-reference)
    - [Alert](#alert)
    - [Button / ButtonGroup](#button--buttongroup-not-currently-published)
    - [Card](#card)
    - [Container](#container-not-currently-published)
    - [Collapse](#collapse)
    - [Accordion](#accordion)
    - [Dropdown](#dropdown)
    - [Modal](#modal)
    - [OffCanvas](#offcanvas)
    - [Tab](#tab)
    - [Nav](#nav)
    - [ListGroup](#listgroup)
    - [Form (InputGroup)](#form-inputgroup)
    - [Pagination](#pagination-not-currently-published)
    - [Placeholder](#placeholder-not-currently-published)
    - [ProgressBar](#progressbar-not-currently-published)
    - [Spinner](#spinner-not-currently-published)
    - [SidebarOffCanvasButton](#sidebaroffcanvasbutton-not-currently-published)
6. [Inertia.js integration](#inertiajs-integration)
7. [TypeScript support](#typescript-support)
8. [Known issues / limitations](#known-issues--limitations)
9. [License](#license)

---

## Requirements

This package does **not** bundle Bootstrap or Vue — they are peer dependencies, so you control their versions and configuration yourself:

| Package | Required version |
|---|---|
| `vue` | `^3.0.0` |
| `bootstrap` | `^5.3.3` |

Some components (`Dropdown`) rely on Bootstrap's own JS plugins, which in turn depend on **Popper**. If you plan to use `Dropdown`, also install `@popperjs/core` as documented in [Bootstrap's own Dropdown docs](https://getbootstrap.com/docs/5.3/components/dropdowns/).

## Installation

Install the package together with its peer dependencies:

```bash
npm install vue3-bootstrap-components bootstrap
# or
yarn add vue3-bootstrap-components bootstrap
# or
pnpm add vue3-bootstrap-components bootstrap
```

If you need the `Dropdown` component:

```bash
npm install @popperjs/core
```

## Bootstrap CSS & JS setup

This library only ships **Vue components** that render Bootstrap's HTML markup and, where needed, import Bootstrap's individual JS plugin modules directly (e.g. `bootstrap/js/src/collapse`, `bootstrap/js/dist/modal`). It does **not** ship or override Bootstrap's CSS.

You are responsible for importing Bootstrap's CSS (and, if you want, its Sass so you can use Bootstrap's own customization variables) in your app's entry point:

```js
// main.js / app.js
import 'bootstrap/dist/css/bootstrap.min.css'
// or, if you want to customize Bootstrap via Sass variables (colors, spacing, etc.),
// follow Bootstrap's own theming docs and import your custom .scss instead:
// https://getbootstrap.com/docs/5.3/customize/sass/
```

Because each interactive component (`Collapse`, `Modal`, `Tab`, `Dropdown`, `OffCanvas`) imports the specific Bootstrap JS module it needs internally, you generally do **not** need to import the full `bootstrap.bundle.js` yourself. Any Bootstrap-level configuration (animation duration, backdrop behavior, data attributes, RTL support, dark mode, etc.) is entirely governed by Bootstrap itself — refer to Bootstrap's own documentation for those options, since this package does not add a configuration layer on top of them:

- Bootstrap docs: https://getbootstrap.com/docs/5.3/
- RTL support (relevant if you're building a Persian/RTL UI): https://getbootstrap.com/docs/5.3/getting-started/rtl/

## Using the components

You can import components individually wherever you need them (recommended, enables tree-shaking):

```vue
<script setup>
import { Alert, Modal, ModalHeader, ModalBody, ModalFooter, ModalButton } from 'vue3-bootstrap-components'
</script>

<template>
  <Alert type="success">Saved successfully.</Alert>
</template>
```

Or register everything globally (not recommended for large apps, but convenient for quick prototyping):

```js
// main.js
import { createApp } from 'vue'
import * as BootstrapComponents from 'vue3-bootstrap-components'
import App from './App.vue'

const app = createApp(App)

Object.entries(BootstrapComponents).forEach(([name, component]) => {
  app.component(name, component)
})

app.mount('#app')
```

---

## Component Reference

Each entry below reflects exactly what the component's source code does (props, events, slots, exposed methods) rather than a generic description, so you know precisely what to expect.

### Alert

Wraps Bootstrap's `.alert` markup.

**Props**
| Prop | Type | Default | Notes |
|---|---|---|---|
| `type` | `String` | `'warning'` | Appended as `alert-{type}` (e.g. `success`, `danger`, `info`) |

```vue
<Alert type="danger">Something went wrong.</Alert>
```

### Card

A set of plain structural wrapper components — none of them take props.

| Component | Renders |
|---|---|
| `Card` | `<div class="card">` |
| `CardHeader` | `<div class="card-header">` |
| `CardBody` | `<div class="card-body">` |
| `CardFooter` | `<div class="card-footer">` |
| `CardImgOverly` | `<div class="card-img-overlay">` (note: named "Overly", not "Overlay", in the package's export) |

```vue
<Card>
  <CardHeader>Title</CardHeader>
  <CardBody>Body content</CardBody>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Collapse

Wraps Bootstrap's Collapse plugin (`bootstrap/js/src/collapse`).

**`Collapse`**

| Prop | Type | Default |
|---|---|---|
| `name` | `String` | `'collapseExample'` — used to build the element's `id` as `{name}Collapse` |

- **Emits:** `hide`, `hidden`, `show`, `shown` (forwarded 1:1 from Bootstrap's `hide.bs.collapse` / `hidden.bs.collapse` / `show.bs.collapse` / `shown.bs.collapse` events)
- **Exposes (via template ref):** `show()`, `hide()`, `toggle()`

**`CollapseButton`**

| Prop | Type | Required |
|---|---|---|
| `name` | `String` | Yes — must match the target `Collapse`'s `name` |

```vue
<CollapseButton name="details">Toggle details</CollapseButton>
<Collapse name="details">
  Extra content that expands/collapses.
</Collapse>
```

You can also drive it programmatically:

```vue
<script setup>
import { ref } from 'vue'
const collapseRef = ref(null)
</script>

<Collapse name="details" ref="collapseRef" @shown="onShown">...</Collapse>
<button @click="collapseRef.show()">Open</button>
```

### Accordion

Wraps Bootstrap's Accordion pattern (built on Collapse).

| Component | Props | Notes |
|---|---|---|
| `Accordion` | `name` (`String`, default `'accordionExample'`) | Root `.accordion` wrapper. Emits `hide`/`hidden`/`show`/`shown`; exposes `show()`/`hide()`/`toggle()`. |
| `AccordionItem` | `name` (`String`, **required**) | Wraps one accordion entry (`.accordion-item`). |
| `AccordionButton` | `name` (`String`, optional) | The clickable header; targets `#accordion-collapse-{name}`. |
| `AccordionCollapse` | `name` (`String`, **required**) | The collapsible panel content. |

```vue
<Accordion name="faq">
  <AccordionItem name="q1">
    <AccordionButton>What is this?</AccordionButton>
    <AccordionCollapse name="q1">Answer goes here.</AccordionCollapse>
  </AccordionItem>
</Accordion>
```

> ⚠️ See [Known issues](#known-issues--limitations) — in the current published build, `AccordionCollapse` panels do not render their content, and `Accordion`'s internal `provide()` call throws at runtime. Treat `Accordion` as **not usable as-is** until these are fixed upstream.

### Dropdown

Wraps Bootstrap's Dropdown plugin (`bootstrap/js/src/dropdown` — requires Popper, see [Requirements](#requirements)).

| Component | Notes |
|---|---|
| `Dropdown` | `.dropdown` wrapper, no props. |
| `DropdownToggle` | The trigger button (`data-bs-toggle="dropdown"`). Exposes `show()`/`hide()`. |
| `DropdownMenu` | `.dropdown-menu` wrapper, no props. Add your own `<a class="dropdown-item">` links inside. |

```vue
<Dropdown>
  <DropdownToggle>Options</DropdownToggle>
  <DropdownMenu>
    <a class="dropdown-item" href="#">Edit</a>
    <a class="dropdown-item" href="#">Delete</a>
  </DropdownMenu>
</Dropdown>
```

### Modal

Wraps Bootstrap's Modal plugin (`bootstrap/js/dist/modal`).

**`Modal`**

| Prop | Type | Default |
|---|---|---|
| `name` | `String` | **required** — used as the element `id` and as the target for `ModalButton`/`ModalDismiss` |
| `effect` | `String` | `'fade'` — appended as a class alongside `.modal` |

- **Emits:** `opened` (on `shown.bs.modal`), `closed` (on `hidden.bs.modal`)
- **Exposes:** `show()`, `hide()`

**Structural sub-components** (all no-prop wrappers unless noted): `ModalDialog` (`.modal-dialog`), `ModalContent` (`.modal-content`), `ModalBody` (`.modal-body`), `ModalFooter` (`.modal-footer`).

**`ModalHeader`**

| Prop | Type | Default |
|---|---|---|
| `showClose` | `Boolean` | `true` — renders a built-in close button when true |

**`ModalButton`** (opens a modal)

| Prop | Type | Required |
|---|---|---|
| `name` | `String` | Yes — must match the `Modal`'s `name` |

**`ModalDismiss`** (closes the nearest modal) — see [Known issues](#known-issues--limitations); not currently included in the published bundle.

```vue
<ModalButton name="confirmModal">Delete item</ModalButton>

<Modal name="confirmModal" @opened="onOpened">
  <ModalDialog>
    <ModalContent>
      <ModalHeader>Are you sure?</ModalHeader>
      <ModalBody>This action cannot be undone.</ModalBody>
      <ModalFooter>
        <button class="btn btn-danger">Confirm</button>
      </ModalFooter>
    </ModalContent>
  </ModalDialog>
</Modal>
```

### OffCanvas

Wraps Bootstrap's Offcanvas plugin (`bootstrap/js/dist/offcanvas`).

**`OffCanvas`**

| Prop | Type | Default |
|---|---|---|
| `name` | `String` | `'offcanvasExample'` — used as the element `id` |

- **Emits:** `hide`, `hidden`, `hidePrevented`, `show`, `shown`
- **Exposes:** `show()`, `hide()`

**`OffCanvasHeader`** / **`OffCanvasButton`**

| Prop | Type | Default |
|---|---|---|
| `name` | `String` | `'offcanvas'` |

`OffCanvasButton`'s `name` must match the target `OffCanvas`'s `name` (it toggles `#{name}`). `OffCanvasHeader` builds its title id as `{name}Label`, so pass the same `name` there too — it does not automatically inherit it from the parent `OffCanvas`.

**`OffCanvasBody`** — structural wrapper (`.offcanvas-body`); its `name` prop exists but isn't currently used in the template.

```vue
<OffCanvasButton name="cartCanvas">Open cart</OffCanvasButton>

<OffCanvas name="cartCanvas">
  <OffCanvasHeader name="cartCanvas">Your Cart</OffCanvasHeader>
  <OffCanvasBody>
    ...cart items...
  </OffCanvasBody>
</OffCanvas>
```

### Tab

Wraps Bootstrap's Tab plugin (`bootstrap/js/src/tab`).

| Component | Props | Notes |
|---|---|---|
| `Tab` | `name` (`String`, default `'tabExample'`) | Root wrapper (`.bs-tab-area`). |
| `TabButton` | `name` (`String`, **required**) | The clickable tab trigger. Exposes `show()`. Emits `hide`/`hidden`/`show`/`shown`. |
| `TabContent` | `name` (`String`, default `'myTab'`) | Wraps all `TabPane`s (`.tab-content`). |
| `TabPane` | `name` (`String`, default `'tab1'`), `animation` | An individual tab panel. |

```vue
<Tab name="settingsTabs">
  <TabButton name="general">General</TabButton>
  <TabButton name="security">Security</TabButton>
</Tab>

<TabContent name="settingsTabs">
  <TabPane name="general">General settings...</TabPane>
  <TabPane name="security">Security settings...</TabPane>
</TabContent>
```

> ⚠️ See [Known issues](#known-issues--limitations) — `Tab`'s internal `provide()` call has the same bug as `Accordion`'s and will throw at runtime in the current published build.

### Nav

Structural navigation wrappers.

| Component | Props | Renders |
|---|---|---|
| `Nav` | — | `<ul class="nav">` |
| `NavItem` | — | `<li class="nav-item">` |
| `NavLink` | `active` (`Boolean`, **required**), `href` (`String`, **required**) | `<a class="nav-link">` |

```vue
<Nav>
  <NavItem><NavLink :active="true" href="/">Home</NavLink></NavItem>
  <NavItem><NavLink :active="false" href="/about">About</NavLink></NavItem>
</Nav>
```

### ListGroup

| Component | Renders |
|---|---|
| `ListGroup` | `<div class="list-group">` |
| `ListGroupItem` | `<div class="list-group-item">` |

### Form (InputGroup)

| Component | Renders |
|---|---|
| `InputGroup` | `<div class="input-group">` |
| `InputGroupText` | `<div class="input-group-text">` |

```vue
<InputGroup>
  <InputGroupText>@</InputGroupText>
  <input type="text" class="form-control" placeholder="username">
</InputGroup>
```

---

The following components exist in the package's `src/` folder but are **not currently exported from the package's public entry point or included in the built `dist/` bundle** — importing them from `vue3-bootstrap-components` will not work today. They're listed here for completeness / awareness, in case you're building from source or these get published in a future version.

### Button / ButtonGroup (not currently published)
Plain wrappers: `Button` → `<button class="btn">`, `ButtonGroup` → `<div class="btn-group">`.

### Container (not currently published)
`<div class="container">` wrapper, no props.

### Pagination (not currently published)
A Laravel-pagination-shaped component (expects props like `links`, `current_page`, `last_page`, `total`, matching Laravel's default paginator JSON shape) that renders a Bootstrap `.pagination` nav. Emits a `page` event.

### Placeholder (not currently published)
Wraps Bootstrap's placeholder loading UI. Props: `type` (`String`, default `'glow'`), `holderClass` (`String`).

### ProgressBar (not currently published)
Props: `value` (`Number`, **required**, default `0`) — renders a striped/animated Bootstrap progress bar sized to `value`%.

### Spinner (not currently published)
Props: `type` (`String`, default `'border'`), `size` (`String`, default `'sm'`) — renders `<i class="spinner-{type} spinner-{type}-{size}">`.

### SidebarOffCanvasButton (not currently published)
A custom sidebar-toggle button that expects an `appSetOverly` function to be provided by an ancestor and an element with `id="appOverly"` to exist in the DOM (for a click-outside-to-close overlay pattern). Props: `name` (`String`, **required**).

---

## Inertia.js integration

All interactive components (`Collapse`, `Accordion`, `Modal`, `Tab`, `Dropdown`, `OffCanvas`) share a composable (`useBootstrapInstance`) that automatically listens for Inertia's `inertia:start` event. On a plain `GET` navigation, it calls `.hide()` on the active Bootstrap instance and removes any leftover `.modal-backdrop` elements — so open modals/offcanvas/collapses/tabs close cleanly instead of staying stuck open across an Inertia page visit. No extra setup is needed on your end for this to work; it's automatic as long as Inertia is present on the page and dispatches its normal events.

## TypeScript support

Type declarations are published via `dist/index.d.ts` (referenced from `package.json`'s `types` field), so autocompletion for component names works out of the box in TS/Vue projects. Note that the shipped `.d.ts` file lists a few components/props that don't match the actual current implementation 1:1 (e.g. it includes `ModalDismiss`, `fullscreen`/`dialogClass` props on `Modal`, and several `TabNav*`/`Dropdown*Item` names that don't exist in the current `src/`) — treat the component reference above, not the `.d.ts` file, as the source of truth for what's actually implemented today.

## Known issues / limitations

These are things to be aware of if you run into unexpected behavior — several are real bugs in the current source, not intentional design:

1. **`AccordionCollapse` never renders its content.** Its `isActive` computed property is hardcoded to always return `false`, and the panel's `v-if="isActive"` means the collapse body is never mounted regardless of open/closed state.
2. **`Accordion` throws at runtime.** Its `provide({ 'accordionName': props.value.name })` call accesses `props.value.name`, but `props` from `defineProps()` in `<script setup>` is not a ref — it should be `props.name`. This will throw as soon as the component mounts.
3. **`Tab` has the same bug as `Accordion`** in its `provide({ 'tabName': props.value.name })` call, and `TabButton`'s computed `tabBtnName`/`tabPaneName` also read `props.value.name` instead of `props.name`.
4. **`TabPane`'s `aria-labelledby` references an undefined variable** (`tabPaneNames`, plural, a typo) instead of its own computed `tabBtnName`.
5. **`TabPane`'s `animation` prop is typed `Number` but defaulted to the string `'fade'`** — a type/default mismatch.
6. **`ModalDismiss` is not included in the published `dist/` bundle** even though it's exported from `src/Components/Modal/index.ts` and listed in `index.d.ts`. Until this is fixed, use a plain Bootstrap close button instead: `<button type="button" class="btn-close" data-bs-dismiss="modal"></button>`.
7. **`OffCanvasHeader`/`OffCanvasButton` don't inherit `name` from a parent `OffCanvas` via provide/inject** — unlike `Modal`, you must repeat the same `name` value on each of `OffCanvas`, `OffCanvasHeader`, and `OffCanvasButton` manually.
8. Several components documented above under "not currently published" exist in `src/` but aren't wired into the package's public exports or Vite build entry (`src/index.ts`) — they can't be imported from the published package as-is.

## License

ISC (see `package.json`).