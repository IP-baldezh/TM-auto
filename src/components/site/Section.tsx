import * as React from 'react';
import { cn } from '@/lib/utils';

export function Container({
  className,
  children,
  as: Tag = 'div',
}: {
  className?: string;
  children: React.ReactNode;
  as?: 'div' | 'header' | 'footer' | 'section';
}) {
  return <Tag className={cn('container-page', className)}>{children}</Tag>;
}

export function Section({
  id,
  className,
  children,
  tone = 'paper',
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  tone?: 'paper' | 'paper-2' | 'ink';
}) {
  const tones = {
    paper: 'bg-paper text-ink',
    'paper-2': 'bg-paper-2 text-ink',
    ink: 'bg-ink text-paper',
  } as const;

  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-20 py-20 md:py-28 lg:py-32',
        tones[tone],
        // clip, а не hidden: не ломает position: sticky у дочерних элементов
        'overflow-x-clip',
        className,
      )}
    >
      {children}
    </section>
  );
}

/**
 * Заголовок секции: волосяная линия, крупный заголовок слева, подзаголовок
 * справа. Без надзаголовков и порядковых номеров — заголовок работает сам.
 */
export function SectionHeading({
  title,
  subtitle,
  tone = 'light',
  align = 'split',
  className,
  action,
}: {
  title?: string | null;
  subtitle?: string | null;
  tone?: 'light' | 'dark';
  align?: 'split' | 'stack';
  className?: string;
  action?: React.ReactNode;
}) {
  if (!title && !subtitle) return null;

  const line = tone === 'dark' ? 'bg-line-dark' : 'bg-line';
  const muted = tone === 'dark' ? 'text-steel-3' : 'text-steel';

  return (
    <div className={cn('mb-12 md:mb-16', className)}>
      <div className={cn('h-px w-full', line)} data-reveal="mask" />

      <div
        className={cn(
          'pt-7 md:pt-10',
          align === 'split' && 'gap-x-10 gap-y-7 lg:grid lg:grid-cols-12 lg:items-end',
        )}
      >
        <div className={cn(align === 'split' && 'lg:col-span-7')}>
          {title && (
            <h2
              className="display text-[clamp(1.85rem,4.6vw,3.9rem)] leading-[1.04]"
              data-reveal="up"
            >
              {title}
            </h2>
          )}
        </div>

        {(subtitle || action) && (
          <div
            className={cn(
              align === 'split' ? 'lg:col-span-5 lg:pb-2.5' : 'mt-7',
              'flex flex-col items-start gap-5',
            )}
          >
            {subtitle && (
              <p
                className={cn('max-w-[46ch] text-[0.9375rem] leading-relaxed md:text-base', muted)}
                data-reveal="up"
              >
                {subtitle}
              </p>
            )}
            {action}
          </div>
        )}
      </div>
    </div>
  );
}
