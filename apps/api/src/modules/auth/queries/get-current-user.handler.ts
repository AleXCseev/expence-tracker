import { UnauthorizedException } from '@nestjs/common';
import { IQueryHandler, QueryBus, QueryHandler } from '@nestjs/cqrs';
import { GetUserByIdQuery, SafeUser } from '../../users/contract';
import { GetCurrentUserQuery } from './get-current-user.query';

@QueryHandler(GetCurrentUserQuery)
export class GetCurrentUserHandler implements IQueryHandler<GetCurrentUserQuery> {
  constructor(private readonly queryBus: QueryBus) {}

  async execute({ userId }: GetCurrentUserQuery): Promise<SafeUser> {
    const user: SafeUser | null = await this.queryBus.execute(new GetUserByIdQuery(userId));
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
