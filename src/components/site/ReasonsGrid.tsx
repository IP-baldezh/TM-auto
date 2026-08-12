import type { ReasonView } from '@/lib/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

/**
 * Асимметричная сетка: крупные блоки с фотографией занимают шесть колонок,
 * текстовые — три. Одинаковых плиток нет намеренно.
 */
export function ReasonsGrid({ reasons }: { reasons: ReasonView[] }) {
  if (reasons.length === 0) return null;

  const span = {
    LARGE: 'lg:col-span-7',
    MEDIUM: 'lg:col-span-5',
    SMALL: 'lg:col-span-4',
  } as const;

  return (
    <div className="grid gap-px bg-line-dark sm:grid-cols-2 lg:grid-cols-12">
      {reasons.map((reason) => {
        const hasImage = Boolean(reason.imageUrl);
        return (
          <article
            key={reason.id}
            data-reveal="up"
            className={cn(
              'group relative flex min-h-[15rem] flex-col justify-end overflow-hidden bg-ink p-6 sm:p-8 lg:min-h-[19rem]',
              span[reason.size],
              reason.size === 'LARGE' && 'sm:col-span-2',
            )}
          >
            {hasImage && (
              <>
                <SmartImage
                  src={reason.imageUrl ?? ''}
                  alt={reason.imageAlt ?? ''}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                  className="object-cover opacity-45 transition-transform duration-[1100ms] ease-[var(--ease-out-expo)] group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25"
                />
              </>
            )}

            <div className="relative">
              <span
                aria-hidden="true"
                className="mb-4 block h-px w-9 bg-brand transition-all duration-500 group-hover:w-16"
              />
              <h3
                className={cn(
                  'font-bold tracking-[-0.025em] text-paper',
                  reason.size === 'LARGE' ? 'text-2xl sm:text-[1.875rem]' : 'text-xl',
                )}
              >
                {reason.title}
              </h3>
              <p className="mt-3 max-w-[46ch] text-[0.875rem] leading-relaxed text-steel-3">
                {reason.text}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
