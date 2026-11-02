import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('auth.validation.email'),
  password: z
    .string()
    .min(1, 'auth.validation.passwordRequired')
    .max(72, 'auth.validation.passwordMax'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
