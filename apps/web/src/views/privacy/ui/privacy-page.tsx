'use client';

import { useI18n, type Locale } from '@/shared/i18n';
import { LegalDocument } from '@/widgets/legal-document';

import { PrivacyContentEn } from './privacy-content-en';
import { PrivacyContentRu } from './privacy-content-ru';
import { PrivacyContentUk } from './privacy-content-uk';

const documents: Record<Locale, { title: string; Content: () => React.JSX.Element }> = {
  uk: { title: 'Політика обробки персональних даних', Content: PrivacyContentUk },
  ru: { title: 'Политика обработки персональных данных', Content: PrivacyContentRu },
  en: { title: 'Personal Data Processing Policy', Content: PrivacyContentEn },
};

export function PrivacyPage() {
  const { locale } = useI18n();
  const { title, Content } = documents[locale];

  return (
    <LegalDocument title={title} updatedAt="02.11.2026">
      <Content />
    </LegalDocument>
  );
}
