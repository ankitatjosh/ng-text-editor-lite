import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MarkdownParserService {
  isMarkdown(text: string): boolean {
    return /^#{1,2}\s|^\*\*|^\*[^*]|^\[.+\]\(.+\)|^[-*]\s|^\d+\.\s/.test(text.trim());
  }

  parse(markdown: string): string {
    const lines = markdown.split('\n');
    const result: string[] = [];
    let inUl = false;
    let inOl = false;

    const closeLists = () => {
      if (inUl) { result.push('</ul>'); inUl = false; }
      if (inOl) { result.push('</ol>'); inOl = false; }
    };

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();

      const ulMatch = line.match(/^[-*]\s+(.+)$/);
      const olMatch = line.match(/^\d+\.\s+(.+)$/);

      if (ulMatch) {
        if (!inUl) { closeLists(); result.push('<ul>'); inUl = true; }
        result.push(`<li>${this.parseInline(ulMatch[1])}</li>`);
        continue;
      }

      if (olMatch) {
        if (!inOl) { closeLists(); result.push('<ol>'); inOl = true; }
        result.push(`<li>${this.parseInline(olMatch[1])}</li>`);
        continue;
      }

      closeLists();

      if (line.startsWith('## ')) {
        result.push(`<h2>${this.parseInline(line.slice(3))}</h2>`);
      } else if (line.startsWith('# ')) {
        result.push(`<h1>${this.parseInline(line.slice(2))}</h1>`);
      } else if (line === '') {
        // skip blank lines
      } else {
        result.push(`<p>${this.parseInline(line)}</p>`);
      }
    }

    closeLists();
    return result.join('');
  }

  private parseInline(text: string): string {
    return text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  }
}
