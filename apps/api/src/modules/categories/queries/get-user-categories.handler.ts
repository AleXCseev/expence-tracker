import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CategoriesService } from '../categories.service';
import { CategoryView, GetUserCategoriesQuery } from '../contract';

@QueryHandler(GetUserCategoriesQuery)
export class GetUserCategoriesHandler implements IQueryHandler<GetUserCategoriesQuery> {
  constructor(private readonly categories: CategoriesService) {}

  execute({ userId }: GetUserCategoriesQuery): Promise<CategoryView[]> {
    return this.categories.findAll(userId);
  }
}
