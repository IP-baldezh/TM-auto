/**
 * Создание или смена пароля администратора.
 *
 *   npm run admin:create -- admin@example.com "надёжный-пароль" "Имя"
 *
 * Без аргументов берутся ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME из .env.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const [emailArg, passwordArg, nameArg] = process.argv.slice(2);

  const email = (emailArg ?? process.env.ADMIN_EMAIL ?? '').trim().toLowerCase();
  const password = passwordArg ?? process.env.ADMIN_PASSWORD ?? '';
  const name = nameArg ?? process.env.ADMIN_NAME ?? 'Администратор';

  if (!email || !password) {
    console.error('Укажите e-mail и пароль:');
    console.error('  npm run admin:create -- admin@example.com "пароль"');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Пароль должен быть не короче 8 символов.');
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.adminUser.findUnique({ where: { email } });

  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, name },
    update: { passwordHash, name },
  });

  // Смена пароля должна разлогинивать старые сессии.
  if (existing) {
    await prisma.session.deleteMany({ where: { userId: existing.id } });
    console.log(`Пароль обновлён: ${email}. Активные сессии завершены.`);
  } else {
    console.log(`Администратор создан: ${email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
