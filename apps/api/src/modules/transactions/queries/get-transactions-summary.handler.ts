import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetTransactionsSummaryQuery, TransactionSummaryView } from '../contract';
import { TransactionsService } from '../transactions.service';

@QueryHandler(GetTransactionsSummaryQuery)
export class GetTransactionsSummaryHandler implements IQueryHandler<GetTransactionsSummaryQuery> {
  constructor(private readonly transactions: TransactionsService) {}

  execute({ userId, month, year }: GetTransactionsSummaryQuery): Promise<TransactionSummaryView> {
    return this.transactions.summary(userId, month, year);
  }
}
