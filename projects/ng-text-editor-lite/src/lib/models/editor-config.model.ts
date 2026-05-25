export type EditorMode = 'edit' | 'readonly' | 'preview' | 'disabled';
export type EditorTheme = 'light' | 'dark';

export interface EditorConfig {
  placeholder?: string;
  maxLength?: number;
  autoGrow?: boolean;
  minHeight?: string;
  maxHeight?: string;
  theme?: EditorTheme;
  mentionTextColor?: string;
  mentionBackgroundColor?: string;
}
