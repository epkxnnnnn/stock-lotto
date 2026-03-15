'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import translations, { type Language } from './translations';

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  marketLabel: (th: string, lo?: string | null) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'stock-lotto-lang';

function getStoredLang(): Language {
  if (typeof window === 'undefined') return 'th';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'lo' ? 'lo' : 'th';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start with 'th' on both server and client to avoid hydration mismatch.
  // After mount, we read localStorage and switch if needed.
  const [lang, setLangState] = useState<Language>('th');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = getStoredLang();
    if (stored !== 'th') {
      setLangState(stored);
      document.documentElement.lang = stored;
    }
    setMounted(true);
  }, []);

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
    document.documentElement.lang = newLang === 'lo' ? 'lo' : 'th';
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key;
      // Before mount, always return Thai to match SSR
      if (!mounted) return entry.th;
      return entry[lang];
    },
    [lang, mounted]
  );

  const marketLabel = useCallback(
    (th: string, lo?: string | null): string => {
      if (mounted && lang === 'lo' && lo) return lo;
      return th;
    },
    [lang, mounted]
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, marketLabel }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
