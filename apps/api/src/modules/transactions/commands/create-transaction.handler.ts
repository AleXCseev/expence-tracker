import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTransactionCommand, TransactionView } from '../contract';
import { TransactionsService } from '../transactions.service';

@CommandHandler(CreateTransactionCommand)
export class CreateTransactionHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(private readonly transactions: TransactionsService) {}

  execute({ userId, input }: CreateTransactionCommand): Promise<TransactionView> {
    return this.transactions.create(userId, input);
  }
}
