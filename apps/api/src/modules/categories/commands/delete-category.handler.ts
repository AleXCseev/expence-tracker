import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CategoriesService } from '../categories.service';
import { DeleteCategoryCommand } from '../contract';

@CommandHandler(DeleteCategoryCommand)
export class DeleteCategoryHandler implements ICommandHandler<DeleteCategoryCommand> {
  constructor(private readonly categories: CategoriesService) {}

  execute({ userId, id }: DeleteCategoryCommand): Promise<void> {
    return this.categories.remove(userId, id);
  }
}
