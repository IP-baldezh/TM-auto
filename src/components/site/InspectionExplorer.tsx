'use client';

import { useRef, useState } from 'react';
import { Check } from 'lucide-react';

import type { InspectionView } from '@/lib/content';
import { SmartImage } from '@/components/ui/SmartImage';
import { cn } from '@/lib/utils';

/**
 * Категории проверки как вертикальные вкладки.
 *
 * Выбран паттерн tabs, а не аккордеон: переключение меняет не только текст,
 * но и изображение слева — это смена панели, а не раскрытие блока.
 * Реализовано с roving tabindex, как требует WAI-ARIA.
 */
export function InspectionExplorer({ categories }: { categories: InspectionView[] }) {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  if (categories.length === 0) return null;
  const current = categories[active] ?? categories[0];
  if (!current) return null;

  const focusTab = (index: number) => {
    const next = (index + categories.length) % categories.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault();
        focusTab(active + 1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault();
        focusTab(active - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTab(0);
        break;
      case 'End':
        event.preventDefault();
        focusTab(categories.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      {/* ── Изображение ───────────────────────────────────────────────── */}
      <div className="lg:col-span-5" data-reveal="mask">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper-3 sm:aspect-[16/11] lg:sticky lg:top-24 lg:aspect-[4/5]">
          {categories.map((category, index) => (
            <div
              key={category.id}
              aria-hidden={index !== active}
              className={cn(
                'absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out-quart)]',
                index === active ? 'opacity-100' : 'opacity-0',
              )}
            >
              <SmartImage
                src={category.imageUrl ?? ''}
                alt={category.imageAlt ?? category.title}
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                className="object-cover"
              />
            </div>
          ))}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-5 pt-16">
            <p className="text-xl text-white">{current.title}</p>
          </div>
        </div>
      </div>

      {/* ── Категории ─────────────────────────────────────────────────── */}
      <div className="lg:col-span-7">
        <div
          role="tablist"
          aria-orientation="vertical"
          aria-label="Этапы инспекции"
          onKeyDown={onKeyDown}
          className="border-t border-line"
        >
          {categories.map((category, index) => {
            const selected = index === active;
            return (
              <div key={category.id} className="border-b border-line">
                <button
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`inspection-tab-${category.code}`}
                  aria-selected={selected}
                  aria-controls={`inspection-panel-${category.code}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  className="group flex w-full items-center gap-4 py-5 text-left transition-colors"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-1.5 w-1.5 shrink-0 rounded-full transition-colors',
                      selected ? 'bg-brand' : 'bg-line-strong group-hover:bg-steel-2',
                    )}
                  />

                  <span
                    className={cn(
                      'flex-1 font-[family-name:var(--font-display)] text-xl leading-snug tracking-[-0.02em] transition-colors sm:text-2xl',
                      selected ? 'text-ink' : 'text-steel group-hover:text-ink',
                    )}
                  >
                    {category.title}
                  </span>

                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-px shrink-0 transition-all duration-500',
                      selected ? 'w-10 bg-brand' : 'w-4 bg-line-strong group-hover:w-7',
                    )}
                  />
                </button>

                <div
                  role="tabpanel"
                  id={`inspection-panel-${category.code}`}
                  aria-labelledby={`inspection-tab-${category.code}`}
                  hidden={!selected}
                  className="pb-7"
                >
                  <p className="max-w-[64ch] text-[0.9375rem] leading-relaxed text-steel">
                    {category.summary}
                  </p>

                  {category.points.length > 0 && (
                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {category.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-[0.875rem]">
                          <Check
                            className="mt-0.5 size-4 shrink-0 text-brand"
                            strokeWidth={2.5}
                            aria-hidden="true"
                          />
                          <span className="leading-snug">{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
