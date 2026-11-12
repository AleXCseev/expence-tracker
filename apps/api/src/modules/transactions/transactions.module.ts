import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CreateTransactionHandler } from './commands/create-transaction.handler';
import { DeleteTransactionHandler } from './commands/delete-transaction.handler';
import { UpdateTransactionHandler } from './commands/update-transaction.handler';
import { GetTransactionHandler } from './queries/get-transaction.handler';
import { GetTransactionsSummaryHandler } from './queries/get-transactions-summary.handler';
import { GetUserTransactionsHandler } from './queries/get-user-transactions.handler';
import { TransactionsController } from './transactions.controller';
import { TransactionsRepository } from './transactions.repository';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [AuthModule],
  controllers: [TransactionsController],
  providers: [
    TransactionsRepository,
    TransactionsService,
    CreateTransactionHandler,
    UpdateTransactionHandler,
    DeleteTransactionHandler,
    GetUserTransactionsHandler,
    GetTransactionHandler,
    GetTransactionsSummaryHandler,
  ],
})
export class TransactionsModule {}
