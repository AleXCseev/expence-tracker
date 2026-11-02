import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'auth.validation.nameRequired')
    .max(100, 'auth.validation.nameMax'),
  email: z.email('auth.validation.email'),
  password: z.string().min(8, 'auth.validation.passwordMin').max(72, 'auth.validation.passwordMax'),
  agreed: z.boolean().refine((value) => value, 'auth.validation.agreed'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
