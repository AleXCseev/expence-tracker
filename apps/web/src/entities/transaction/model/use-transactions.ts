'use client';

import { useCallback, useEffect, useState } from 'react';
import type { PaginatedResponse, TransactionDto, TransactionType } from '@expense-tracker/shared';

import { ApiError } from '@/shared/api/http';

import { transactionApi } from '../api/transaction-api';

export const PAGE_SIZE = 10;

export interface TransactionListFilters {
  type: TransactionType | '';
  categoryId: string;
  dateFrom: string;
  dateTo: string;
}

export const emptyFilters: TransactionListFilters = {
  type: '',
  categoryId: '',
  dateFrom: '',
  dateTo: '',
};

export function useTransactions(token: string | null) {
  const [filters, setFiltersState] = useState<TransactionListFilters>(emptyFilters);
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<PaginatedResponse<TransactionDto> | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(true);

  const setFilters = useCallback((next: TransactionListFilters) => {
    setFiltersState(next);
    setPage(1);
  }, []);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    transactionApi
      .list(token, {
        page,
        limit: PAGE_SIZE,
        type: filters.type || undefined,
        categoryId: filters.categoryId || undefined,
        dateFrom: filters.dateFrom ? `${filters.dateFrom}T00:00:00.000Z` : undefined,
        dateTo: filters.dateTo ? `${filters.dateTo}T23:59:59.999Z` : undefined,
      })
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
  }, [token, page, filters, reloadKey]);

  return { filters, setFilters, page, setPage, data, loading, error, reload };
}
