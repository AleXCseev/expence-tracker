import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserTransactionsQuery, TransactionView } from '../contract';
import { TransactionsService } from '../transactions.service';

@QueryHandler(GetUserTransactionsQuery)
export class GetUserTransactionsHandler implements IQueryHandler<GetUserTransactionsQuery> {
  constructor(private readonly transactions: TransactionsService) {}

  execute({ userId, filters }: GetUserTransactionsQuery): Promise<TransactionView[]> {
    return this.transactions.findAll(userId, filters);
  }
}
