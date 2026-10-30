import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import type { StringValue } from 'ms';
import { AuthController } from './auth.controller';
import { LoginHandler } from './commands/login.handler';
import { RegisterHandler } from './commands/register.handler';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GetCurrentUserHandler } from './queries/get-current-user.handler';
import { TokenService } from './token.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: (config.get<string>('JWT_EXPIRES_IN') ?? '1h') as StringValue,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [TokenService, JwtAuthGuard, RegisterHandler, LoginHandler, GetCurrentUserHandler],
  exports: [JwtAuthGuard, JwtModule],
})
export class AuthModule {}
