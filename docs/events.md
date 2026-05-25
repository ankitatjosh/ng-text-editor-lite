# Event API

All events are Angular `@Output` EventEmitters. Bind to them in your template using standard Angular event binding syntax.

---

## Event payload type

Most events emit an `EditorEventPayload` object:

```ts
import { EditorEventPayload } from 'ng-text-editor-lite';

interface EditorEventPayload {
  html: string;       // current sanitized HTML content
  text: string;       // plain text (HTML tags stripped)
  timestamp: number;  // Unix timestamp (ms) of when the event fired
}
```

---

## Events reference

### `(contentChange)`

Fires on every keystroke that changes editor content. This is the primary event for capturing editor output.

Payload: `EditorEventPayload`

```html
<ng-text-editor-lite (contentChange)="onChanged($event)" />
```

```ts
onChanged(event: EditorEventPayload): void {
  this.savedHtml = event.html;
  this.charCount = event.text.length;
}
```

> **Autosave pattern:** debounce this event to avoid excessive saves.
> ```ts
> import { Subject } from 'rxjs';
> import { debounceTime } from 'rxjs/operators';
>
> changes$ = new Subject<EditorEventPayload>();
>
> onChanged(event: EditorEventPayload): void {
>   this.changes$.next(event);
> }
>
> ngOnInit(): void {
>   this.changes$.pipe(debounceTime(800)).subscribe(e => this.save(e.html));
> }
> ```

---

### `(onInit)`

Fires once when the editor component has fully initialized. Useful for setting up external state after the editor is ready.

Payload: `EditorEventPayload` (initial content state)

```html
<ng-text-editor-lite (onInit)="editorReady($event)" />
```

---

### `(onFocusEvent)`

Fires when the editing surface receives focus.

Payload: `void`

```html
<ng-text-editor-lite (onFocusEvent)="isActive = true" />
```

---

### `(onBlurEvent)`

Fires when the editing surface loses focus.

Payload: `void`

```html
<ng-text-editor-lite (onBlurEvent)="isActive = false" />
```

---

### `(onPaste)`

Fires after a paste event has been processed (markdown converted + HTML sanitized + content inserted). The payload reflects the post-paste state.

Payload: `EditorEventPayload`

```html
<ng-text-editor-lite (onPaste)="trackPaste($event)" />
```

---

### `(onDestroy)`

Fires when the editor component is destroyed (removed from the DOM). Use this to clean up external state or subscriptions.

Payload: `void`

```html
<ng-text-editor-lite (onDestroy)="cleanup()" />
```

---

### `(onModeChange)`

Fires when the `[mode]` input changes after initial render.

Payload: `EditorMode` (`'edit' | 'readonly' | 'preview' | 'disabled'`)

```html
<ng-text-editor-lite
  [mode]="currentMode"
  (onModeChange)="modeChanged($event)"
/>
```

```ts
modeChanged(mode: EditorMode): void {
  console.log('Editor switched to', mode);
}
```

---

### `(onValidationError)`

Fires when a validation rule prevents content insertion. Currently emits the name of the failing rule.

Payload: `string` — one of:
- `'maxLength'` — content exceeded `config.maxLength`
- `'disabled'` — editor is in disabled mode

```html
<ng-text-editor-lite (onValidationError)="showError($event)" />
```

```ts
showError(reason: string): void {
  if (reason === 'maxLength') {
    this.errorMessage = 'Character limit reached';
  }
}
```

---

## All events at a glance

| Event | Payload | When |
|---|---|---|
| `(contentChange)` | `EditorEventPayload` | Every content change |
| `(onInit)` | `EditorEventPayload` | Component initialized |
| `(onFocusEvent)` | `void` | Editor focused |
| `(onBlurEvent)` | `void` | Editor blurred |
| `(onPaste)` | `EditorEventPayload` | Paste processed |
| `(onDestroy)` | `void` | Component destroyed |
| `(onModeChange)` | `EditorMode` | Mode input changed |
| `(onValidationError)` | `string` | Validation failed |

---

## Related

- [Configuration reference →](./configuration.md)
- [Angular setup examples →](./angular-setup.md)
