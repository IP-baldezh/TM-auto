import { Star } from 'lucide-react';

import type { SectionView, TestimonialView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';
import { cn } from '@/lib/utils';

export function Testimonials({
  section,
  testimonials,
}: {
  section: SectionView;
  testimonials: TestimonialView[];
}) {
  if (!section.enabled || testimonials.length === 0) return null;

  return (
    <Section id="testimonials" tone="paper-2">
      <Container>
        <SectionHeading title={section.title} subtitle={section.subtitle} />

        <ul className="grid gap-px bg-line md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li key={item.id} className="bg-paper-2 p-6 sm:p-8" data-reveal="up">
              <div className="flex items-center justify-between gap-4">
                {item.rating !== null && (
                  <div className="flex gap-0.5" aria-label={`Оценка ${item.rating} из 5`}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        aria-hidden="true"
                        className={cn(
                          'size-3.5',
                          i < (item.rating ?? 0)
                            ? 'fill-brand text-brand'
                            : 'fill-transparent text-line-strong',
                        )}
                      />
                    ))}
                  </div>
                )}
                {item.isDemo && (
                  <span className="rounded-[2px] bg-line px-1.5 py-0.5 text-[0.6875rem] text-steel">
                    Демо
                  </span>
                )}
              </div>

              <blockquote className="mt-5 text-[0.9375rem] leading-relaxed text-steel">
                {item.text}
              </blockquote>

              <div className="mt-6 border-t border-line pt-4">
                <p className="text-[0.9375rem] font-semibold">{item.author}</p>
                <p className="mt-0.5 text-[0.8125rem] text-steel-2">
                  {[item.city, item.carTitle].filter(Boolean).join(' · ')}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {testimonials.some((t) => t.isDemo) && (
          <p className="mt-8 text-[0.8125rem] text-steel-2">
            Отзывы с отметкой «Демо» — заглушки для вёрстки. Замените их в админ-панели или
            отключите секцию.
          </p>
        )}
      </Container>
    </Section>
  );
}
