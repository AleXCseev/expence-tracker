import { env } from '@/shared/config/env';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[],
  ) {
    super(messages.join('; '));
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  let response: Response;
  try {
    response = await fetch(`${env.apiUrl}${path}`, {
      method,
      headers: {
        ...(body !== undefined && { 'Content-Type': 'application/json' }),
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, ['Не удалось подключиться к серверу']);
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message = (data as { message?: string | string[] } | null)?.message;
    const messages = Array.isArray(message) ? message : message ? [message] : [response.statusText];
    throw new ApiError(response.status, messages);
  }

  return data as T;
}
