import { TestBed } from '@angular/core/testing';
import { SanitizerService } from './sanitizer.service';

describe('SanitizerService', () => {
  let service: SanitizerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SanitizerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('strips script tags', () => {
    const result = service.sanitize('<script>alert(1)</script><p>ok</p>');
    expect(result).not.toContain('<script>');
    expect(result).toContain('<p>ok</p>');
  });

  it('strips javascript: hrefs', () => {
    const result = service.sanitize('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain('javascript:');
  });

  it('adds noopener noreferrer to links', () => {
    const result = service.sanitize('<a href="https://example.com">link</a>');
    expect(result).toContain('rel="noopener noreferrer"');
    expect(result).toContain('target="_blank"');
  });

  it('preserves allowed formatting tags', () => {
    const input = '<h1>Title</h1><h2>Sub</h2><strong>b</strong><em>i</em>';
    const result = service.sanitize(input);
    expect(result).toBe(input);
  });

  describe('tag normalization', () => {
    it('converts <b> to <strong>', () => {
      const result = service.sanitize('<b>bold</b>');
      expect(result).toContain('<strong>bold</strong>');
      expect(result).not.toContain('<b>');
    });

    it('converts <i> to <em>', () => {
      const result = service.sanitize('<i>italic</i>');
      expect(result).toContain('<em>italic</em>');
      expect(result).not.toContain('<i>');
    });

    it('converts <strike> to <s>', () => {
      const result = service.sanitize('<strike>struck</strike>');
      expect(result).toContain('<s>struck</s>');
      expect(result).not.toContain('<strike>');
    });

    it('converts <del> to <s>', () => {
      const result = service.sanitize('<del>deleted</del>');
      expect(result).toContain('<s>deleted</s>');
      expect(result).not.toContain('<del>');
    });

    it('preserves allowed attributes when normalizing', () => {
      const result = service.sanitize('<b class="highlight">text</b>');
      expect(result).toContain('<strong class="highlight">text</strong>');
    });

    it('normalizes nested tags', () => {
      const result = service.sanitize('<b><i>text</i></b>');
      expect(result).toContain('<strong><em>text</em></strong>');
    });

    it('leaves <strong>, <em>, <s> unchanged', () => {
      const input = '<strong>a</strong><em>b</em><s>c</s>';
      expect(service.sanitize(input)).toBe(input);
    });
  });
});
