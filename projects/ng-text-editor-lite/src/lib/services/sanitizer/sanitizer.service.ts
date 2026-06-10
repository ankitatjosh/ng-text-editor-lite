import { Injectable } from '@angular/core';
import DOMPurify from 'dompurify';

const ALLOWED_TAGS = ['h1', 'h2', 'p', 'strong', 'em', 's', 'a', 'ul', 'ol', 'li', 'br', 'span'];
const ALLOWED_ATTR = ['href', 'target', 'rel', 'class'];
const BLOCKED_URI_SCHEMES = /^(javascript|data|vbscript):/i;

// Enforce safe link attributes on every sanitize pass
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    const href = node.getAttribute('href') ?? '';
    if (BLOCKED_URI_SCHEMES.test(href)) {
      node.removeAttribute('href');
    }
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

// Maps legacy/alias tags to their canonical HTML5 semantic equivalents
const TAG_REMAP: Record<string, string> = { b: 'strong', i: 'em', strike: 's', del: 's' };

@Injectable({ providedIn: 'root' })
export class SanitizerService {
  sanitize(html: string): string {
    const normalized = this.normalizeHtml(html);
    return DOMPurify.sanitize(normalized, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    }) as string;
  }

  private normalizeHtml(html: string): string {
    if (!html) return html;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    Object.entries(TAG_REMAP).forEach(([from, to]) => {
      doc.querySelectorAll(from).forEach(el => {
        const replacement = doc.createElement(to);
        replacement.innerHTML = el.innerHTML;
        Array.from(el.attributes).forEach(attr =>
          replacement.setAttribute(attr.name, attr.value)
        );
        el.replaceWith(replacement);
      });
    });
    return doc.body.innerHTML;
  }
}
