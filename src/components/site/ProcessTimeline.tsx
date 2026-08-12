'use client';

import { useEffect, useRef, useState } from 'react';

import type { ProcessView } from '@/lib/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

/**
 * Desktop — «липкая» левая колонка с крупным номером и фотографией
 * текущего этапа; правая колонка прокручивается.
 * Mobile — обычная вертикальная лента.
 *
 * Активный этап определяет IntersectionObserver, а не расчёт по scrollY:
 * так поведение не зависит от высоты блоков и от плавной прокрутки.
 */
export function ProcessTimeline({ steps }: { steps: ProcessView[] }) {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter((n): n is HTMLLIElement => n !== null);
    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        const index = nodes.indexOf(visible.target as HTMLLIElement);
        if (index >= 0) setActive(index);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [steps.length]);

  if (steps.length === 0) return null;
  const current = steps[active] ?? steps[0];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* ── Липкая колонка (только desktop) ───────────────────────────── */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] bg-paper-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                aria-hidden="true"
                className={cn(
                  'absolute inset-0 transition-opacity duration-700',
                  index === active ? 'opacity-100' : 'opacity-0',
                )}
              >
                <SmartImage
                  src={step.imageUrl ?? ''}
                  alt=""
                  fill
                  sizes="38vw"
                  className="object-cover"
                />
              </div>
            ))}
            <div className="absolute inset-0 bg-ink/25" />
          </div>

          <div className="mt-7">
            <p className="text-2xl leading-snug">{current?.title}</p>
          </div>

          <div className="mt-5 h-[3px] w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-brand transition-[width] duration-500 ease-out"
              style={{ width: `${((active + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Лента этапов ──────────────────────────────────────────────── */}
      <ol className="lg:col-span-7">
        {steps.map((step, index) => {
          const isActive = index === active;
          return (
            <li
              key={step.id}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              data-reveal="up"
              className={cn(
                'relative border-l-2 py-7 pl-6 transition-colors duration-500 sm:pl-8 lg:py-12',
                isActive ? 'border-brand' : 'border-line',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute -left-[7px] top-9 size-3 rounded-full border-2 transition-colors duration-500 lg:top-14',
                  isActive ? 'border-brand bg-brand' : 'border-line-strong bg-paper',
                )}
              />

              <h3 className="text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.1]">{step.title}</h3>

              <p className="mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-steel">
                {step.text}
              </p>

              {step.detail && (
                <p className="mt-3 max-w-[54ch] text-[0.875rem] leading-relaxed text-steel-2">
                  {step.detail}
                </p>
              )}

              {/* На мобильном фотография показывается прямо в ленте */}
              {step.imageUrl && (
                <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[4px] bg-paper-3 lg:hidden">
                  <SmartImage
                    src={step.imageUrl}
                    alt=""
                    fill
                    // На десктопе этот блок скрыт (его показывает липкая
                    // колонка), поэтому браузеру не нужно тянуть большой файл.
                    sizes="(min-width: 1024px) 1px, 100vw"
                    className="object-cover"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
