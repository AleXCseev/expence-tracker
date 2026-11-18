import { z } from 'zod';
import type { AuthResponse } from '@expense-tracker/shared';

const storedSessionSchema = z.object({
  accessToken: z.string().min(1),
  user: z.object({
    id: z.string().min(1),
    name: z.string(),
    email: z.string(),
  }),
});

/** Разбирает значение из localStorage; при любом несоответствии формату возвращает null. */
export function parseStoredSession(raw: string): AuthResponse | null {
  try {
    const result = storedSessionSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
