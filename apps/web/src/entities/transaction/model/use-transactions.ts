'use client';

import { useCallback, useEffect, useState } from 'react';
import type {
  ListTransactionsQuery,
  PaginatedResponse,
  TransactionDto,
} from '@expense-tracker/shared';

import { ApiError } from '@/shared/api/http';

import { transactionApi } from '../api/transaction-api';

/** Загружает страницу транзакций по запросу; состояние страницы и фильтров хранит вызывающий. */
export function useTransactions(token: string | null, query: ListTransactionsQuery) {
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<PaginatedResponse<TransactionDto> | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);
  // Объект запроса создаётся заново при каждом рендере — сравниваем по содержимому.
  const queryKey = JSON.stringify(query);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    transactionApi
      .list(token, JSON.parse(queryKey) as ListTransactionsQuery)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof ApiError ? e : new ApiError(0, []));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, queryKey, reloadKey]);

  return { data, loading, error, reload };
}
