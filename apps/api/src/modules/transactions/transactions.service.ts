import { Injectable, NotFoundException } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Prisma, Transaction } from '@prisma/client';
import { CategoryView, GetUserCategoriesQuery } from '../categories/contract';
import {
  TransactionFilters,
  TransactionSummaryView,
  TransactionType,
  TransactionView,
} from './contract';
import { TransactionsRepository } from './transactions.repository';

const toView = (transaction: Transaction): TransactionView => ({
  id: transaction.id,
  amount: transaction.amount.toFixed(2),
  type: transaction.type,
  description: transaction.description,
  date: transaction.date,
  categoryId: transaction.categoryId,
  createdAt: transaction.createdAt,
  updatedAt: transaction.updatedAt,
});

@Injectable()
export class TransactionsService {
  constructor(
    private readonly repository: TransactionsRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async create(
    userId: string,
    input: {
      amount: number;
      type: TransactionType;
      description?: string;
      date: Date;
      categoryId: string;
    },
  ): Promise<TransactionView> {
    await this.assertCategoryOwned(userId, input.categoryId);
    return toView(await this.repository.create({ userId, ...input }));
  }

  async findAll(userId: string, filters: TransactionFilters): Promise<TransactionView[]> {
    return (await this.repository.findManyByUser(userId, filters)).map(toView);
  }

  async findOne(userId: string, id: string): Promise<TransactionView> {
    return toView(await this.getOwned(userId, id));
  }

  async update(
    userId: string,
    id: string,
    changes: {
      amount?: number;
      type?: TransactionType;
      description?: string;
      date?: Date;
      categoryId?: string;
    },
  ): Promise<TransactionView> {
    await this.getOwned(userId, id);
    if (changes.categoryId !== undefined) {
      await this.assertCategoryOwned(userId, changes.categoryId);
    }
    return toView(await this.repository.update(id, changes));
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.getOwned(userId, id);
    await this.repository.delete(id);
  }

  async summary(userId: string, month: number, year: number): Promise<TransactionSummaryView> {
    const from = new Date(Date.UTC(year, month - 1, 1));
    const to = new Date(Date.UTC(year, month, 1));
    const totals = await this.repository.totalsByCategory(userId, from, to);

    const sum = (type: TransactionType) =>
      totals
        .filter((row) => row.type === type)
        .reduce((acc, row) => acc.plus(row.total), new Prisma.Decimal(0));
    const income = sum('INCOME');
    const expense = sum('EXPENSE');

    return {
      month,
      year,
      income: income.toFixed(2),
      expense: expense.toFixed(2),
      balance: income.minus(expense).toFixed(2),
      byCategory: totals.map((row) => ({
        categoryId: row.categoryId,
        type: row.type,
        total: row.total.toFixed(2),
      })),
    };
  }

  private async getOwned(userId: string, id: string): Promise<Transaction> {
    const transaction = await this.repository.findByIdForUser(id, userId);
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  private async assertCategoryOwned(userId: string, categoryId: string): Promise<void> {
    const categories: CategoryView[] = await this.queryBus.execute(
      new GetUserCategoriesQuery(userId),
    );
    if (!categories.some((category) => category.id === categoryId)) {
      throw new NotFoundException('Category not found');
    }
  }
}
