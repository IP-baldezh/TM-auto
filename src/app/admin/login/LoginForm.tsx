'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

import { loginAction, type LoginState } from '@/app/admin/actions';

const inputClass =
  'w-full rounded-[3px] border border-black/12 bg-white px-3 py-2.5 text-[0.875rem] outline-none transition-colors focus:border-black/45';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-brand text-[0.875rem] font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
    >
      {pending && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      Войти
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<LoginState, FormData>(loginAction, { error: null });

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-[0.8125rem] font-medium text-black/70">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block text-[0.8125rem] font-medium text-black/70"
        >
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={inputClass}
        />
      </div>

      {state.error && (
        <p role="alert" className="text-[0.8125rem] text-brand">
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
