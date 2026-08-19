'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import type { SectionView, TestimonialView } from '@/lib/content';
import { Container, Section } from '@/components/site/Section';
import { cn } from '@/lib/utils';

const AVATAR_COLORS = ['#c60f13', '#1760a8', '#1f7a4e', '#c47a0d', '#6b3aab'];

function avatarColor(name: string): string {
  const clean = name.replace(/^DEMO\s*[·•·]\s*/i, '');
  return AVATAR_COLORS[clean.charCodeAt(0) % AVATAR_COLORS.length] ?? AVATAR_COLORS[0]!;
}

function displayName(name: string): string {
  return name.replace(/^DEMO\s*[·•·]\s*/i, '');
}

const CARDS_PER_PAGE = 3;

export function Testimonials({
  section,
  testimonials,
}: {
  section: SectionView;
  testimonials: TestimonialView[];
}) {
  const [offset, setOffset] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (!section.enabled || testimonials.length === 0) return null;

  const maxOffset = Math.max(0, testimonials.length - CARDS_PER_PAGE);
  const visible = testimonials.slice(offset, offset + CARDS_PER_PAGE);

  return (
    <Section id="testimonials" tone="paper">
      <Container>
        {/* ── Шапка ──────────────────────────────────────────────── */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <h2 className="display text-[clamp(1.85rem,4.6vw,3.9rem)] leading-[1.04]">
            {section.title ?? 'Отзывы клиентов'}
          </h2>

          {testimonials.length > CARDS_PER_PAGE && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="Предыдущий отзыв"
                onClick={() => setOffset((o) => Math.max(0, o - 1))}
                disabled={offset === 0}
                className="flex size-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink disabled:opacity-30"
              >
                <ChevronLeft className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Следующий отзыв"
                onClick={() => setOffset((o) => Math.min(maxOffset, o + 1))}
                disabled={offset >= maxOffset}
                className="flex size-11 items-center justify-center rounded-full border border-line-strong text-ink transition-colors hover:border-ink disabled:opacity-30"
              >
                <ChevronRight className="size-5" strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>

        {/* ── Карточки ────────────────────────────────────────────── */}
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => {
            const name = displayName(item.author);
            const isExpanded = expanded === item.id;

            return (
              <li
                key={item.id}
                className="flex min-h-[200px] overflow-hidden rounded-2xl bg-paper-2"
                data-reveal="up"
              >
                {/* Цветной аватар */}
                <div
                  className="flex w-[38%] shrink-0 items-center justify-center"
                  style={{ backgroundColor: avatarColor(item.author) }}
                  aria-hidden="true"
                >
                  <span className="select-none font-[family-name:var(--font-display)] text-5xl font-bold text-white/25">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Содержимое */}
                <div className="flex flex-1 flex-col p-5">
                  {item.rating !== null && (
                    <div className="mb-3 flex gap-0.5" aria-label={`Оценка ${item.rating} из 5`}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          aria-hidden="true"
                          className={cn(
                            'size-3',
                            i < (item.rating ?? 0)
                              ? 'fill-brand text-brand'
                              : 'fill-transparent text-line-strong',
                          )}
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-[0.9375rem] font-bold leading-tight">{name}</p>
                  {item.city && (
                    <p className="mt-0.5 text-[0.8125rem] font-medium text-steel-2">{item.city}</p>
                  )}

                  <blockquote
                    className={cn(
                      'mt-3 flex-1 text-[0.8125rem] leading-relaxed text-steel',
                      isExpanded ? '' : 'line-clamp-4',
                    )}
                  >
                    {item.text}
                  </blockquote>

                  <button
                    type="button"
                    onClick={() => setExpanded(isExpanded ? null : item.id)}
                    className="mt-4 inline-flex items-center justify-center self-start rounded-full bg-ink px-4 py-2 text-[0.6875rem] font-bold uppercase tracking-widest text-white transition-colors hover:bg-graphite-2"
                  >
                    {isExpanded ? 'Свернуть' : 'Читать отзыв'}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        {testimonials.some((t) => t.isDemo) && (
          <p className="mt-8 text-[0.8125rem] text-steel-2">
            Отзывы с отметкой «Демо» — заглушки для вёрстки. Замените реальными в
            админ-панели или отключите секцию.
          </p>
        )}
      </Container>
    </Section>
  );
}
