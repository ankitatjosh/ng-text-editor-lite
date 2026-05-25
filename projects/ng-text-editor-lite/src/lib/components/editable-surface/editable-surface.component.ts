import {
  Component, ElementRef, EventEmitter, Input,
  OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation,
} from '@angular/core';
import { EditorMode } from '../../models/editor-config.model';

@Component({
  selector: 'ngx-editable-surface',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      #surface
      class="ngx-editor-lite__surface"
      [attr.contenteditable]="isEditable ? 'true' : 'false'"
      [attr.aria-label]="ariaLabel"
      [attr.aria-multiline]="true"
      [attr.role]="'textbox'"
      [attr.data-placeholder]="placeholder"
      (input)="onInput()"
      (focus)="focused.emit()"
      (blur)="blurred.emit()"
    ></div>
  `,
  styleUrls: ['./editable-surface.component.scss'],
})
export class EditableSurfaceComponent implements OnChanges {
  @ViewChild('surface', { static: true }) surfaceRef!: ElementRef<HTMLDivElement>;

  @Input() html = '';
  @Input() mode: EditorMode = 'edit';
  @Input() placeholder = '';
  @Input() ariaLabel = 'Text editor';

  @Output() htmlChange = new EventEmitter<string>();
  @Output() focused = new EventEmitter<void>();
  @Output() blurred = new EventEmitter<void>();

  get isEditable(): boolean {
    return this.mode === 'edit';
  }

  get nativeEl(): HTMLDivElement {
    return this.surfaceRef.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['html'] && this.nativeEl.innerHTML !== this.html) {
      this.nativeEl.innerHTML = this.html;
    }
  }

  onInput(): void {
    this.htmlChange.emit(this.nativeEl.innerHTML);
  }

  insertHtmlAtCursor(html: string): void {
    document.execCommand('insertHTML', false, html);
    this.htmlChange.emit(this.nativeEl.innerHTML);
  }
}
