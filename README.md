# ng-text-editor-lite

A lightweight, Angular-native WYSIWYG rich text editor with markdown-aware paste support.

Built for Angular 18+ using `contenteditable` — no ProseMirror, no Quill, no TipTap. Isolated styles, DOMPurify sanitization, and full Reactive Forms support out of the box.

---

## Features

- **Lightweight** — no external editor engine dependency
- **Markdown paste** — detects and converts markdown from ChatGPT, GitHub, Notion, and similar tools
- **CSS isolation** — host application styles (Bootstrap, Tailwind, Material) cannot leak in
- **Angular-native** — standalone component, ControlValueAccessor, `@Input`/`@Output` API
- **Reactive Forms** — works with `FormControl`, `formControlName`, and `[(ngModel)]`
- **XSS-safe** — every HTML entry point passes through DOMPurify
- **Theming** — light and dark themes via CSS custom properties, runtime switchable
- **Mentions** — static `@mention` badge rendering with configurable colours
- **Four modes** — `edit`, `readonly`, `preview`, `disabled`
- **Tree-shakeable** — Angular Package Format, no forced NgModule

---

## Quick start

```bash
npm install ng-text-editor-lite dompurify
npm install --save-dev @types/dompurify
```

```ts
import { EditorComponent } from 'ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [EditorComponent],
  template: `
    <ng-text-editor-lite
      [content]="html"
      [config]="{ placeholder: 'Start writing...', theme: 'light' }"
      (contentChange)="html = $event.html"
    />
  `,
})
export class MyComponent {
  html = '';
}
```

---

## Documentation

| Guide | Description |
|---|---|
| [Installation](./docs/installation.md) | npm install, peer deps, NgModule vs standalone |
| [Angular Setup](./docs/angular-setup.md) | Standalone, Reactive Forms, ngModel, mode switching |
| [Configuration](./docs/configuration.md) | All `EditorConfig` options with types and defaults |
| [Event API](./docs/events.md) | All `@Output` events, payloads, and usage patterns |
| [Theming](./docs/theming.md) | CSS variables, light/dark themes, per-instance overrides |
| [Markdown Support](./docs/markdown.md) | Supported syntax, paste pipeline, unsupported constructs |
| [Security](./docs/security.md) | DOMPurify config, blocked elements, XSS prevention |
| [Contributing](./docs/contributing.md) | Local setup, tests, lint, PR checklist |

---

## Component API at a glance

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `[content]` | `string` | `''` | Initial HTML content |
| `[mode]` | `'edit' \| 'readonly' \| 'preview' \| 'disabled'` | `'edit'` | Editor mode |
| `[config]` | `EditorConfig` | `{}` | Configuration object |

### Outputs

| Output | Payload | When |
|---|---|---|
| `(contentChange)` | `EditorEventPayload` | Every content change |
| `(onInit)` | `EditorEventPayload` | Component initialized |
| `(onFocusEvent)` | `void` | Editor focused |
| `(onBlurEvent)` | `void` | Editor blurred |
| `(onPaste)` | `EditorEventPayload` | Paste processed |
| `(onDestroy)` | `void` | Component destroyed |
| `(onModeChange)` | `EditorMode` | Mode changed |
| `(onValidationError)` | `string` | Validation failed |

### EditorEventPayload

```ts
interface EditorEventPayload {
  html: string;       // sanitized HTML
  text: string;       // plain text (tags stripped)
  timestamp: number;  // Unix ms
}
```

---

## Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl / Cmd + B` | Bold |
| `Ctrl / Cmd + I` | Italic |

---

## Development

```bash
# Install dependencies
npm install

# Build the library
npx @angular/cli build ng-text-editor-lite

# Run the demo app
npx @angular/cli serve demo

# Run library tests
npx @angular/cli test ng-text-editor-lite --watch=false

# Run demo tests
npx @angular/cli test demo --watch=false

# Lint
npx @angular/cli lint ng-text-editor-lite
```

---

## Browser support

Chrome · Edge · Firefox · Safari

This package targets browser environments only. SSR is not supported.

---

## License

MIT
