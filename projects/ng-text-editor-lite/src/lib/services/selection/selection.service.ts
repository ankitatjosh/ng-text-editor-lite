import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  getSelection(): Selection | null {
    return window.getSelection();
  }

  isFormatActive(command: string): boolean {
    try {
      return document.queryCommandState(command);
    } catch {
      return false;
    }
  }

  execFormat(command: string, value?: string): void {
    document.execCommand(command, false, value);
  }

  saveRange(): Range | null {
    const sel = this.getSelection();
    return sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
  }

  restoreRange(range: Range): void {
    const sel = this.getSelection();
    if (!sel) return;
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
