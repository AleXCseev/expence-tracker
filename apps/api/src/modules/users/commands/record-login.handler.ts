import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RecordLoginCommand } from '../contract';
import { UsersService } from '../users.service';

@CommandHandler(RecordLoginCommand)
export class RecordLoginHandler implements ICommandHandler<RecordLoginCommand> {
  constructor(private readonly users: UsersService) {}

  execute({ userId }: RecordLoginCommand): Promise<void> {
    return this.users.touchLogin(userId);
  }
}
