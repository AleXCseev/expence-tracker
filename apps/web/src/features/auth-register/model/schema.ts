import { z } from 'zod';

// bcrypt на сервере учитывает только 72 байта, а не символа.
const maxBytes = (value: string) => new TextEncoder().encode(value).length <= 72;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'auth.validation.nameRequired')
    .max(100, 'auth.validation.nameMax'),
  email: z.email('auth.validation.email'),
  password: z
    .string()
    .min(8, 'auth.validation.passwordMin')
    .refine(maxBytes, 'auth.validation.passwordMax'),
  agreed: z.boolean().refine((value) => value, 'auth.validation.agreed'),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
