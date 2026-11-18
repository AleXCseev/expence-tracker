'use client';

import { useEffect } from 'react';

import { useCategories } from '@/entities/category';
import { useSession } from '@/entities/session';
import { PAGE_SIZE, TransactionRow, emptyFilters, useTransactions } from '@/entities/transaction';
import { CreateTransactionDialog } from '@/features/transaction-create';
import { TransactionFilters } from '@/features/transaction-filters';
import { useI18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';
import { Pagination } from '@/shared/ui/pagination';
import { Skeleton } from '@/shared/ui/skeleton';

export function TransactionsList() {
  const { t } = useI18n();
  const { token, signOut } = useSession();
  const { categories, byId } = useCategories(token);
  const { filters, setFilters, page, setPage, data, loading, error, reload } =
    useTransactions(token);

  // Токен истёк или недействителен — завершаем сессию, guard перенаправит на /login.
  useEffect(() => {
    if (error?.status === 401) signOut();
  }, [error, signOut]);

  const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;
  const isFiltered = Object.values(filters).some(Boolean);

  // Новая транзакция должна быть видна: сбрасываем фильтры и возвращаемся на первую страницу.
  const handleCreated = () => {
    if (isFiltered) {
      setFilters(emptyFilters);
    } else {
      setPage(1);
      reload();
    }
  };

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">{t('transactions.title')}</h1>
        <CreateTransactionDialog categories={categories} onCreated={handleCreated} />
      </div>
      <Card className="gap-0 py-4">
        <div className="px-4 pb-4">
          <TransactionFilters value={filters} categories={categories} onChange={setFilters} />
        </div>
        <div className="border-t">
          {error ? (
            <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">{t('transactions.error')}</p>
              <Button variant="outline" onClick={reload}>
                {t('transactions.retry')}
              </Button>
            </div>
          ) : loading && !data ? (
            <ul className="divide-y">
              {Array.from({ length: 5 }, (_, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <Skeleton className="size-3 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </li>
              ))}
            </ul>
          ) : data && data.items.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-muted-foreground">
              {isFiltered ? t('transactions.emptyFiltered') : t('transactions.empty')}
            </p>
          ) : (
            <ul className={loading ? 'divide-y opacity-60' : 'divide-y'}>
              {data?.items.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  category={byId.get(transaction.categoryId)}
                />
              ))}
            </ul>
          )}
        </div>
        {data && data.total > 0 && !error && (
          <div className="grid gap-2 border-t px-4 pt-4">
            <Pagination
              page={page}
              pages={pages}
              onPageChange={setPage}
              disabled={loading}
              prevLabel={t('transactions.pagination.prev')}
              nextLabel={t('transactions.pagination.next')}
              statusLabel={t('transactions.pagination.page', { page, pages })}
            />
            <p className="text-center text-xs text-muted-foreground">
              {t('transactions.pagination.total', { total: data.total })}
            </p>
          </div>
        )}
      </Card>
    </section>
  );
}
