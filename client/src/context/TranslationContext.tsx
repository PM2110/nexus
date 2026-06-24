import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../locales/en.json';
import type { Translations, TranslationContextType } from '../types';

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState('en');
  const [translations, setTranslations] = useState<Translations>(enTranslations);

  // In the future, this can load other locales dynamically
  useEffect(() => {
    if (locale === 'en') {
      setTranslations(enTranslations);
    }
  }, [locale]);

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    // Traverse nested keys: e.g., 'login.welcome_back'
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key as fallback
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key does not resolve to a string: ${key}`);
      return key;
    }

    // Apply replacements: e.g., 'Showing {start} to {end}' -> 'Showing 1 to 10'
    let result = value;
    if (replacements) {
      Object.entries(replacements).forEach(([k, val]) => {
        result = result.replace(new RegExp(`{${k}}`, 'g'), String(val));
      });
    }

    return result;
  };

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
