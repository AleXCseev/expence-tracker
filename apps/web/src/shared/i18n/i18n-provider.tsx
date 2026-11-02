'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { defaultLocale, isLocale, LOCALE_STORAGE_KEY, type Locale } from './config';
import { en } from './messages/en';
import type { Messages } from './messages/ru';
import { ru } from './messages/ru';
import { uk } from './messages/uk';

const dictionaries: Record<Locale, Messages> = { ru, uk, en };

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type MessageKey = Paths<Messages>;

type TranslateParams = Record<string, string | number>;

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, params?: TranslateParams) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function translate(locale: Locale, key: MessageKey, params?: TranslateParams): string {
  const value = key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], dictionaries[locale]);
  const text = typeof value === 'string' ? value : key;
  return params ? text.replace(/\{(\w+)\}/g, (match, name) => String(params[name] ?? match)) : text;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(stored)) setLocaleState(stored);
    } catch {
      // localStorage недоступен — остаёмся на языке по умолчанию
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // не критично: язык просто не запомнится
    }
    setLocaleState(next);
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: (key, params) => translate(locale, key, params) }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
