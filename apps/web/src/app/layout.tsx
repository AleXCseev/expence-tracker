import type { ReactNode } from 'react';

import { SessionProvider } from '@/entities/session';

import './globals.css';

export const metadata = {
  title: 'Expense Tracker',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
