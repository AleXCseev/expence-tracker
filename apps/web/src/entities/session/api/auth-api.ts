import type { AuthResponse, LoginRequest, RegisterRequest, UserDto } from '@expense-tracker/shared';

import { http } from '@/shared/api/http';

export const authApi = {
  register: (body: RegisterRequest) =>
    http<AuthResponse>('/auth/register', { method: 'POST', body }),
  login: (body: LoginRequest) => http<AuthResponse>('/auth/login', { method: 'POST', body }),
  me: (token: string) => http<UserDto>('/auth/me', { token }),
};
