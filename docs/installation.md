# Installation

## Requirements

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| Angular | 18+ |
| TypeScript | 5.4+ |

---

## Install the package

```bash
npm install ng-text-editor-lite
```

DOMPurify is a required peer dependency for HTML sanitization:

```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

---

## Import the component

`ng-text-editor-lite` ships as a **standalone Angular component**. Import it directly wherever you need it — no NgModule required.

```ts
import { EditorComponent } from 'ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [EditorComponent],
  // ...
})
export class MyComponent {}
```

---

## Optional NgModule usage

If your app has not yet migrated to standalone, add the component to an NgModule's `imports` array:

```ts
import { NgModule } from '@angular/core';
import { EditorComponent } from 'ng-text-editor-lite';

@NgModule({
  imports: [EditorComponent],
  // ...
})
export class MyModule {}
```

---

## Browser support

| Browser | Supported |
|---|---|
| Chrome | Yes |
| Edge | Yes |
| Firefox | Yes |
| Safari | Yes |

This is a **browser-only** package. SSR / server-side rendering is not supported.

---

## Next steps

- [Angular setup examples →](./angular-setup.md)
- [Configuration reference →](./configuration.md)
- [Event API →](./events.md)
