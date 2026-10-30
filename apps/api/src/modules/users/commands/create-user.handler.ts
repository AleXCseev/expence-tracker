import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand, SafeUser } from '../contract';
import { UsersService } from '../users.service';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(private readonly users: UsersService) {}

  execute({ name, email, password }: CreateUserCommand): Promise<SafeUser> {
    return this.users.create({ name, email, password });
  }
}
