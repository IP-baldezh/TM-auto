import 'server-only';

import { createHash, createHmac, randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

import { prisma } from '@/lib/db';

export const SESSION_COOKIE = 'sunservice_admin';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 дней
const REFRESH_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000;
const BCRYPT_ROUNDS = 12;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * В базе лежит не сам токен, а его отпечаток. AUTH_SECRET используется как
 * ключ HMAC — тогда утечки дампа базы недостаточно, чтобы выпустить
 * действующую сессию.
 */
function fingerprint(token: string): string {
  const secret = process.env.AUTH_SECRET;
  return secret
    ? createHmac('sha256', secret).update(token).digest('hex')
    : createHash('sha256').update(token).digest('hex');
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: { tokenHash: fingerprint(token), userId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export type AdminSession = { userId: string; email: string; name: string };

export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const session = await prisma.session.findUnique({
      where: { tokenHash: fingerprint(token) },
      include: { user: true },
    });

    if (!session) return null;

    if (session.expiresAt.getTime() < Date.now()) {
      await prisma.session.delete({ where: { tokenHash: session.tokenHash } }).catch(() => {});
      return null;
    }

    // Продлеваем «скользящую» сессию, чтобы активный редактор не выпадал.
    if (session.expiresAt.getTime() - Date.now() < REFRESH_THRESHOLD_MS) {
      await prisma.session
        .update({
          where: { tokenHash: session.tokenHash },
          data: { expiresAt: new Date(Date.now() + SESSION_TTL_MS) },
        })
        .catch(() => {});
    }

    return {
      userId: session.user.id,
      email: session.user.email,
      name: session.user.name,
    };
  } catch {
    // База недоступна — считаем, что доступа нет.
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;

  if (token) {
    await prisma.session.deleteMany({ where: { tokenHash: fingerprint(token) } }).catch(() => {});
  }
  store.delete(SESSION_COOKIE);
}
