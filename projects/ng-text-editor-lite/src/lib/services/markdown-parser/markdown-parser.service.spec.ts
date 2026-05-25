import { TestBed } from '@angular/core/testing';
import { MarkdownParserService } from './markdown-parser.service';

describe('MarkdownParserService', () => {
  let service: MarkdownParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarkdownParserService);
  });

  it('detects markdown', () => {
    expect(service.isMarkdown('# Heading')).toBe(true);
    expect(service.isMarkdown('**bold**')).toBe(true);
    expect(service.isMarkdown('plain text')).toBe(false);
  });

  it('converts h1 and h2', () => {
    expect(service.parse('# Title')).toBe('<h1>Title</h1>');
    expect(service.parse('## Sub')).toBe('<h2>Sub</h2>');
  });

  it('converts bold and italic', () => {
    expect(service.parse('**bold**')).toBe('<p><strong>bold</strong></p>');
    expect(service.parse('*italic*')).toBe('<p><em>italic</em></p>');
  });

  it('converts links', () => {
    expect(service.parse('[text](https://example.com)')).toBe('<p><a href="https://example.com">text</a></p>');
  });

  it('converts bullet lists', () => {
    const result = service.parse('- item1\n- item2');
    expect(result).toBe('<ul><li>item1</li><li>item2</li></ul>');
  });

  it('converts numbered lists', () => {
    const result = service.parse('1. first\n2. second');
    expect(result).toBe('<ol><li>first</li><li>second</li></ol>');
  });

  it('passes unsupported syntax as plain text', () => {
    const result = service.parse('```code```');
    expect(result).toContain('```code```');
  });
});
