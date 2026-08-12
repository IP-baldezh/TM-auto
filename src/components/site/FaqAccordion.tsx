'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

import type { FaqView } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * Ответы всегда присутствуют в DOM (скрыты высотой, а не удалением) —
 * иначе разметка FAQPage расходилась бы с тем, что видит поисковый робот.
 */
export function FaqAccordion({ items }: { items: FaqView[] }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  if (items.length === 0) return null;

  return (
    <div className="border-t border-line">
      {items.map((item) => {
        const isOpen = open === item.id;
        return (
          <div key={item.id} className="border-b border-line" data-reveal="up">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${item.id}`}
                id={`faq-button-${item.id}`}
                onClick={() => setOpen(isOpen ? null : item.id)}
                className="group flex w-full items-start gap-4 py-7 text-left"
              >
                <span
                  className={cn(
                    'flex-1 font-[family-name:var(--font-display)] text-xl leading-snug tracking-[-0.02em] transition-colors sm:text-2xl',
                    isOpen ? 'text-ink' : 'text-ink group-hover:text-brand',
                  )}
                >
                  {item.question}
                </span>

                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1 flex size-6 shrink-0 items-center justify-center transition-transform duration-400 ease-[var(--ease-out-quart)]',
                    isOpen && 'rotate-45',
                  )}
                >
                  <Plus className={cn('size-5', isOpen ? 'text-brand' : 'text-steel')} />
                </span>
              </button>
            </h3>

            <div
              id={`faq-panel-${item.id}`}
              role="region"
              aria-labelledby={`faq-button-${item.id}`}
              className={cn(
                'grid transition-[grid-template-rows,opacity] duration-400 ease-[var(--ease-out-quart)]',
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-[68ch] pb-7 pr-10 text-[0.9375rem] leading-relaxed text-steel">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
