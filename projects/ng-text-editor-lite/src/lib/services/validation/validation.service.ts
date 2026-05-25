import { Injectable } from '@angular/core';
import { EditorMode } from '../../models/editor-config.model';

export interface ValidationResult {
  valid: boolean;
  reason?: 'maxLength' | 'empty' | 'disabled';
}

@Injectable({ providedIn: 'root' })
export class ValidationService {
  validate(text: string, maxLength: number, mode: EditorMode): ValidationResult {
    if (mode === 'disabled') {
      return { valid: false, reason: 'disabled' };
    }
    if (text.length > maxLength) {
      return { valid: false, reason: 'maxLength' };
    }
    return { valid: true };
  }

  isEmpty(html: string): boolean {
    const text = html.replace(/<[^>]*>/g, '').trim();
    return text.length === 0;
  }
}
