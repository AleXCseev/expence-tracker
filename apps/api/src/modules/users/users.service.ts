import { ConflictException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { compare, hash, hashSync } from 'bcryptjs';
import { SafeUser } from './contract';
import { UsersRepository } from './users.repository';

const BCRYPT_COST = 10;

// Хеш для сравнения, когда пользователя нет: время ответа не должно выдавать,
// зарегистрирован ли email.
const DUMMY_HASH = hashSync('timing-attack-protection', BCRYPT_COST);

const toSafeUser = (user: User): SafeUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async create(input: { name: string; email: string; password: string }): Promise<SafeUser> {
    const email = input.email.trim().toLowerCase();
    if (await this.repository.findByEmail(email)) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await hash(input.password, BCRYPT_COST);
    const user = await this.repository.create({
      name: input.name.trim(),
      email,
      passwordHash,
    });
    return toSafeUser(user);
  }

  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.repository.findById(id);
    return user ? toSafeUser(user) : null;
  }

  async validateCredentials(email: string, password: string): Promise<SafeUser | null> {
    const user = await this.repository.findByEmail(email.trim().toLowerCase());
    const passwordMatches = await compare(password, user?.passwordHash ?? DUMMY_HASH);
    return user && passwordMatches ? toSafeUser(user) : null;
  }

  touchLogin(id: string): Promise<void> {
    return this.repository.updateLastLogin(id);
  }
}
