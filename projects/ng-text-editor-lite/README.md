# @thedevankit/ng-text-editor-lite

> Lightweight Angular 18+ WYSIWYG rich text editor — no ProseMirror, no Quill, no TipTap.

[![npm version](https://img.shields.io/npm/v/@thedevankit/ng-text-editor-lite)](https://www.npmjs.com/package/@thedevankit/ng-text-editor-lite)
[![license](https://img.shields.io/npm/l/@thedevankit/ng-text-editor-lite)](https://github.com/thedevankit/ng-text-editor-lite/blob/main/LICENSE)
[![Angular](https://img.shields.io/badge/Angular-18%2B-red)](https://angular.dev)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@thedevankit/ng-text-editor-lite)](https://bundlephobia.com/package/@thedevankit/ng-text-editor-lite)

---

## What is this?

`@thedevankit/ng-text-editor-lite` is a purpose-built Angular rich text editor that solves the problems that come with adopting large editor ecosystems:

| Problem with existing solutions | How this package solves it |
|---|---|
| Heavy bundle size (CKEditor, TinyMCE, Quill) | Zero external editor engine — built on native `contenteditable` |
| CSS leakage from Bootstrap / Tailwind / Material | Scoped CSS prefix + internal `all: unset` reset |
| Broken pasted content from ChatGPT / GitHub | Automatic markdown detection and conversion on paste |
| Complex Angular wrapper maintenance | Angular-native standalone component, no wrapper layer |
| XSS vulnerabilities from rich content | Mandatory DOMPurify sanitization on every entry point |
| Inconsistent edit vs read rendering | Same HTML rendered in both modes, no re-parse |

---

## Features

- **Lightweight** — no ProseMirror, no Quill, no Slate, no TipTap; built on `contenteditable`
- **Angular 18+ native** — standalone component, signals-ready, tree-shakeable
- **Reactive Forms** — implements `ControlValueAccessor`; works with `FormControl`, `formControlName`, and `[(ngModel)]`
- **Markdown paste** — auto-detects and converts markdown pasted from ChatGPT, GitHub, Notion, and docs tools
- **XSS-safe** — DOMPurify sanitizes every HTML entry point; `<script>`, event handlers, and dangerous URL schemes are always stripped
- **CSS isolation** — host application styles cannot affect editor typography, spacing, or colours
- **Light & dark themes** — CSS custom property token system, runtime switchable
- **Four rendering modes** — `edit`, `readonly`, `preview`, `disabled`
- **Mention badges** — static `@mention` rendering with configurable colours
- **Keyboard shortcuts** — `Ctrl/Cmd + B`, `Ctrl/Cmd + I`
- **Configurable** — placeholder, maxLength, autoGrow, minHeight, maxHeight, theme, mention colours
- **Angular Package Format** — ESM, full tree-shaking, TypeScript declarations included

---

## Installation

```bash
npm install @thedevankit/ng-text-editor-lite
```

DOMPurify is a required peer dependency:

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

**Peer dependencies:**

| Package | Version |
|---|---|
| `@angular/core` | `>=18.0.0` |
| `@angular/common` | `>=18.0.0` |
| `@angular/forms` | `>=18.0.0` |
| `dompurify` | `>=3.0.0` |

---

## Quick Start

### 1. Import the component

```ts
import { EditorComponent } from '@thedevankit/ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [EditorComponent],
  // ...
})
export class MyComponent {}
```

### 2. Add to your template

```html
<ng-text-editor-lite
  [content]="html"
  [mode]="'edit'"
  [config]="editorConfig"
  (contentChange)="onChanged($event)"
/>
```

### 3. Wire up your component

```ts
import { Component } from '@angular/core';
import {
  EditorComponent,
  EditorConfig,
  EditorEventPayload
} from '@thedevankit/ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './my.component.html',
})
export class MyComponent {
  html = '';

  editorConfig: EditorConfig = {
    placeholder: 'Start writing...',
    maxLength: 3000,
    autoGrow: true,
    minHeight: '200px',
    maxHeight: '500px',
    theme: 'light',
  };

  onChanged(event: EditorEventPayload): void {
    this.html = event.html;       // sanitized HTML
    console.log(event.text);      // plain text
    console.log(event.timestamp); // Unix ms
  }
}
```

---

## Reactive Forms

```ts
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from '@thedevankit/ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EditorComponent],
  template: `
    <form [formGroup]="form">
      <ng-text-editor-lite formControlName="body" />
    </form>
  `,
})
export class PostFormComponent {
  form = this.fb.group({ body: [''] });
  constructor(private fb: FormBuilder) {}
}
```

---

## Configuration Reference

All options are optional. Pass them via `[config]`.

```ts
import { EditorConfig } from '@thedevankit/ng-text-editor-lite';
```

| Option | Type | Default | Description |
|---|---|---|---|
| `placeholder` | `string` | `'Type here...'` | Shown when editor is empty |
| `maxLength` | `number` | `3000` | Max plain-text character count |
| `autoGrow` | `boolean` | `true` | Expand height with content |
| `minHeight` | `string` | `'200px'` | Minimum editor height (any CSS unit) |
| `maxHeight` | `string` | `'500px'` | Maximum height before scroll |
| `theme` | `'light' \| 'dark'` | `'light'` | Colour theme |
| `mentionTextColor` | `string` | *(theme default)* | `@mention` badge foreground |
| `mentionBackgroundColor` | `string` | *(theme default)* | `@mention` badge background |

---

## Modes

| Mode | Toolbar | Editable | Use case |
|---|---|---|---|
| `edit` | Visible | Yes | Default writing mode |
| `readonly` | Hidden | No | Published / display view |
| `preview` | Hidden | No | Draft preview |
| `disabled` | Hidden | No | Form disabled state |

```html
<ng-text-editor-lite [mode]="'readonly'" [content]="savedHtml" />
```

---

## Event API

| Event | Payload | Fires when |
|---|---|---|
| `(contentChange)` | `EditorEventPayload` | Content changes |
| `(onInit)` | `EditorEventPayload` | Editor initialized |
| `(onFocusEvent)` | `void` | Editor focused |
| `(onBlurEvent)` | `void` | Editor blurred |
| `(onPaste)` | `EditorEventPayload` | Paste processed |
| `(onDestroy)` | `void` | Component destroyed |
| `(onModeChange)` | `EditorMode` | Mode input changed |
| `(onValidationError)` | `string` | Validation failed (`'maxLength'` \| `'disabled'`) |

```ts
interface EditorEventPayload {
  html: string;       // sanitized HTML
  text: string;       // plain text (tags stripped)
  timestamp: number;  // Unix ms
}
```

---

## Theming

The editor uses CSS custom properties scoped to the host element. Override any token from your stylesheet:

```scss
ng-text-editor-lite {
  --ngx-editor-bg:          #fdf6e3;
  --ngx-editor-color:       #657b83;
  --ngx-editor-border:      #ccc8b0;
  --ngx-editor-toolbar-bg:  #eee8d5;
  --ngx-editor-link-color:  #268bd2;
  --ngx-editor-mention-bg:  #e8d5f5;
  --ngx-editor-mention-color: #6b21a8;
}
```

Switch theme at runtime:

```ts
config = signal<EditorConfig>({ theme: 'dark' });
```

---

## Markdown Paste Support

When content is pasted, the editor automatically detects markdown and converts it before insertion:

| Markdown | Converts to |
|---|---|
| `# Heading` | `<h1>` |
| `## Subheading` | `<h2>` |
| `**bold**` | `<strong>` |
| `*italic*` | `<em>` |
| `[text](url)` | `<a>` |
| `- item` | `<ul><li>` |
| `1. item` | `<ol><li>` |

Unsupported markdown syntax passes through as plain text and never corrupts editor state.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl / Cmd + B` | Bold |
| `Ctrl / Cmd + I` | Italic |

---

## Security

Every HTML string entering the editor is sanitized by DOMPurify:

- `<script>`, `<iframe>`, `<object>`, `<embed>` — always stripped
- `onclick`, `onerror`, and all event attributes — stripped
- `javascript:`, `data:`, `vbscript:` URL schemes — stripped from `href`
- All links get `target="_blank" rel="noopener noreferrer"` enforced

No content bypasses the sanitizer — this applies to `[content]` binding, clipboard paste, and programmatic `writeValue`.

---

## Documentation

Full documentation is available in the GitHub repository:

| Guide | Link |
|---|---|
| Installation | [docs/installation.md](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/installation.md) |
| Angular Setup Examples | [docs/angular-setup.md](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/angular-setup.md) |
| Configuration Reference | [docs/configuration.md](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/configuration.md) |
| Event API | [docs/events.md](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/events.md) |
| Theming Guide | [docs/theming.md](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/theming.md) |
| Markdown Support | [docs/markdown.md](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/markdown.md) |
| Security Notes | [docs/security.md](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/security.md) |
| Contribution Guide | [docs/contributing.md](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/contributing.md) |

---

## Browser Support

| Browser | Supported |
|---|---|
| Chrome | Yes |
| Edge | Yes |
| Firefox | Yes |
| Safari | Yes |

> This package targets browser environments only. SSR / server-side rendering is not supported.

---

## Contributing

Contributions are welcome. See the [Contribution Guide](https://github.com/thedevankit/ng-text-editor-lite/blob/main/docs/contributing.md) for local setup, test commands, coding standards, and the PR checklist.

---

## Author

**Ankitkumar Singh**
[github.com/thedevankit](https://github.com/thedevankit) · [thedevankit@gmail.com](mailto:thedevankit@gmail.com)

---

## License

[MIT](https://github.com/thedevankit/ng-text-editor-lite/blob/main/LICENSE) © Ankitkumar Singh
