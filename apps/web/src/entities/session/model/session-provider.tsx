'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthResponse, UserDto } from '@expense-tracker/shared';

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
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as AuthResponse);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
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
