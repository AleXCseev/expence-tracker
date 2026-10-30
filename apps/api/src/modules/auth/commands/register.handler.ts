import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthResult } from '../auth-response';
import { TokenService } from '../token.service';
import { CreateUserCommand, SafeUser } from '../../users/contract';
import { RegisterCommand } from './register.command';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly tokens: TokenService,
  ) {}

  async execute({ name, email, password }: RegisterCommand): Promise<AuthResult> {
    const user: SafeUser = await this.commandBus.execute(
      new CreateUserCommand(name, email, password),
    );
    return { accessToken: await this.tokens.sign(user), user };
  }
}
