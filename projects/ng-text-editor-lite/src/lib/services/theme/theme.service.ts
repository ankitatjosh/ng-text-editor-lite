import { Injectable, signal } from '@angular/core';
import { EditorTheme } from '../../models/editor-config.model';

const LIGHT_TOKENS: Record<string, string> = {
  '--ngx-editor-bg': '#ffffff',
  '--ngx-editor-color': '#1a1a1a',
  '--ngx-editor-border': '#d1d5db',
  '--ngx-editor-toolbar-bg': '#f9fafb',
  '--ngx-editor-link-color': '#2563eb',
  '--ngx-editor-mention-bg': '#dbeafe',
  '--ngx-editor-mention-color': '#1e40af',
};

const DARK_TOKENS: Record<string, string> = {
  '--ngx-editor-bg': '#1e1e2e',
  '--ngx-editor-color': '#cdd6f4',
  '--ngx-editor-border': '#45475a',
  '--ngx-editor-toolbar-bg': '#181825',
  '--ngx-editor-link-color': '#89b4fa',
  '--ngx-editor-mention-bg': '#313244',
  '--ngx-editor-mention-color': '#89b4fa',
};

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly currentTheme = signal<EditorTheme>('light');

  applyTheme(host: HTMLElement, theme: EditorTheme, overrides?: Record<string, string>): void {
    const tokens = theme === 'dark' ? DARK_TOKENS : LIGHT_TOKENS;
    const merged = { ...tokens, ...overrides };
    for (const [key, val] of Object.entries(merged)) {
      host.style.setProperty(key, val);
    }
    this.currentTheme.set(theme);
  }
}
