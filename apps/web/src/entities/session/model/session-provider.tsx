'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, UserDto } from '@expense-tracker/shared';

import { setUnauthorizedHandler } from '@/shared/api/http';

import { authApi } from '../api/auth-api';
import { parseStoredSession } from './stored-session';

const STORAGE_KEY = 'expense-tracker.session';

interface SessionContextValue {
  user: UserDto | null;
  token: string | null;
  /** false, пока сессия не прочитана из localStorage (до гидратации) */
  ready: boolean;
  signIn: (auth: AuthResponse) => void;
  signOut: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let restored: AuthResponse | null = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        restored = parseStoredSession(raw);
        if (!restored) localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage недоступен — начинаем без сессии
    }
    if (restored) {
      setSession(restored);
      const { accessToken } = restored;
      // Проверяем токен на сервере: при 401 http-клиент сам завершит сессию (см. ниже);
      // при сетевой ошибке оставляем сохранённую сессию.
      authApi
        .me(accessToken)
        .then((user) =>
          setSession((current) => (current?.accessToken === accessToken ? { ...current, user } : current)),
        )
        .catch(() => {});
    }
    setReady(true);
  }, []);

  const signIn = useCallback((auth: AuthResponse) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    setSession(auth);
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  // Любой запрос с токеном, получивший 401, завершает сессию: guard перенаправит на /login.
  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo<SessionContextValue>(
    () => ({
      user: session?.user ?? null,
      token: session?.accessToken ?? null,
      ready,
      signIn,
      signOut,
    }),
    [session, ready, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used within SessionProvider');
  return context;
}
