import {
  Component, ElementRef, EventEmitter, Input,
  OnChanges, Output, SimpleChanges, ViewChild, ViewEncapsulation,
} from '@angular/core';
import { EditorMode } from '../../models/editor-config.model';

const TAG_REMAP: Record<string, string> = { B: 'strong', I: 'em', STRIKE: 's', DEL: 's' };

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
      (keyup)="onKeyUp($event)"
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

  onKeyUp(event: KeyboardEvent): void {
    if ([' ', ',', '.', '!', '?', ';', ':'].includes(event.key)) {
      this.detectAndWrapMention();
    }
  }

  insertHtmlAtCursor(html: string): void {
    document.execCommand('insertHTML', false, html);
    this.htmlChange.emit(this.nativeEl.innerHTML);
  }

  /**
   * Normalizes legacy tags produced by execCommand (<b>→<strong>, <i>→<em>, <strike>/<del>→<s>)
   * in the live DOM without resetting innerHTML, preserving cursor position.
   * Children are moved (not cloned) so existing Range references remain valid.
   */
  normalizeFormattingTags(): void {
    const el = this.nativeEl;
    const toReplace: Element[] = [];

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      if (TAG_REMAP[(node as Element).tagName]) {
        toReplace.push(node as Element);
      }
    }

    if (toReplace.length === 0) return;

    toReplace.forEach(oldEl => {
      const newEl = document.createElement(TAG_REMAP[oldEl.tagName]);
      // Move children (not clone) so existing Range anchors inside stay valid
      while (oldEl.firstChild) newEl.appendChild(oldEl.firstChild);
      Array.from(oldEl.attributes).forEach(a => newEl.setAttribute(a.name, a.value));
      oldEl.replaceWith(newEl);
    });

    this.htmlChange.emit(el.innerHTML);
  }

  private detectAndWrapMention(): void {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    if (!range.collapsed) return;

    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) return;

    // Don't reprocess an already-wrapped mention
    if ((node.parentElement as HTMLElement)?.classList.contains('mention-badge')) return;

    const textBefore = (node.textContent ?? '').substring(0, range.startOffset);
    // Match @word immediately followed by the separator that was just typed
    const match = textBefore.match(/@(\w+)([\s,\.!?;:])$/);
    if (!match) return;

    const mentionText = '@' + match[1];  // e.g. "@alice"
    const separator = match[2];           // e.g. " "
    const fullToken = mentionText + separator;

    const textNode = node as Text;
    const endOffset = range.startOffset;
    const startOffset = endOffset - fullToken.length;

    const doc = textNode.ownerDocument!;
    const beforeText = textNode.textContent!.substring(0, startOffset);
    const afterText = textNode.textContent!.substring(endOffset);

    const mentionSpan = doc.createElement('span');
    mentionSpan.className = 'mention-badge';
    mentionSpan.textContent = mentionText;
    mentionSpan.setAttribute('contenteditable', 'false');

    const beforeNode = doc.createTextNode(beforeText);
    const afterNode = doc.createTextNode(separator + afterText);

    const parent = textNode.parentNode!;
    parent.replaceChild(afterNode, textNode);
    parent.insertBefore(mentionSpan, afterNode);
    parent.insertBefore(beforeNode, mentionSpan);

    // Place cursor after the separator, before any remaining text
    const newRange = doc.createRange();
    newRange.setStart(afterNode, separator.length);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);

    this.htmlChange.emit(this.nativeEl.innerHTML);
  }
}
