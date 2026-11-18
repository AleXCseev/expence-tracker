import { z } from 'zod';

const MAX_AMOUNT = 9999999999.99;

export const createTransactionSchema = z.object({
  amount: z
    .string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, 'transactions.create.validation.amountInvalid')
    .refine((value) => Number(value.replace(',', '.')) > 0, {
      message: 'transactions.create.validation.amountInvalid',
    })
    .refine((value) => Number(value.replace(',', '.')) <= MAX_AMOUNT, {
      message: 'transactions.create.validation.amountMax',
    }),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'transactions.create.validation.categoryRequired'),
  date: z.string().min(1, 'transactions.create.validation.dateRequired'),
  description: z.string().max(500, 'transactions.create.validation.descriptionMax'),
});

export type CreateTransactionFormValues = z.infer<typeof createTransactionSchema>;
