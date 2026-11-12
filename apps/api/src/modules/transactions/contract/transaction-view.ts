export type TransactionType = 'INCOME' | 'EXPENSE';

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
