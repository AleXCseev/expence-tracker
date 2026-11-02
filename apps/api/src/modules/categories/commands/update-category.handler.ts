import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoriesService } from '../categories.service';
import { CategoryView, UpdateCategoryCommand } from '../contract';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler implements ICommandHandler<UpdateCategoryCommand> {
  constructor(private readonly categories: CategoriesService) {}

  execute({ userId, id, changes }: UpdateCategoryCommand): Promise<CategoryView> {
    return this.categories.update(userId, id, changes);
  }
}
