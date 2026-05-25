# Security Notes

`ng-text-editor-lite` treats security as a first-class constraint. Every HTML string that enters the editor passes through a mandatory sanitization pipeline regardless of its source.

---

## Sanitization pipeline

Every entry point runs through `SanitizerService`, which wraps DOMPurify:

| Entry point | Sanitized |
|---|---|
| `[content]` input binding | Yes |
| Keyboard paste (HTML clipboard) | Yes |
| Markdown paste (after conversion) | Yes |
| Programmatic `writeValue` (CVA) | Yes |

There is no bypass. Internal code paths always call `SanitizerService.sanitize()` before touching the DOM.

---

## Allowed HTML elements

Only the following tags are permitted inside the editor. All others are stripped:

```
h1  h2  p  strong  em  s  a  ul  ol  li  br  span
```

---

## Allowed HTML attributes

```
href  target  rel  class
```

All other attributes — including `style`, `id`, data attributes, and all event handlers (`onclick`, `onerror`, `onload`, etc.) — are stripped.

---

## Link sanitization

Every `<a>` element is enforced to:

1. Have `target="_blank"` so links open in a new tab.
2. Have `rel="noopener noreferrer"` to prevent tab-napping and referrer leakage.
3. Not contain a dangerous URL scheme.

### Blocked URL schemes

The following schemes are stripped from `href` attributes:

| Scheme | Risk |
|---|---|
| `javascript:` | Script execution |
| `data:` | Arbitrary content injection |
| `vbscript:` | Script execution (IE legacy) |

A link with a blocked scheme has its `href` removed but the anchor element and text are preserved.

---

## Script execution

`<script>` tags and the following embedding elements are always removed regardless of content:

```
script  style  iframe  object  embed
```

---

## DOMPurify version and configuration

The sanitizer uses [DOMPurify](https://github.com/cure53/DOMPurify) with the following explicit configuration:

```ts
DOMPurify.sanitize(html, {
  ALLOWED_TAGS: ['h1','h2','p','strong','em','s','a','ul','ol','li','br','span'],
  ALLOWED_ATTR: ['href','target','rel','class'],
  ALLOW_DATA_ATTR: false,
  FORBID_TAGS: ['script','style','iframe','object','embed'],
});
```

A `afterSanitizeAttributes` hook enforces the link policy (blocked schemes, `target`, `rel`) after DOMPurify's own pass.

---

## XSS prevention summary

| Attack vector | Mitigation |
|---|---|
| Script injection via paste | `<script>` in FORBID_TAGS |
| Event handler injection | All event attributes stripped (not in ALLOWED_ATTR) |
| `javascript:` href | Blocked by afterSanitizeAttributes hook |
| CSS injection via `style` | `style` not in ALLOWED_ATTR |
| iframe embedding | `iframe` in FORBID_TAGS |
| Data URI injection | Blocked by afterSanitizeAttributes hook |
| Tab-napping | `rel="noopener noreferrer"` enforced on all links |

---

## Content Security Policy (CSP)

The editor does not inject external resources, so no additional CSP directives are required for the editor itself. However:

- If your app uses a strict `script-src` CSP, ensure DOMPurify's module is included in your bundle (it is a build-time dependency, not a CDN load).
- The editor does not use `eval()`, `Function()`, or dynamic `import()`.

---

## Reporting security issues

If you discover a security vulnerability, do **not** open a public GitHub issue. Report it privately via GitHub's [Security Advisories](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing/privately-reporting-a-security-vulnerability) feature on the repository.

---

## Related

- [Markdown support →](./markdown.md)
- [Installation →](./installation.md)
