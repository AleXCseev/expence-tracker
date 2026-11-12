import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CreateTransactionCommand,
  DeleteTransactionCommand,
  GetTransactionQuery,
  GetTransactionsSummaryQuery,
  GetUserTransactionsQuery,
  TransactionSummaryView,
  TransactionView,
  UpdateTransactionCommand,
} from './contract';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ListTransactionsQueryDto } from './dto/list-transactions-query.dto';
import { SummaryQueryDto } from './dto/summary-query.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class TransactionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateTransactionDto,
  ): Promise<TransactionView> {
    return this.commandBus.execute(
      new CreateTransactionCommand(user.id, {
        amount: dto.amount,
        type: dto.type,
        description: dto.description,
        date: dto.date,
        categoryId: dto.categoryId,
      }),
    );
  }

  @Get()
  findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: ListTransactionsQueryDto,
  ): Promise<TransactionView[]> {
    if (query.dateFrom && query.dateTo && query.dateFrom > query.dateTo) {
      throw new BadRequestException('dateFrom must not be later than dateTo');
    }
    return this.queryBus.execute(
      new GetUserTransactionsQuery(user.id, {
        dateFrom: query.dateFrom,
        dateTo: query.dateTo,
        type: query.type,
        categoryId: query.categoryId,
      }),
    );
  }

  // Must be declared before ':id' so that "summary" is not treated as an id.
  @Get('summary')
  summary(
    @CurrentUser() user: AuthUser,
    @Query() query: SummaryQueryDto,
  ): Promise<TransactionSummaryView> {
    return this.queryBus.execute(new GetTransactionsSummaryQuery(user.id, query.month, query.year));
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<TransactionView> {
    return this.queryBus.execute(new GetTransactionQuery(user.id, id));
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ): Promise<TransactionView> {
    const changes = {
      amount: dto.amount,
      type: dto.type,
      description: dto.description,
      date: dto.date,
      categoryId: dto.categoryId,
    };
    if (Object.values(changes).every((value) => value === undefined)) {
      throw new BadRequestException('At least one field must be provided');
    }
    return this.commandBus.execute(new UpdateTransactionCommand(user.id, id, changes));
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteTransactionCommand(user.id, id));
  }
}
