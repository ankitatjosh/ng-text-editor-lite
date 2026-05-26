import { Component, signal, computed } from '@angular/core';
import { EditorComponent, EditorConfig, EditorMode, EditorEventPayload } from 'ng-text-editor-lite';

const INITIAL_HTML = `
<h1>WYSIWYG Text Editor Demo</h1>
<h2>Lightweight Angular Text Editor</h2>
<p>Hi <span class="mention-badge">@All</span>,</p>
<p>I'm Ankit this side, I have built this demo page to showcase the WYSIWYG text editor. It is simple to use with Angular and extremely lightweight. It supports <strong>bold</strong>, <em>italic</em>, <s>strikethrough</s>, lists, and link support — minimum but essential features.</p>
<h2>Features</h2>
<ul>
  <li>Bold text support</li>
  <li>Italic text support</li>
  <li>Strikethrough support</li>
  <li>Bullet lists</li>
  <li>Numbered lists</li>
  <li>Link support</li>
  <li>Lightweight and easy to integrate</li>
</ul>
<h2>Project Notes</h2>
<ol>
  <li>Weekend project</li>
  <li>Currently maintained actively</li>
  <li>Built with simplicity in mind</li>
</ol>
<h2>Contact &amp; Support</h2>
<p>This is a weekend project that I started and continue maintaining.</p>
<p>If you would like to help me or support my development work, feel free to contact me:</p>
<p>Email: <a href="mailto:thedevankit@gmail.com" target="_blank" rel="noopener noreferrer">thedevankit@gmail.com</a></p>
<p>GitHub: <a href="https://github.com/thedevankit" target="_blank" rel="noopener noreferrer">GitHub Profile</a></p>
`.trim();

@Component({
  selector: 'app-root',
  imports: [EditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  host: { '[attr.data-theme]': 'theme()' },
})
export class App {
  html = signal(INITIAL_HTML);
  mode = signal<EditorMode>('edit');
  theme = signal<'light' | 'dark'>('dark');

  config = computed<EditorConfig>(() => ({
    placeholder: 'Try typing or pasting markdown...',
    maxLength: 3000,
    autoGrow: true,
    minHeight: '200px',
    maxHeight: '600px',
    theme: this.theme(),
  }));

  onChange(payload: EditorEventPayload): void {
    this.html.set(payload.html);
  }

  setMode(mode: EditorMode): void {
    this.mode.set(mode);
  }

  toggleTheme(): void {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }
}
