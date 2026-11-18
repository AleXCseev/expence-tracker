'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { CategoryDto } from '@expense-tracker/shared';

import { useI18n, type MessageKey } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Dialog } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select } from '@/shared/ui/select';

import { useCreateTransactionForm } from '../model/use-create-transaction-form';

interface CreateTransactionDialogProps {
  categories: CategoryDto[];
  onCreated: () => void;
}

export function CreateTransactionDialog({ categories, onCreated }: CreateTransactionDialogProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  const {
    form: {
      register,
      formState: { errors, isSubmitting },
    },
    onSubmit,
    serverError,
    reset,
  } = useCreateTransactionForm(() => {
    setOpen(false);
    onCreated();
  });

  const close = () => {
    setOpen(false);
    reset();
  };

  const fieldError = (message?: string) =>
    message && <p className="text-sm text-destructive">{t(message as MessageKey)}</p>;

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        {t('transactions.create.open')}
      </Button>
      <Dialog open={open} onClose={close} title={t('transactions.create.title')}>
        {categories.length === 0 ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{t('transactions.create.noCategories')}</p>
            <Button variant="outline" onClick={close}>
              {t('transactions.create.cancel')}
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="create-type">{t('transactions.create.type')}</Label>
                <Select id="create-type" {...register('type')}>
                  <option value="EXPENSE">{t('transactions.expense')}</option>
                  <option value="INCOME">{t('transactions.income')}</option>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="create-amount">{t('transactions.create.amount')}</Label>
                <Input
                  id="create-amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  aria-invalid={!!errors.amount}
                  {...register('amount')}
                />
              </div>
            </div>
            {fieldError(errors.amount?.message)}
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-category">{t('transactions.create.category')}</Label>
              <Select
                id="create-category"
                aria-invalid={!!errors.categoryId}
                {...register('categoryId')}
              >
                <option value="">{t('transactions.create.selectCategory')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
              {fieldError(errors.categoryId?.message)}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-date">{t('transactions.create.date')}</Label>
              <Input
                id="create-date"
                type="date"
                aria-invalid={!!errors.date}
                {...register('date')}
              />
              {fieldError(errors.date?.message)}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-description">{t('transactions.create.description')}</Label>
              <Input
                id="create-description"
                placeholder={t('transactions.create.descriptionPlaceholder')}
                aria-invalid={!!errors.description}
                {...register('description')}
              />
              {fieldError(errors.description?.message)}
            </div>
            {serverError && (
              <p role="alert" className="text-sm text-destructive">
                {'key' in serverError ? t(serverError.key) : serverError.text}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={close}>
                {t('transactions.create.cancel')}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t('transactions.create.submitting')
                  : t('transactions.create.submit')}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </>
  );
}
