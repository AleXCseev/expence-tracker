import { Injectable } from '@nestjs/common';
import { Prisma, Transaction, TransactionType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface TransactionTotals {
  categoryId: string;
  type: TransactionType;
  total: Prisma.Decimal;
}

@Injectable()
export class TransactionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPageByUser(
    userId: string,
    filters: { dateFrom?: Date; dateTo?: Date; type?: TransactionType; categoryId?: string },
    page: number,
    limit: number,
  ): Promise<{ items: Transaction[]; total: number }> {
    const { dateFrom, dateTo, type, categoryId } = filters;
    const where: Prisma.TransactionWhereInput = {
      userId,
      type,
      categoryId,
      ...(dateFrom || dateTo ? { date: { gte: dateFrom, lte: dateTo } } : {}),
    };
    const [items, total] = await this.prisma.$transaction([
      this.prisma.transaction.findMany({
        where,
        orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.transaction.count({ where }),
    ]);
    return { items, total };
  }

  findByIdForUser(id: string, userId: string): Promise<Transaction | null> {
    return this.prisma.transaction.findFirst({ where: { id, userId } });
  }

  create(data: {
    userId: string;
    amount: number;
    type: TransactionType;
    description?: string;
    date: Date;
    categoryId: string;
  }): Promise<Transaction> {
    return this.prisma.transaction.create({ data });
  }

  update(
    id: string,
    data: {
      amount?: number;
      type?: TransactionType;
      description?: string;
      date?: Date;
      categoryId?: string;
    },
  ): Promise<Transaction> {
    return this.prisma.transaction.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.transaction.delete({ where: { id } });
  }

  async totalsByCategory(userId: string, from: Date, to: Date): Promise<TransactionTotals[]> {
    const rows = await this.prisma.transaction.groupBy({
      by: ['categoryId', 'type'],
      where: { userId, date: { gte: from, lt: to } },
      _sum: { amount: true },
    });
    return rows.map((row) => ({
      categoryId: row.categoryId,
      type: row.type,
      total: row._sum.amount ?? new Prisma.Decimal(0),
    }));
  }
}
