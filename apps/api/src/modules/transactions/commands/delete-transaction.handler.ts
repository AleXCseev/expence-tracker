import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTransactionCommand } from '../contract';
import { TransactionsService } from '../transactions.service';

@CommandHandler(DeleteTransactionCommand)
export class DeleteTransactionHandler implements ICommandHandler<DeleteTransactionCommand> {
  constructor(private readonly transactions: TransactionsService) {}

  execute({ userId, id }: DeleteTransactionCommand): Promise<void> {
    return this.transactions.remove(userId, id);
  }
}
