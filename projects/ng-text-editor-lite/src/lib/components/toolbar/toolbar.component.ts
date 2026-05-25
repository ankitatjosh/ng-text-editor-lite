import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectionService } from '../../services/selection/selection.service';

export type ToolbarAction =
  | 'bold' | 'italic' | 'strikeThrough'
  | 'insertUnorderedList' | 'insertOrderedList'
  | 'h1' | 'h2' | 'p' | 'link';

@Component({
  selector: 'ngx-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ngx-editor-lite__toolbar" role="toolbar" aria-label="Text formatting">
      <button type="button" (click)="exec('bold')" [class.active]="isActive('bold')"
        aria-label="Bold" title="Bold (Ctrl+B)"><b>B</b></button>
      <button type="button" (click)="exec('italic')" [class.active]="isActive('italic')"
        aria-label="Italic" title="Italic (Ctrl+I)"><i>I</i></button>
      <button type="button" (click)="exec('strikeThrough')" [class.active]="isActive('strikeThrough')"
        aria-label="Strikethrough"><s>S</s></button>

      <span class="ngx-editor-lite__toolbar-sep"></span>

      <button type="button" (click)="action.emit('h1')" aria-label="Title (H1)">H1</button>
      <button type="button" (click)="action.emit('h2')" aria-label="Subtitle (H2)">H2</button>
      <button type="button" (click)="action.emit('p')" aria-label="Body text">¶</button>

      <span class="ngx-editor-lite__toolbar-sep"></span>

      <button type="button" (click)="exec('insertUnorderedList')"
        [class.active]="isActive('insertUnorderedList')" aria-label="Bullet list">• List</button>
      <button type="button" (click)="exec('insertOrderedList')"
        [class.active]="isActive('insertOrderedList')" aria-label="Numbered list">1. List</button>

      <span class="ngx-editor-lite__toolbar-sep"></span>

      <button type="button" (click)="action.emit('link')" aria-label="Insert link">🔗</button>
    </div>
  `,
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Output() action = new EventEmitter<ToolbarAction>();

  constructor(private selection: SelectionService) {}

  exec(command: string): void {
    this.selection.execFormat(command);
    this.action.emit(command as ToolbarAction);
  }

  isActive(command: string): boolean {
    return this.selection.isFormatActive(command);
  }
}
