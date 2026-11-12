import type {
  CreateTransactionRequest,
  ListTransactionsQuery,
  PaginatedResponse,
  TransactionDto,
} from '@expense-tracker/shared';

import { http } from '@/shared/api/http';

export const transactionApi = {
  list: (token: string, query: ListTransactionsQuery) =>
    http<PaginatedResponse<TransactionDto>>('/transactions', { token, query: { ...query } }),
  create: (token: string, body: CreateTransactionRequest) =>
    http<TransactionDto>('/transactions', { method: 'POST', body, token }),
};
