'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

import { useI18n } from '@/shared/i18n';

interface LegalDocumentProps {
  title: string;
  updatedAt: string;
  children: ReactNode;
}

export function LegalDocument({ title, updatedAt, children }: LegalDocumentProps) {
  const { t } = useI18n();

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
      <Link
        href="/register"
        className="text-sm text-muted-foreground underline-offset-4 hover:underline"
      >
        {t('legal.backToRegister')}
      </Link>
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-muted-foreground">
          {t('legal.revisionFrom', { date: updatedAt })}
        </p>
      </header>
      <div className="flex flex-col gap-4 text-sm leading-relaxed [&_h2]:mt-4 [&_h2]:text-lg [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1">
        {children}
      </div>
    </main>
  );
}
