# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

`ng-text-editor-lite` is a lightweight Angular 18+ WYSIWYG editor published as an open-source npm package. It uses `contenteditable` (no external editor engines) and is built to Angular Package Format (APF) via ng-packagr.

---

## Commands

```bash
# Install dependencies
npm install

# Build the library (outputs to dist/)
ng build ng-text-editor-lite

# Run unit tests
ng test ng-text-editor-lite

# Run a single test file
ng test ng-text-editor-lite --include="**/sanitizer.service.spec.ts"

# Lint
ng lint ng-text-editor-lite

# Run the demo/playground app (if present under projects/demo)
ng serve demo
```

> The workspace follows Angular CLI multi-project layout. The library lives under `projects/ng-text-editor-lite/src/lib/` and is built with ng-packagr. The playground/demo app lives under `projects/demo/`.

---

## Architecture

### Library Structure

```
projects/ng-text-editor-lite/src/lib/
  components/
    editor/          — EditorComponent (root, CVA, @Input/@Output surface)
    toolbar/         — ToolbarComponent (formatting buttons, visible only in edit mode)
    editable-surface/ — EditableSurfaceComponent (the contenteditable div)
  services/
    markdown-parser/ — Converts pasted markdown to sanitized HTML
    sanitizer/       — DOMPurify wrapper; all HTML entering the editor passes through here
    selection/       — Tracks cursor/selection state via Selection API
    theme/           — Applies CSS variable tokens at runtime
    validation/      — maxLength, empty-state, disabled-mode guards
  models/            — Shared interfaces (EditorConfig, EditorEvent payload, Mode enum)
  public-api.ts      — Barrel; only what consumers need is exported
```

### Data Flow

**Paste flow:**
```
Paste event → detect markdown → MarkdownParserService → SanitizerService → normalize DOM → insert at cursor → emit onChange
```

**Content input flow:**
```
[content] @Input → ValidationService → SanitizerService → normalize → render to editable surface → emit onInit/onChange
```

**Toolbar action flow:**
```
Button click → execCommand / Selection API → editable surface DOM update → SelectionService update → emit onChange
```

### Key Design Decisions

- **No Shadow DOM, no iframe.** CSS isolation is achieved via scoped prefixes (`.ngx-editor-lite h1`) plus an internal CSS reset wrapper that overrides Bootstrap, Tailwind, and Material resets.
- **contenteditable only.** All formatting goes through `document.execCommand` or direct DOM manipulation. No external editor engine is permitted.
- **Sanitization is mandatory and synchronous.** Every HTML string entering the editor (paste, `[content]` binding, programmatic set) must pass through `SanitizerService` (DOMPurify). Never bypass this.
- **ControlValueAccessor (CVA).** `EditorComponent` implements CVA so it works with both `ReactiveFormsModule` and `[(ngModel)]`.
- **Angular Signals** preferred for internal state (toolbar active states, mode, theme) where compatible with Angular 18.
- **Tree-shaking.** Services are `providedIn: 'root'` or provided at component level — never registered in a shared NgModule that forces eager loading.

### Rendering Modes

| Mode | Toolbar | contenteditable |
|------|---------|-----------------|
| `edit` | Visible | `true` |
| `readonly` | Hidden | `false` |
| `preview` | Hidden | `false` |
| `disabled` | Hidden | `false` |

Mode is an `@Input` on `EditorComponent` and triggers `onModeChange` output.

### Event Outputs

All outputs emit a typed payload `{ html: string; text: string; timestamp: number }` unless noted:

`onInit` · `onFocus` · `onBlur` · `onChange` · `onPaste` · `onDestroy` · `onSelectionChange` · `onModeChange` · `onValidationError`

### Mention System

`@username` tokens in content render as `<span class="mention-badge">@username</span>`. Badge foreground/background are configurable via `EditorConfig`. v1 is static rendering only — no autocomplete or async user lookup.

### Theme System

Light and dark themes are implemented as CSS variable sets applied to the host element. `ThemeService` swaps the variable set at runtime. Configurable tokens include: background, text color, border color, toolbar background, mention colors, link color.

### Markdown Conversion (Paste)

`MarkdownParserService` handles the subset defined in the PRD:

| Markdown | Output |
|----------|--------|
| `# text` | `<h1>` |
| `## text` | `<h2>` |
| `**text**` | `<strong>` |
| `*text*` | `<em>` |
| `[t](url)` | `<a>` |
| `- item` | `<ul><li>` |
| `1. item` | `<ol><li>` |

Unsupported syntax must pass through as plain text — never throw or corrupt state.

### Security

- DOMPurify is the sanitization engine. Configure it to strip `<script>`, event attributes, and dangerous URL schemes (`javascript:`, `data:`, `vbscript:`).
- Links must render with `target="_blank" rel="noopener noreferrer"`.
- The sanitizer runs on every entry point: `[content]` binding, paste handler, programmatic API calls.

### Build Output

Built to Angular Package Format (APF) via ng-packagr. Outputs ESM bundles with full tree-shaking support. `public-api.ts` is the only export surface — keep it minimal.

### Testing

- **Target:** 85% coverage minimum.
- Unit tests cover each service independently (markdown parser, sanitizer, validation, selection, theme).
- Integration tests cover `EditorComponent` with `ReactiveFormsModule` and `ngModel`.
- Rendering tests verify edit ↔ readonly mode consistency.
- Accessibility tests verify ARIA labels, keyboard navigation, and focus visibility.
