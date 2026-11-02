'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authApi, useSession } from '@/entities/session';
import { ApiError } from '@/shared/api/http';
import type { MessageKey } from '@/shared/i18n';

import { loginSchema, type LoginFormValues } from './schema';

/** Ключ перевода для известных ошибок или сырой текст, пришедший с бэкенда */
export type ServerError = { key: MessageKey } | { text: string };

function toServerError(error: unknown): ServerError {
  if (error instanceof ApiError) {
    if (error.status === 401) return { key: 'auth.login.invalidCredentials' };
    if (error.status === 0) return { key: 'errors.network' };
    return { text: error.messages.join('. ') };
  }
  return { key: 'errors.generic' };
}

export function useLoginForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [serverError, setServerError] = useState<ServerError | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);
    try {
      signIn(await authApi.login(values));
      router.push('/');
    } catch (error) {
      setServerError(toServerError(error));
    }
  });

  return { form, onSubmit, serverError };
}
