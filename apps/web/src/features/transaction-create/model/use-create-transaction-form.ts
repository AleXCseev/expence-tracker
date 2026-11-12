'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSession } from '@/entities/session';
import { transactionApi } from '@/entities/transaction';
import { ApiError } from '@/shared/api/http';
import type { MessageKey } from '@/shared/i18n';

import { createTransactionSchema, type CreateTransactionFormValues } from './schema';

/** Ключ перевода для известных ошибок или сырой текст, пришедший с бэкенда */
export type ServerError = { key: MessageKey } | { text: string };

function toServerError(error: unknown): ServerError {
  if (error instanceof ApiError) {
    if (error.status === 0) return { key: 'errors.network' };
    return { text: error.messages.join('. ') };
  }
  return { key: 'errors.generic' };
}

function today(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

const defaultValues = (): CreateTransactionFormValues => ({
  amount: '',
  type: 'EXPENSE',
  categoryId: '',
  date: today(),
  description: '',
});

export function useCreateTransactionForm(onCreated: () => void) {
  const { token } = useSession();
  const [serverError, setServerError] = useState<ServerError | null>(null);

  const form = useForm<CreateTransactionFormValues>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: defaultValues(),
  });

  const reset = () => {
    form.reset(defaultValues());
    setServerError(null);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (!token) return;
    setServerError(null);
    try {
      const description = values.description.trim();
      await transactionApi.create(token, {
        amount: Number(values.amount.replace(',', '.')),
        type: values.type,
        categoryId: values.categoryId,
        date: `${values.date}T00:00:00.000Z`,
        ...(description && { description }),
      });
      reset();
      onCreated();
    } catch (error) {
      setServerError(toServerError(error));
    }
  });

  return { form, onSubmit, serverError, reset };
}
