import { redirect } from 'next/navigation';

import { getSession } from '@/lib/auth/session';
import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect('/admin');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f6f4] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-lg font-extrabold uppercase tracking-[-0.02em]">Sunservice</p>
          <p className="mt-1 text-[0.75rem] uppercase tracking-[0.14em] text-black/40">
            Админ-панель
          </p>
        </div>

        <div className="rounded-[4px] border border-black/8 bg-white p-6">
          <LoginForm />
        </div>

        <p className="mt-5 text-center text-[0.75rem] leading-relaxed text-black/40">
          Первый администратор создаётся командой{' '}
          <code className="rounded-[2px] bg-black/6 px-1 py-0.5">npm run admin:create</code>
        </p>
      </div>
    </div>
  );
}
