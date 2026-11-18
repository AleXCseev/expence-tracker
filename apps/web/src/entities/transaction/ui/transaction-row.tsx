'use client';

import type { CategoryDto, TransactionDto } from '@expense-tracker/shared';

import { useI18n } from '@/shared/i18n';
import { formatAmount, formatDate } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';

interface TransactionRowProps {
  transaction: TransactionDto;
  category?: CategoryDto;
}

export function TransactionRow({ transaction, category }: TransactionRowProps) {
  const { t, locale } = useI18n();
  const isIncome = transaction.type === 'INCOME';

  return (
    <li className="flex items-center gap-3 px-4 py-3">
      <span
        className="size-3 shrink-0 rounded-full"
        style={{ backgroundColor: category?.color ?? '#9CA3AF' }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {transaction.description ?? t('transactions.noDescription')}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {category?.name ?? t('transactions.uncategorized')} ·{' '}
          {formatDate(transaction.date, locale)}
        </p>
      </div>
      <span
        className={cn(
          'shrink-0 text-sm font-semibold tabular-nums',
          isIncome ? 'text-green-600' : 'text-red-600',
        )}
      >
        {isIncome ? '+' : '−'}
        {formatAmount(transaction.amount, locale)}
      </span>
    </li>
  );
}
