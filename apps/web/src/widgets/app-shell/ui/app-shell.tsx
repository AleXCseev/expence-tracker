'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from '@/entities/session';
import { AppSidebar } from '@/widgets/app-sidebar';
import { UserMenu } from '@/widgets/user-menu';

// Каркас авторизованной части приложения: guard + боковое меню + шапка с профилем.
export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, ready } = useSession();

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-end border-b px-4 py-3 md:px-8">
          <UserMenu />
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
