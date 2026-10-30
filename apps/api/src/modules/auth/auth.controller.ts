import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { SafeUser } from '../users/contract';
import { AuthResult } from './auth-response';
import { LoginCommand } from './commands/login.command';
import { RegisterCommand } from './commands/register.command';
import { AuthUser, CurrentUser } from './current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetCurrentUserQuery } from './queries/get-current-user.query';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('register')
  register(@Body() dto: RegisterDto): Promise<AuthResult> {
    return this.commandBus.execute(new RegisterCommand(dto.name, dto.email, dto.password));
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto): Promise<AuthResult> {
    return this.commandBus.execute(new LoginCommand(dto.email, dto.password));
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser): Promise<SafeUser> {
    return this.queryBus.execute(new GetCurrentUserQuery(user.id));
  }
}
