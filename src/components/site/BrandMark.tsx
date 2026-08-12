import { cn } from '@/lib/utils';

/**
 * Логотип.
 *
 * Пока в настройках не загружен файл, рисуем текстовый знак в фирменной
 * типографике с красным акцентом — это честнее, чем воспроизводить
 * оригинальный логотип по памяти.
 */
export function BrandMark({
  brandName,
  brandNote,
  logoUrl,
  tone = 'dark',
  className,
}: {
  brandName: string;
  brandNote?: string;
  logoUrl?: string | null;
  tone?: 'dark' | 'light';
  className?: string;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt={brandName}
        className={cn('h-8 w-auto object-contain lg:h-9', className)}
      />
    );
  }

  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <svg viewBox="0 0 28 28" className="size-7 shrink-0" aria-hidden="true" fill="none">
        <path
          d="M14 2.5a11.5 11.5 0 1 0 11.2 14"
          stroke="var(--color-brand)"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="3.4" fill="var(--color-brand)" />
      </svg>

      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'text-[1.0625rem] font-extrabold uppercase tracking-[-0.02em]',
            tone === 'dark' ? 'text-ink' : 'text-white',
          )}
        >
          {brandName}
        </span>
        {brandNote && (
          <span
            className={cn(
              'eyebrow mt-1 text-[0.5625rem]',
              tone === 'dark' ? 'text-steel-2' : 'text-white/55',
            )}
          >
            {brandNote}
          </span>
        )}
      </span>
    </span>
  );
}
