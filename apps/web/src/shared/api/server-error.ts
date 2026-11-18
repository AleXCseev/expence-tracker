import type { MessageKey } from '@/shared/i18n';

import { ApiError } from './http';

/** Ключ перевода для известных ошибок или сырой текст, пришедший с бэкенда */
export type ServerError = { key: MessageKey } | { text: string };

/**
 * Приводит ошибку запроса к виду, пригодному для показа в форме.
 * `byStatus` — переопределения текста для конкретных HTTP-статусов (например, 409 при регистрации).
 */
export function toServerError(
  error: unknown,
  byStatus: Partial<Record<number, MessageKey>> = {},
): ServerError {
  if (!(error instanceof ApiError)) return { key: 'errors.generic' };
  if (error.status === 0) return { key: 'errors.network' };
  if (error.status === 429) return { key: 'errors.tooManyRequests' };
  const key = byStatus[error.status];
  return key ? { key } : { text: error.messages.join('. ') };
}
