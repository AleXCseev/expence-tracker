import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const MIN_SECRET_LENGTH = 32;
const PLACEHOLDER_SECRETS = ['change-me'];

/**
 * Возвращает JWT_SECRET и проверяет его надёжность: в production слабый секрет
 * (короче 32 символов или шаблон из .env.example) останавливает запуск,
 * в остальных окружениях только пишет предупреждение.
 */
export function resolveJwtSecret(config: ConfigService): string {
  const secret = config.getOrThrow<string>('JWT_SECRET');
  const isWeak = secret.length < MIN_SECRET_LENGTH || PLACEHOLDER_SECRETS.includes(secret);

  if (isWeak) {
    const message = `JWT_SECRET is weak: use a random value of at least ${MIN_SECRET_LENGTH} characters (e.g. \`openssl rand -base64 48\`)`;
    if (config.get<string>('NODE_ENV') === 'production') {
      throw new Error(message);
    }
    new Logger('Auth').warn(message);
  }
  return secret;
}
