export type Translations = Record<string, any>;

export interface TranslationContextType {
  t: (key: string, replacements?: Record<string, string | number>) => string;
  locale: string;
  setLocale: (locale: string) => void;
}
