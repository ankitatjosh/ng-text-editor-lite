import { Component, signal } from '@angular/core';
import { EditorComponent, EditorConfig, EditorMode, EditorEventPayload } from 'ng-text-editor-lite';

@Component({
  selector: 'app-root',
  imports: [EditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  html = signal('');
  mode = signal<EditorMode>('edit');

  config: EditorConfig = {
    placeholder: 'Try typing or pasting markdown...',
    maxLength: 3000,
    autoGrow: true,
    minHeight: '200px',
    maxHeight: '500px',
    theme: 'dark',
  };

  onChange(payload: EditorEventPayload): void {
    this.html.set(payload.html);
  }

  setMode(mode: EditorMode): void {
    this.mode.set(mode);
  }
}
