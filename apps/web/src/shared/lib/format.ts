import type { Locale } from '@/shared/i18n';

const intlLocale: Record<Locale, string> = { ru: 'ru-RU', uk: 'uk-UA', en: 'en-US' };

export function formatAmount(amount: string, locale: Locale): string {
  return new Intl.NumberFormat(intlLocale[locale], {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale[locale], {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(iso));
}
