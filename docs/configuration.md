# Configuration Reference

All configuration is passed via the `[config]` input as an `EditorConfig` object. Every property is optional and falls back to its default.

```ts
import { EditorConfig } from 'ng-text-editor-lite';
```

---

## EditorConfig interface

```ts
interface EditorConfig {
  placeholder?:           string;       // default: 'Type here...'
  maxLength?:             number;       // default: 3000
  autoGrow?:              boolean;      // default: true
  minHeight?:             string;       // default: '200px'
  maxHeight?:             string;       // default: '500px'
  theme?:                 'light' | 'dark'; // default: 'light'
  mentionTextColor?:      string;       // default: theme token
  mentionBackgroundColor?: string;      // default: theme token
}
```

---

## Property reference

### `placeholder`

Text shown inside the editor when content is empty. Disappears as soon as the user types.

```ts
config = { placeholder: 'Write your message here...' };
```

---

### `maxLength`

Maximum number of plain-text characters allowed. Counting strips HTML tags — only visible characters count. When exceeded, `onValidationError` fires and the input is blocked.

```ts
config = { maxLength: 500 };
```

Default: `3000`

---

### `autoGrow`

When `true` the editor expands vertically with content up to `maxHeight`, then scrolls. When `false` the editor stays at `minHeight` and scrolls internally.

```ts
config = { autoGrow: false };
```

Default: `true`

---

### `minHeight`

Minimum height of the editor surface. Accepts any valid CSS length value.

```ts
config = { minHeight: '300px' };
```

Default: `'200px'`

---

### `maxHeight`

Maximum height before the editor scrolls. Only applies when `autoGrow` is `true`.

```ts
config = { maxHeight: '80vh' };
```

Default: `'500px'`

---

### `theme`

Switches between the built-in light and dark colour palettes. See the [Theming guide](./theming.md) for token values and custom overrides.

```ts
config = { theme: 'dark' };
```

Default: `'light'`

---

### `mentionTextColor`

Overrides the foreground colour of `@mention` badge elements. Accepts any valid CSS colour string. Takes precedence over the current theme's mention token.

```ts
config = { mentionTextColor: '#7c3aed' };
```

---

### `mentionBackgroundColor`

Overrides the background colour of `@mention` badge elements.

```ts
config = { mentionBackgroundColor: '#ede9fe' };
```

---

## Inputs and outputs summary

### Inputs

| Input | Type | Default | Description |
|---|---|---|---|
| `[content]` | `string` | `''` | Initial HTML content |
| `[mode]` | `EditorMode` | `'edit'` | Editor mode |
| `[config]` | `EditorConfig` | `{}` | Configuration object |

### Outputs

See the full [Event API →](./events.md)

---

## Example: full config

```ts
editorConfig: EditorConfig = {
  placeholder: 'Start typing...',
  maxLength: 1500,
  autoGrow: true,
  minHeight: '150px',
  maxHeight: '600px',
  theme: 'dark',
  mentionTextColor: '#c4b5fd',
  mentionBackgroundColor: '#1e1b4b',
};
```

```html
<ng-text-editor-lite
  [content]="initialHtml"
  [mode]="'edit'"
  [config]="editorConfig"
  (contentChange)="onChanged($event)"
/>
```

---

## Related

- [Angular setup examples →](./angular-setup.md)
- [Theming guide →](./theming.md)
- [Event API →](./events.md)
