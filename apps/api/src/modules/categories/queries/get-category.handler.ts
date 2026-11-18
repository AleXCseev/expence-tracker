import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { CategoriesService } from '../categories.service';
import { CategoryView, GetCategoryQuery } from '../contract';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  constructor(private readonly categories: CategoriesService) {}

  execute({ userId, id }: GetCategoryQuery): Promise<CategoryView> {
    return this.categories.findOne(userId, id);
  }
}
