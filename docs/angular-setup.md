# Angular Setup Examples

## Basic standalone usage

```ts
// app.ts
import { Component, signal } from '@angular/core';
import { EditorComponent, EditorConfig, EditorEventPayload } from 'ng-text-editor-lite';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EditorComponent],
  template: `
    <ng-text-editor-lite
      [content]="html()"
      [config]="config"
      (contentChange)="onChanged($event)"
    />
  `,
})
export class AppComponent {
  html = signal('');

  config: EditorConfig = {
    placeholder: 'Start writing...',
    maxLength: 3000,
    theme: 'light',
  };

  onChanged(event: EditorEventPayload): void {
    this.html.set(event.html);
  }
}
```

---

## Reactive Forms integration

The editor implements `ControlValueAccessor` and works with `FormControl` out of the box.

```ts
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { EditorComponent } from 'ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, EditorComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <ng-text-editor-lite formControlName="body" />
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `,
})
export class PostFormComponent {
  form = this.fb.group({
    body: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) {}

  onSubmit(): void {
    console.log(this.form.value.body); // sanitized HTML string
  }
}
```

---

## Two-way binding with ngModel

```ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from 'ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [FormsModule, EditorComponent],
  template: `
    <ng-text-editor-lite [(ngModel)]="content" />
    <pre>{{ content }}</pre>
  `,
})
export class NoteComponent {
  content = '<p>Hello world</p>';
}
```

---

## Controlled mode switching

```ts
import { Component, signal } from '@angular/core';
import { EditorComponent, EditorMode } from 'ng-text-editor-lite';

@Component({
  standalone: true,
  imports: [EditorComponent],
  template: `
    <button (click)="toggleMode()">{{ mode() === 'edit' ? 'Preview' : 'Edit' }}</button>
    <ng-text-editor-lite
      [content]="html"
      [mode]="mode()"
      (onModeChange)="mode.set($event)"
    />
  `,
})
export class ArticleComponent {
  html = '<h1>My Article</h1><p>Edit me...</p>';
  mode = signal<EditorMode>('edit');

  toggleMode(): void {
    this.mode.update(m => m === 'edit' ? 'preview' : 'edit');
  }
}
```

---

## Disabled state via Reactive Forms

`setDisabledState` is called automatically by Angular when you call `control.disable()`:

```ts
this.form.get('body')?.disable(); // editor renders in disabled mode
this.form.get('body')?.enable();  // editor returns to edit mode
```

---

## Available modes

| Mode | Toolbar | Editable | Use case |
|---|---|---|---|
| `edit` | Visible | Yes | Default editing |
| `readonly` | Hidden | No | Published view |
| `preview` | Hidden | No | Draft preview |
| `disabled` | Hidden | No | Form disabled state |

---

## Related

- [Configuration reference →](./configuration.md)
- [Event API →](./events.md)
- [Theming →](./theming.md)
