import type { CategoryDto } from '@expense-tracker/shared';

import { http } from '@/shared/api/http';

export const categoryApi = {
  list: (token: string) => http<CategoryDto[]>('/categories', { token }),
};
