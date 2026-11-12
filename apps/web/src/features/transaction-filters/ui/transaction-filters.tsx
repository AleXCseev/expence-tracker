'use client';

import type { CategoryDto, TransactionType } from '@expense-tracker/shared';

import { emptyFilters, type TransactionListFilters } from '@/entities/transaction';
import { useI18n } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Select } from '@/shared/ui/select';

interface TransactionFiltersProps {
  value: TransactionListFilters;
  categories: CategoryDto[];
  onChange: (value: TransactionListFilters) => void;
}

export function TransactionFilters({ value, categories, onChange }: TransactionFiltersProps) {
  const { t } = useI18n();
  const isDirty = Object.values(value).some(Boolean);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-end">
      <div className="grid gap-1.5">
        <Label htmlFor="filter-type">{t('transactions.filters.type')}</Label>
        <Select
          id="filter-type"
          value={value.type}
          onChange={(e) => onChange({ ...value, type: e.target.value as TransactionType | '' })}
        >
          <option value="">{t('transactions.filters.allTypes')}</option>
          <option value="INCOME">{t('transactions.income')}</option>
          <option value="EXPENSE">{t('transactions.expense')}</option>
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="filter-category">{t('transactions.filters.category')}</Label>
        <Select
          id="filter-category"
          value={value.categoryId}
          onChange={(e) => onChange({ ...value, categoryId: e.target.value })}
        >
          <option value="">{t('transactions.filters.allCategories')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="filter-from">{t('transactions.filters.dateFrom')}</Label>
        <Input
          id="filter-from"
          type="date"
          value={value.dateFrom}
          max={value.dateTo || undefined}
          onChange={(e) => onChange({ ...value, dateFrom: e.target.value })}
        />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="filter-to">{t('transactions.filters.dateTo')}</Label>
        <Input
          id="filter-to"
          type="date"
          value={value.dateTo}
          min={value.dateFrom || undefined}
          onChange={(e) => onChange({ ...value, dateTo: e.target.value })}
        />
      </div>
      <Button variant="ghost" disabled={!isDirty} onClick={() => onChange(emptyFilters)}>
        {t('transactions.filters.reset')}
      </Button>
    </div>
  );
}
