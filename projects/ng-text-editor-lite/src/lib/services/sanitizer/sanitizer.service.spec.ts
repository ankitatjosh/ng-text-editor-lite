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
});
