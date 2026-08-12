'use client';

import { useId } from 'react';
import Link from 'next/link';

import { Checkbox, FieldError, FieldLabel, Input, Textarea } from '@/components/ui/Field';
import type { useLeadForm } from './useLeadForm';

export type LeadFormApi = ReturnType<typeof useLeadForm>;

export function LeadFields({
  form,
  withMessage = false,
  messageLabel = 'Комментарий',
  messagePlaceholder,
  privacyUrl,
  consentUrl,
  tone = 'light',
}: {
  form: LeadFormApi;
  withMessage?: boolean;
  messageLabel?: string;
  messagePlaceholder?: string;
  privacyUrl: string;
  consentUrl: string;
  tone?: 'light' | 'dark';
}) {
  const uid = useId();
  const { values, setValue, fieldErrors } = form;

  const nameId = `${uid}-name`;
  const phoneId = `${uid}-phone`;
  const messageId = `${uid}-message`;
  const consentId = `${uid}-consent`;

  const linkClass =
    tone === 'dark'
      ? 'underline underline-offset-2 hover:text-white'
      : 'underline underline-offset-2 hover:text-ink';

  return (
    <>
      {/* Приманка для ботов: скрыта от людей, но не через display:none —
          часть ботов такие поля игнорирует. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
        <label htmlFor={`${uid}-company`}>Компания</label>
        <input
          id={`${uid}-company`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => setValue('company', e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor={nameId} required>
            Имя
          </FieldLabel>
          <Input
            id={nameId}
            name="name"
            autoComplete="name"
            placeholder="Как к вам обращаться"
            value={values.name}
            invalid={Boolean(fieldErrors.name)}
            onChange={(e) => setValue('name', e.target.value)}
          />
          <FieldError>{fieldErrors.name}</FieldError>
        </div>

        <div>
          <FieldLabel htmlFor={phoneId} required>
            Телефон
          </FieldLabel>
          <Input
            id={phoneId}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={values.phone}
            invalid={Boolean(fieldErrors.phone)}
            onChange={(e) => setValue('phone', e.target.value)}
          />
          <FieldError>{fieldErrors.phone}</FieldError>
        </div>
      </div>

      {withMessage && (
        <div className="mt-4">
          <FieldLabel htmlFor={messageId}>{messageLabel}</FieldLabel>
          <Textarea
            id={messageId}
            name="message"
            rows={3}
            placeholder={messagePlaceholder}
            value={values.message}
            onChange={(e) => setValue('message', e.target.value)}
          />
        </div>
      )}

      <div className="mt-5">
        <Checkbox
          id={consentId}
          checked={values.consent}
          invalid={Boolean(fieldErrors.consent)}
          onChange={(e) => setValue('consent', e.target.checked)}
        >
          Согласен на{' '}
          <Link href={consentUrl} className={linkClass}>
            обработку персональных данных
          </Link>{' '}
          и принимаю{' '}
          <Link href={privacyUrl} className={linkClass}>
            политику конфиденциальности
          </Link>
        </Checkbox>
        <FieldError>{fieldErrors.consent}</FieldError>
      </div>
    </>
  );
}
