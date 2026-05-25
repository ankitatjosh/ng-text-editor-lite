import {
  Component, ElementRef, EventEmitter, HostListener,
  Input, OnChanges, OnDestroy, OnInit, Output,
  SimpleChanges, ViewChild, ViewEncapsulation, forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { EditorConfig, EditorMode } from '../../models/editor-config.model';
import { EditorEventPayload } from '../../models/editor-event.model';
import { SanitizerService } from '../../services/sanitizer/sanitizer.service';
import { MarkdownParserService } from '../../services/markdown-parser/markdown-parser.service';
import { ValidationService } from '../../services/validation/validation.service';
import { SelectionService } from '../../services/selection/selection.service';
import { ThemeService } from '../../services/theme/theme.service';
import { ToolbarComponent, ToolbarAction } from '../toolbar/toolbar.component';
import { EditableSurfaceComponent } from '../editable-surface/editable-surface.component';

const DEFAULT_CONFIG: Required<EditorConfig> = {
  placeholder: 'Type here...',
  maxLength: 3000,
  autoGrow: true,
  minHeight: '200px',
  maxHeight: '500px',
  theme: 'light',
  mentionTextColor: '',
  mentionBackgroundColor: '',
};

@Component({
  selector: 'ng-text-editor-lite',
  standalone: true,
  imports: [CommonModule, ToolbarComponent, EditableSurfaceComponent],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EditorComponent),
      multi: true,
    },
  ],
  template: `
    <div
      class="ngx-editor-lite"
      [class.ngx-editor-lite--focused]="isFocused"
      [class.ngx-editor-lite--disabled]="mode === 'disabled'"
      [style.min-height]="cfg.minHeight"
      [style.max-height]="cfg.autoGrow ? cfg.maxHeight : undefined"
      [style.overflow-y]="cfg.autoGrow ? 'auto' : undefined"
    >
      <ngx-toolbar
        *ngIf="mode === 'edit'"
        (action)="onToolbarAction($event)"
      />
      <ngx-editable-surface
        #surface
        [html]="currentHtml"
        [mode]="mode"
        [placeholder]="cfg.placeholder"
        (htmlChange)="onContentChange($event)"
        (focused)="onFocus()"
        (blurred)="onBlur()"
      />
    </div>
  `,
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnChanges, OnDestroy, ControlValueAccessor {
  @ViewChild('surface') surfaceComponent!: EditableSurfaceComponent;

  @Input() content = '';
  @Input() mode: EditorMode = 'edit';
  @Input() config: EditorConfig = {};

  @Output() contentChange = new EventEmitter<EditorEventPayload>();
  @Output() onInit = new EventEmitter<EditorEventPayload>();
  @Output() onFocusEvent = new EventEmitter<void>();
  @Output() onBlurEvent = new EventEmitter<void>();
  @Output() onPaste = new EventEmitter<EditorEventPayload>();
  @Output() onDestroy = new EventEmitter<void>();
  @Output() onModeChange = new EventEmitter<EditorMode>();
  @Output() onValidationError = new EventEmitter<string>();

  currentHtml = '';
  isFocused = false;
  cfg: Required<EditorConfig> = { ...DEFAULT_CONFIG };

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(
    private el: ElementRef<HTMLElement>,
    private sanitizer: SanitizerService,
    private markdownParser: MarkdownParserService,
    private validation: ValidationService,
    private selection: SelectionService,
    private theme: ThemeService,
  ) {}

  ngOnInit(): void {
    this.applyConfig();
    this.currentHtml = this.sanitizer.sanitize(this.content);
    this.onInit.emit(this.buildPayload());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) this.applyConfig();
    if (changes['content'] && !changes['content'].firstChange) {
      this.currentHtml = this.sanitizer.sanitize(this.content);
    }
    if (changes['mode'] && !changes['mode'].firstChange) {
      this.onModeChange.emit(this.mode);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.emit();
  }

  @HostListener('paste', ['$event'])
  handlePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') ?? '';
    let html: string;

    if (this.markdownParser.isMarkdown(text)) {
      html = this.markdownParser.parse(text);
    } else {
      html = event.clipboardData?.getData('text/html') || `<p>${text}</p>`;
    }

    const safe = this.sanitizer.sanitize(html);
    this.surfaceComponent.insertHtmlAtCursor(safe);
    this.onPaste.emit(this.buildPayload());
  }

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    const ctrl = event.ctrlKey || event.metaKey;
    if (ctrl && event.key === 'b') { event.preventDefault(); this.selection.execFormat('bold'); }
    if (ctrl && event.key === 'i') { event.preventDefault(); this.selection.execFormat('italic'); }
  }

  onContentChange(html: string): void {
    const text = html.replace(/<[^>]*>/g, '');
    const result = this.validation.validate(text, this.cfg.maxLength, this.mode);
    if (!result.valid) {
      this.onValidationError.emit(result.reason);
      return;
    }
    this.currentHtml = html;
    const payload = this.buildPayload();
    this.contentChange.emit(payload);
    this.onChange(html);
  }

  onToolbarAction(action: ToolbarAction): void {
    if (action === 'h1' || action === 'h2' || action === 'p') {
      document.execCommand('formatBlock', false, action);
    } else if (action === 'link') {
      const url = prompt('Enter URL:');
      if (url) this.selection.execFormat('createLink', url);
    }
  }

  onFocus(): void {
    this.isFocused = true;
    this.onFocusEvent.emit();
    this.onTouched();
  }

  onBlur(): void {
    this.isFocused = false;
    this.onBlurEvent.emit();
  }

  // ControlValueAccessor
  writeValue(html: string): void {
    this.currentHtml = this.sanitizer.sanitize(html ?? '');
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void {
    this.mode = isDisabled ? 'disabled' : 'edit';
  }

  private applyConfig(): void {
    this.cfg = { ...DEFAULT_CONFIG, ...this.config };
    const overrides: Record<string, string> = {};
    if (this.cfg.mentionTextColor) overrides['--ngx-editor-mention-color'] = this.cfg.mentionTextColor;
    if (this.cfg.mentionBackgroundColor) overrides['--ngx-editor-mention-bg'] = this.cfg.mentionBackgroundColor;
    this.theme.applyTheme(this.el.nativeElement, this.cfg.theme, overrides);
  }

  private buildPayload(): EditorEventPayload {
    return {
      html: this.currentHtml,
      text: this.currentHtml.replace(/<[^>]*>/g, ''),
      timestamp: Date.now(),
    };
  }
}
