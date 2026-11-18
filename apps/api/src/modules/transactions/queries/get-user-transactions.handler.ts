import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserTransactionsQuery, PaginatedView, TransactionView } from '../contract';
import { TransactionsService } from '../transactions.service';

@QueryHandler(GetUserTransactionsQuery)
export class GetUserTransactionsHandler implements IQueryHandler<GetUserTransactionsQuery> {
  constructor(private readonly transactions: TransactionsService) {}

  execute({
    userId,
    filters,
    page,
    limit,
  }: GetUserTransactionsQuery): Promise<PaginatedView<TransactionView>> {
    return this.transactions.findAll(userId, filters, page, limit);
  }
}
