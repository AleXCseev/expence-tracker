import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { CategoriesService } from './categories.service';
import { CreateCategoryHandler } from './commands/create-category.handler';
import { DeleteCategoryHandler } from './commands/delete-category.handler';
import { UpdateCategoryHandler } from './commands/update-category.handler';
import { GetUserCategoriesHandler } from './queries/get-user-categories.handler';

@Module({
  imports: [AuthModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesRepository,
    CategoriesService,
    CreateCategoryHandler,
    UpdateCategoryHandler,
    DeleteCategoryHandler,
    GetUserCategoriesHandler,
  ],
})
export class CategoriesModule {}
