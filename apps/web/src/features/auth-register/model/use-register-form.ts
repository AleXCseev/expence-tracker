'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authApi, useSession } from '@/entities/session';
import { ApiError } from '@/shared/api/http';
import type { MessageKey } from '@/shared/i18n';

import { registerSchema, type RegisterFormValues } from './schema';

/** Ключ перевода для известных ошибок или сырой текст, пришедший с бэкенда */
export type ServerError = { key: MessageKey } | { text: string };

function toServerError(error: unknown): ServerError {
  if (error instanceof ApiError) {
    if (error.status === 409) return { key: 'auth.register.emailTaken' };
    if (error.status === 0) return { key: 'errors.network' };
    return { text: error.messages.join('. ') };
  }
  return { key: 'errors.generic' };
}

export function useRegisterForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [serverError, setServerError] = useState<ServerError | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', agreed: false },
  });

  const onSubmit = form.handleSubmit(async ({ name, email, password }) => {
    setServerError(null);
    try {
      signIn(await authApi.register({ name, email, password }));
      router.push('/');
    } catch (error) {
      setServerError(toServerError(error));
    }
  });

  return { form, onSubmit, serverError };
}
