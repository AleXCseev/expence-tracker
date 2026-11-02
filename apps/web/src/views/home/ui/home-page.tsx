'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from '@/entities/session';
import { Button } from '@/shared/ui/button';

export function HomePage() {
  const router = useRouter();
  const { user, ready, signOut } = useSession();

  useEffect(() => {
    if (ready && !user) router.replace('/login');
  }, [ready, user, router]);

  if (!user) return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-semibold">Привет, {user.name}!</h1>
      <Button variant="outline" onClick={signOut}>
        Выйти
      </Button>
    </main>
  );
}
