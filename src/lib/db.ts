import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * База может быть недоступна (сборка в CI, локальный запуск без Postgres,
 * временная потеря соединения). Сайт в этом случае не должен падать —
 * он отдаёт значения по умолчанию из src/content/defaults.ts.
 */
export async function safeQuery<T>(run: () => Promise<T>, fallback: T, label: string): Promise<T> {
  try {
    return await run();
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[db] «${label}»: не удалось прочитать данные, использованы значения по умолчанию.`,
        error instanceof Error ? error.message : error,
      );
    }
    return fallback;
  }
}
