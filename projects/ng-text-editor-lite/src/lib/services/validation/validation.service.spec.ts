import { TestBed } from '@angular/core/testing';
import { ValidationService } from './validation.service';

describe('ValidationService', () => {
  let service: ValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidationService);
  });

  it('passes within maxLength', () => {
    expect(service.validate('hello', 3000, 'edit').valid).toBe(true);
  });

  it('fails when text exceeds maxLength', () => {
    const result = service.validate('a'.repeat(3001), 3000, 'edit');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('maxLength');
  });

  it('fails when mode is disabled', () => {
    const result = service.validate('hello', 3000, 'disabled');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('disabled');
  });

  it('detects empty html', () => {
    expect(service.isEmpty('<p></p>')).toBe(true);
    expect(service.isEmpty('<p>hello</p>')).toBe(false);
  });
});
