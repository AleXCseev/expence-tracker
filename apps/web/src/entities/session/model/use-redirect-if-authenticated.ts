'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from './session-provider';

/** Для публичных страниц входа/регистрации: авторизованного пользователя отправляет на главную. */
export function useRedirectIfAuthenticated(to = '/') {
  const router = useRouter();
  const { user, ready } = useSession();

  useEffect(() => {
    if (ready && user) router.replace(to);
  }, [ready, user, router, to]);
}
