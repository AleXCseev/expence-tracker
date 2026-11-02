'use client';

import { useI18n, type Locale } from '@/shared/i18n';
import { LegalDocument } from '@/widgets/legal-document';

import { TermsContentEn } from './terms-content-en';
import { TermsContentRu } from './terms-content-ru';
import { TermsContentUk } from './terms-content-uk';

const documents: Record<Locale, { title: string; Content: () => React.JSX.Element }> = {
  uk: { title: 'Угода користувача', Content: TermsContentUk },
  ru: { title: 'Пользовательское соглашение', Content: TermsContentRu },
  en: { title: 'Terms of Service', Content: TermsContentEn },
};

export function TermsPage() {
  const { locale } = useI18n();
  const { title, Content } = documents[locale];

  return (
    <LegalDocument title={title} updatedAt="02.11.2026">
      <Content />
    </LegalDocument>
  );
}
