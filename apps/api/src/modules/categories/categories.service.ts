import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category, Prisma } from '@prisma/client';
import { CategoryView } from './contract';
import { CategoriesRepository } from './categories.repository';

const toView = (category: Category): CategoryView => ({
  id: category.id,
  name: category.name,
  color: category.color,
  icon: category.icon,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

const isPrismaError = (error: unknown, code: string): boolean =>
  error instanceof Prisma.PrismaClientKnownRequestError && error.code === code;

@Injectable()
export class CategoriesService {
  constructor(private readonly repository: CategoriesRepository) {}

  async create(
    userId: string,
    input: { name: string; color?: string; icon?: string },
  ): Promise<CategoryView> {
    try {
      return toView(await this.repository.create({ userId, ...input }));
    } catch (error) {
      if (isPrismaError(error, 'P2002')) {
        throw new ConflictException('Category already exists');
      }
      throw error;
    }
  }

  async findAll(userId: string): Promise<CategoryView[]> {
    return (await this.repository.findAllByUser(userId)).map(toView);
  }

  async update(
    userId: string,
    id: string,
    changes: { name?: string; color?: string; icon?: string },
  ): Promise<CategoryView> {
    await this.getOwned(userId, id);
    try {
      return toView(await this.repository.update(id, changes));
    } catch (error) {
      if (isPrismaError(error, 'P2002')) {
        throw new ConflictException('Category already exists');
      }
      throw error;
    }
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.getOwned(userId, id);
    try {
      await this.repository.delete(id);
    } catch (error) {
      if (isPrismaError(error, 'P2003')) {
        throw new ConflictException('Category has expenses');
      }
      throw error;
    }
  }

  private async getOwned(userId: string, id: string): Promise<Category> {
    const category = await this.repository.findByIdForUser(id, userId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }
}
