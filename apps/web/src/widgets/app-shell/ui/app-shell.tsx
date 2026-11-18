'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from '@/entities/session';

interface AppShellProps {
  /** Боковое меню: передаётся сверху (слой app), чтобы виджеты не импортировали друг друга */
  sidebar: ReactNode;
  /** Содержимое шапки (меню пользователя) */
  header: ReactNode;
  children: ReactNode;
}

// Каркас авторизованной части приложения: guard + боковое меню + шапка.
export function AppShell({ sidebar, header, children }: AppShellProps) {
  const router = useRouter();
  const { user, ready } = useSession();

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {sidebar}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b px-4 py-3 md:px-8">
          {header}
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
