import { TransactionType } from './transaction-view';

export interface TransactionSummaryView {
  month: number;
  year: number;
  income: string;
  expense: string;
  balance: string;
  byCategory: { categoryId: string; type: TransactionType; total: string }[];
}
