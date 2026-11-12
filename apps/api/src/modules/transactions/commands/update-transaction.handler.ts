import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TransactionView, UpdateTransactionCommand } from '../contract';
import { TransactionsService } from '../transactions.service';

@CommandHandler(UpdateTransactionCommand)
export class UpdateTransactionHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(private readonly transactions: TransactionsService) {}

  execute({ userId, id, changes }: UpdateTransactionCommand): Promise<TransactionView> {
    return this.transactions.update(userId, id, changes);
  }
}
