import { TransactionType } from './transaction-view';

export interface TransactionFilters {
  dateFrom?: Date;
  dateTo?: Date;
  type?: TransactionType;
  categoryId?: string;
}

export class GetUserTransactionsQuery {
  constructor(
    public readonly userId: string,
    public readonly filters: TransactionFilters,
  ) {}
}
