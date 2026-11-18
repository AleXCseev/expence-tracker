import { z } from 'zod';

// bcrypt на сервере учитывает только 72 байта, а не символа.
const maxBytes = (value: string) => new TextEncoder().encode(value).length <= 72;

export const loginSchema = z.object({
  email: z.email('auth.validation.email'),
  password: z
    .string()
    .min(1, 'auth.validation.passwordRequired')
    .refine(maxBytes, 'auth.validation.passwordMax'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
