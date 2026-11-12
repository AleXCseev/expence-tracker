import { TransactionType } from './transaction-view';

export class UpdateTransactionCommand {
  constructor(
    public readonly userId: string,
    public readonly id: string,
    public readonly changes: {
      amount?: number;
      type?: TransactionType;
      description?: string;
      date?: Date;
      categoryId?: string;
    },
  ) {}
}
