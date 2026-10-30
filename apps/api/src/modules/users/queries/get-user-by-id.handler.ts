import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery, SafeUser } from '../contract';
import { UsersService } from '../users.service';

@QueryHandler(GetUserByIdQuery)
export class GetUserByIdHandler implements IQueryHandler<GetUserByIdQuery> {
  constructor(private readonly users: UsersService) {}

  execute({ id }: GetUserByIdQuery): Promise<SafeUser | null> {
    return this.users.findById(id);
  }
}
