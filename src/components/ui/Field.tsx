'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const controlBase =
  'w-full rounded-[3px] border bg-white px-4 text-[0.9375rem] text-ink outline-none ' +
  'transition-colors duration-150 placeholder:text-steel-2 ' +
  'focus:border-ink focus-visible:outline-none disabled:opacity-60';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        'h-12',
        invalid ? 'border-brand' : 'border-line-strong',
        className,
      )}
      {...props}
    />
  );
});

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        controlBase,
        'min-h-28 resize-y py-3 leading-relaxed',
        invalid ? 'border-brand' : 'border-line-strong',
        className,
      )}
      {...props}
    />
  );
});

export function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-[0.8125rem] font-medium text-steel">
      {children}
      {required && <span className="text-brand"> *</span>}
    </label>
  );
}

export function FieldError({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-[0.8125rem] text-brand">
      {children}
    </p>
  );
}

/** Чекбокс согласия: нативный input + собственная отрисовка индикатора. */
export function Checkbox({
  className,
  children,
  invalid,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; children: React.ReactNode }) {
  return (
    <label
      htmlFor={id}
      className={cn('group flex cursor-pointer items-start gap-3 text-[0.8125rem]', className)}
    >
      <span className="relative mt-px flex size-5 shrink-0 items-center justify-center">
        <input
          id={id}
          type="checkbox"
          aria-invalid={invalid || undefined}
          className="peer size-5 cursor-pointer appearance-none rounded-[3px] border border-line-strong bg-white transition-colors checked:border-brand checked:bg-brand aria-[invalid]:border-brand"
          {...props}
        />
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          className="pointer-events-none absolute size-3 text-white opacity-0 transition-opacity peer-checked:opacity-100"
        >
          <path
            d="M2 8.5l4 4L14 4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="leading-snug text-steel">{children}</span>
    </label>
  );
}
