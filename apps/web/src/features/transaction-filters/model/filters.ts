import type { ListTransactionsQuery, TransactionType } from '@expense-tracker/shared';

/** Значения полей формы фильтров ('' — фильтр не задан, даты в формате YYYY-MM-DD) */
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

export const hasActiveFilters = (filters: TransactionListFilters): boolean =>
  Object.values(filters).some(Boolean);

/** Переводит значения формы в параметры запроса к API (границы дня — по UTC). */
export function toListQuery(
  filters: TransactionListFilters,
): Pick<ListTransactionsQuery, 'type' | 'categoryId' | 'dateFrom' | 'dateTo'> {
  return {
    type: filters.type || undefined,
    categoryId: filters.categoryId || undefined,
    dateFrom: filters.dateFrom ? `${filters.dateFrom}T00:00:00.000Z` : undefined,
    dateTo: filters.dateTo ? `${filters.dateTo}T23:59:59.999Z` : undefined,
  };
}
