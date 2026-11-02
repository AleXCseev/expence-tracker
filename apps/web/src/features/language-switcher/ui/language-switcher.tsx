'use client';

import { localeLabels, locales, useI18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';

// TODO: временный переключатель языка — заменить на постоянное решение в интерфейсе
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-1">
      {locales.map((code) => (
        <Button
          key={code}
          size="sm"
          variant={code === locale ? 'default' : 'outline'}
          aria-pressed={code === locale}
          onClick={() => setLocale(code)}
        >
          {localeLabels[code]}
        </Button>
      ))}
    </div>
  );
}
