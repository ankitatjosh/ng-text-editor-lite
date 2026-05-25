# Theming Guide

`ng-text-editor-lite` uses CSS custom properties (variables) for all visual tokens. The `ThemeService` writes these directly onto the host element's `style` attribute, so they are always scoped to the specific editor instance and cannot affect other elements.

---

## Built-in themes

Set the theme via `EditorConfig`:

```ts
config: EditorConfig = { theme: 'light' }; // or 'dark'
```

---

## Token reference

| CSS Variable | Light value | Dark value | Controls |
|---|---|---|---|
| `--ngx-editor-bg` | `#ffffff` | `#1e1e2e` | Editor background |
| `--ngx-editor-color` | `#1a1a1a` | `#cdd6f4` | Text colour |
| `--ngx-editor-border` | `#d1d5db` | `#45475a` | Border colour |
| `--ngx-editor-toolbar-bg` | `#f9fafb` | `#181825` | Toolbar background |
| `--ngx-editor-link-color` | `#2563eb` | `#89b4fa` | Link and focus ring colour |
| `--ngx-editor-mention-bg` | `#dbeafe` | `#313244` | `@mention` badge background |
| `--ngx-editor-mention-color` | `#1e40af` | `#89b4fa` | `@mention` badge text |

---

## Overriding individual tokens via config

Use `mentionTextColor` and `mentionBackgroundColor` in `EditorConfig` to override mention colours without changing the rest of the theme:

```ts
config: EditorConfig = {
  theme: 'light',
  mentionTextColor: '#7c3aed',
  mentionBackgroundColor: '#ede9fe',
};
```

---

## Overriding tokens via CSS

Since CSS variables are set on the host element, you can override any token from your component's stylesheet by targeting the host selector. This works in both light and dark mode:

```scss
// In your component stylesheet (or a global stylesheet)
ng-text-editor-lite {
  --ngx-editor-bg: #fdf6e3;
  --ngx-editor-color: #657b83;
  --ngx-editor-border: #ccc8b0;
  --ngx-editor-toolbar-bg: #eee8d5;
  --ngx-editor-link-color: #268bd2;
}
```

> Token overrides from `config` always take precedence over external CSS because they are written as inline styles on the host element.

---

## Dark mode with Angular CDK or system preference

Switch the theme at runtime by updating your config:

```ts
import { Component, signal } from '@angular/core';
import { EditorComponent, EditorConfig } from 'ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [EditorComponent],
  template: `
    <button (click)="toggleTheme()">Toggle theme</button>
    <ng-text-editor-lite [config]="config()" />
  `,
})
export class ThemedEditorComponent {
  config = signal<EditorConfig>({ theme: 'light' });

  toggleTheme(): void {
    this.config.update(c => ({ ...c, theme: c.theme === 'light' ? 'dark' : 'light' }));
  }
}
```

### Respecting `prefers-color-scheme`

```ts
ngOnInit(): void {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  this.config.update(c => ({ ...c, theme: prefersDark ? 'dark' : 'light' }));
}
```

---

## CSS isolation

The editor uses scoped CSS selectors (`.ngx-editor-lite h1`, `.ngx-editor-lite p`, etc.) and an internal `all: unset` reset on the editable surface. This means:

- **Bootstrap**, **Tailwind**, **Angular Material**, and global CSS resets cannot override editor typography.
- Heading sizes, paragraph spacing, list indentation, and link colours are fully controlled by the editor's own stylesheet.
- Your application's global styles remain unaffected by the editor's internal styles.

If you need to adjust typography inside the editor, override the CSS variables above rather than targeting internal selectors.

---

## Related

- [Configuration reference →](./configuration.md)
- [Security notes →](./security.md)
