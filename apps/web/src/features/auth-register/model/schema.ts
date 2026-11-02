import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(1, 'Введите имя').max(100, 'Не более 100 символов'),
  email: z.email('Введите корректный email'),
  password: z.string().min(8, 'Минимум 8 символов').max(72, 'Не более 72 символов'),
  agreed: z.boolean().refine((value) => value, 'Необходимо принять условия, чтобы продолжить'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
