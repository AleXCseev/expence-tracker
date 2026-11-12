'use client';

import { useI18n } from '@/shared/i18n';

// Заглушка: экран категорий будет реализован отдельной фичей.
export function CategoriesPage() {
  const { t } = useI18n();

  return (
    <section className="grid gap-2">
      <h1 className="text-2xl font-semibold">{t('categories.title')}</h1>
      <p className="text-sm text-muted-foreground">{t('stub.soon')}</p>
    </section>
  );
}
