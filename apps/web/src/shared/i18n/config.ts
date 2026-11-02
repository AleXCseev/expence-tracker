export const locales = ['ru', 'uk', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const localeLabels: Record<Locale, string> = {
  ru: 'RU',
  uk: 'UA',
  en: 'EN',
};

export const LOCALE_STORAGE_KEY = 'expense-tracker.locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
