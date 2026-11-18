export type TransactionType = 'INCOME' | 'EXPENSE';

export interface PaginatedView<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TransactionView {
  id: string;
  amount: string;
  type: TransactionType;
  description: string | null;
  date: Date;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}
