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

@Injectable({ providedIn: 'root' })
export class SanitizerService {
  sanitize(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    }) as string;
  }
}
