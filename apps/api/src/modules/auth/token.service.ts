import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(private readonly jwt: JwtService) {}

  sign(user: { id: string; email: string }): Promise<string> {
    return this.jwt.signAsync({ sub: user.id, email: user.email });
  }
}
