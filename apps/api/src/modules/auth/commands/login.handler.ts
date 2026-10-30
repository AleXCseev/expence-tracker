import { UnauthorizedException } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { AuthResult } from '../auth-response';
import { TokenService } from '../token.service';
import { RecordLoginCommand, SafeUser, ValidateCredentialsQuery } from '../../users/contract';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly tokens: TokenService,
  ) {}

  async execute({ email, password }: LoginCommand): Promise<AuthResult> {
    const user: SafeUser | null = await this.queryBus.execute(
      new ValidateCredentialsQuery(email, password),
    );
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    await this.commandBus.execute(new RecordLoginCommand(user.id));
    return { accessToken: await this.tokens.sign(user), user };
  }
}
