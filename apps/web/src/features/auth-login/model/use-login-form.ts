'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authApi, useSession } from '@/entities/session';
import { ApiError } from '@/shared/api/http';

import { loginSchema, type LoginFormValues } from './schema';

export function useLoginForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);

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
      setServerError(
        error instanceof ApiError && error.status === 401
          ? 'Неверный email или пароль'
          : error instanceof ApiError
            ? error.messages.join('. ')
            : 'Что-то пошло не так',
      );
    }
  });

  return { form, onSubmit, serverError };
}
