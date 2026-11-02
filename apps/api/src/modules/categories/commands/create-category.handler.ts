import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoriesService } from '../categories.service';
import { CategoryView, CreateCategoryCommand } from '../contract';

@CommandHandler(CreateCategoryCommand)
export class CreateCategoryHandler implements ICommandHandler<CreateCategoryCommand> {
  constructor(private readonly categories: CategoriesService) {}

  execute({ userId, name, color, icon }: CreateCategoryCommand): Promise<CategoryView> {
    return this.categories.create(userId, { name, color, icon });
  }
}
