import { TransactionType } from './transaction-view';

export class CreateTransactionCommand {
  constructor(
    public readonly userId: string,
    public readonly input: {
      amount: number;
      type: TransactionType;
      description?: string;
      date: Date;
      categoryId: string;
    },
  ) {}
}
