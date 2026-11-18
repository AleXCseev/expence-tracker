'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSession } from '@/entities/session';
import { transactionApi } from '@/entities/transaction';
import { toServerError, type ServerError } from '@/shared/api/server-error';

import { createTransactionSchema, type CreateTransactionFormValues } from './schema';

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
