import 'server-only';

import { redirect } from 'next/navigation';
import { getSession, type AdminSession } from './session';

/**
 * Проверка доступа выполняется и в layout админки, и в каждом server action.
 * Layout защищает отрисовку, action — запись: полагаться только на layout
 * нельзя, экшены вызываются напрямую по своему эндпоинту.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return session;
}

export async function requireAdminForAction(): Promise<AdminSession> {
  const session = await getSession();
  if (!session) throw new Error('Требуется вход в систему');
  return session;
}
