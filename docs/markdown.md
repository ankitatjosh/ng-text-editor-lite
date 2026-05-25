# Markdown Support

`ng-text-editor-lite` automatically detects and converts markdown when content is **pasted** into the editor. This is designed for content copied from ChatGPT, GitHub, Notion, documentation tools, and note-taking apps.

Markdown typed directly into the editor is **not** converted — only pasted content.

---

## How paste detection works

When a paste event fires:

1. The plain-text representation of the clipboard is inspected.
2. If markdown syntax is detected (headings, bold, bullet lists, etc.), the plain text is parsed by `MarkdownParserService`.
3. The resulting HTML is sanitized by `SanitizerService` before insertion.
4. If no markdown is detected, the clipboard's HTML payload is used (falling back to plain text wrapped in `<p>`).

The `(onPaste)` event fires after this pipeline completes with the final editor state.

---

## Supported syntax

| Markdown | Converts to | Notes |
|---|---|---|
| `# Heading` | `<h1>` | Exact: `#` followed by a space |
| `## Subheading` | `<h2>` | Only `##` is supported (not `###` and deeper) |
| `**bold text**` | `<strong>` | Must be double asterisk |
| `*italic text*` | `<em>` | Single asterisk, not underscore |
| `[link text](https://url)` | `<a href="...">` | URL is sanitized; dangerous protocols are stripped |
| `- item` or `* item` | `<ul><li>` | Dash or asterisk followed by a space |
| `1. item` | `<ol><li>` | Any digit followed by `.` and a space |

---

## Inline combinations

Inline elements can be combined within a single line:

| Input | Result |
|---|---|
| `**bold** and *italic*` | `<strong>bold</strong> and <em>italic</em>` |
| `[**bold link**](https://x.com)` | `<a href="..."><strong>bold link</strong></a>` |
| `*visit [site](https://x.com)*` | `<em>visit <a href="...">site</a></em>` |

---

## Unsupported syntax

The following markdown constructs are **not** converted and pass through as plain text. They will not corrupt editor state.

| Syntax | Behaviour |
|---|---|
| `### h3` and deeper | Rendered as a paragraph |
| `` `inline code` `` | Rendered as plain text |
| ` ```code block``` ` | Rendered as plain text |
| `> blockquote` | Rendered as a paragraph |
| `---` (horizontal rule) | Rendered as plain text |
| `![image](url)` | Rendered as plain text (images not supported) |
| `~~strikethrough~~` | Rendered as plain text |
| Nested lists | Inner items rendered as flat list items |
| Tables | Rendered as plain text rows |

---

## Example: pasting from ChatGPT

Paste this into the editor:

```
# Getting Started

**Installation** is simple:

- Run `npm install`
- Open your browser

Visit [the docs](https://example.com) for more.
```

Result in the editor:

```html
<h1>Getting Started</h1>
<p><strong>Installation</strong> is simple:</p>
<ul>
  <li>Run `npm install`</li>
  <li>Open your browser</li>
</ul>
<p>Visit <a href="https://example.com" target="_blank" rel="noopener noreferrer">the docs</a> for more.</p>
```

> Note: the backtick-wrapped `` `npm install` `` is not converted — inline code is unsupported and passes through as-is.

---

## Security during paste

All parsed HTML is passed through `SanitizerService` (DOMPurify) before insertion. This means:

- `<script>` tags are stripped even if embedded in markdown.
- Links with `javascript:`, `data:`, or `vbscript:` schemes are stripped.
- Event attributes (`onclick`, `onerror`, etc.) are removed.

See the [Security notes →](./security.md) for the full sanitization policy.

---

## Related

- [Security notes →](./security.md)
- [Event API →](./events.md)
