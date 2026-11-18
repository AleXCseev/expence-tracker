const REQUIRED = ['DATABASE_URL', 'JWT_SECRET'] as const;

/** Проверяет переменные окружения при старте: приложение падает сразу, а не при первом запросе. */
export function validateEnv(config: Record<string, unknown>): Record<string, unknown> {
  const problems: string[] = [];

  for (const key of REQUIRED) {
    const value = config[key];
    if (typeof value !== 'string' || value.trim() === '') problems.push(`${key} is required`);
  }

  const port = config.API_PORT;
  if (port !== undefined && !(Number.isInteger(Number(port)) && Number(port) > 0)) {
    problems.push('API_PORT must be a positive integer');
  }

  if (problems.length > 0) {
    throw new Error(`Invalid environment configuration:\n- ${problems.join('\n- ')}`);
  }
  return config;
}
