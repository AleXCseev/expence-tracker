'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { authApi, useSession } from '@/entities/session';
import { ApiError } from '@/shared/api/http';

import { registerSchema, type RegisterFormValues } from './schema';

export function useRegisterForm() {
  const router = useRouter();
  const { signIn } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);

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
      setServerError(
        error instanceof ApiError && error.status === 409
          ? 'Пользователь с таким email уже зарегистрирован'
          : error instanceof ApiError
            ? error.messages.join('. ')
            : 'Что-то пошло не так',
      );
    }
  });

  return { form, onSubmit, serverError };
}
