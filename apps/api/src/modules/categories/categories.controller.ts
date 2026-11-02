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
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthUser, CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  CategoryView,
  CreateCategoryCommand,
  DeleteCategoryCommand,
  GetUserCategoriesQuery,
  UpdateCategoryCommand,
} from './contract';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCategoryDto): Promise<CategoryView> {
    return this.commandBus.execute(
      new CreateCategoryCommand(user.id, dto.name, dto.color, dto.icon),
    );
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser): Promise<CategoryView[]> {
    return this.queryBus.execute(new GetUserCategoriesQuery(user.id));
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryView> {
    const changes = { name: dto.name, color: dto.color, icon: dto.icon };
    if (Object.values(changes).every((value) => value === undefined)) {
      throw new BadRequestException('At least one field must be provided');
    }
    return this.commandBus.execute(new UpdateCategoryCommand(user.id, id, changes));
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@CurrentUser() user: AuthUser, @Param('id') id: string): Promise<void> {
    await this.commandBus.execute(new DeleteCategoryCommand(user.id, id));
  }
}
