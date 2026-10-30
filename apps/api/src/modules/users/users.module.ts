import { Module } from '@nestjs/common';
import { CreateUserHandler } from './commands/create-user.handler';
import { RecordLoginHandler } from './commands/record-login.handler';
import { GetUserByIdHandler } from './queries/get-user-by-id.handler';
import { ValidateCredentialsHandler } from './queries/validate-credentials.handler';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  providers: [
    UsersRepository,
    UsersService,
    CreateUserHandler,
    RecordLoginHandler,
    GetUserByIdHandler,
    ValidateCredentialsHandler,
  ],
})
export class UsersModule {}
