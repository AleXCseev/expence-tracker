import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SafeUser, ValidateCredentialsQuery } from '../contract';
import { UsersService } from '../users.service';

@QueryHandler(ValidateCredentialsQuery)
export class ValidateCredentialsHandler implements IQueryHandler<ValidateCredentialsQuery> {
  constructor(private readonly users: UsersService) {}

  execute({ email, password }: ValidateCredentialsQuery): Promise<SafeUser | null> {
    return this.users.validateCredentials(email, password);
  }
}
