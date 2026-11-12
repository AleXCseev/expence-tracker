'use client';

import { localeLabels, locales, useI18n } from '@/shared/i18n';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';

// TODO: временный переключатель языка — заменить на постоянное решение в интерфейсе
export function LanguageSwitcher({ floating = false }: { floating?: boolean }) {
  const { locale, setLocale } = useI18n();

  return (
    <div className={cn('flex gap-1', floating && 'fixed top-4 right-4 z-50')}>
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
