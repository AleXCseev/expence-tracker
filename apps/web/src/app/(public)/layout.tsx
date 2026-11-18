import type { ReactNode } from 'react';

import { LanguageSwitcher } from '@/features/language-switcher';

// Страницы без боковой панели (вход, регистрация, юридические документы).
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <LanguageSwitcher floating />
    </>
  );
}
