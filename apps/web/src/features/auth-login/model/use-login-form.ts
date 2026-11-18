'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authApi, useSession } from '@/entities/session';
import { toServerError, type ServerError } from '@/shared/api/server-error';

import { loginSchema, type LoginFormValues } from './schema';

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
      setServerError(toServerError(error, { 401: 'auth.login.invalidCredentials' }));
    }
  });

  return { form, onSubmit, serverError };
}
