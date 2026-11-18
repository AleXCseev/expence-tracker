import type { ReactNode } from 'react';

import { SessionProvider } from '@/entities/session';
import { I18nProvider } from '@/shared/i18n';

import './globals.css';

export const metadata = {
  title: 'Expense Tracker',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <I18nProvider>
          <SessionProvider>{children}</SessionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
