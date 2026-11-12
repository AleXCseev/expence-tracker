import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionQuery, TransactionView } from '../contract';
import { TransactionsService } from '../transactions.service';

@QueryHandler(GetTransactionQuery)
export class GetTransactionHandler implements IQueryHandler<GetTransactionQuery> {
  constructor(private readonly transactions: TransactionsService) {}

  execute({ userId, id }: GetTransactionQuery): Promise<TransactionView> {
    return this.transactions.findOne(userId, id);
  }
}
