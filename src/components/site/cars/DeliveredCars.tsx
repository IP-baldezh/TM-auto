'use client';

import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { CarView, SectionView } from '@/lib/content';
import { Container, Section } from '@/components/site/Section';
import { formatMileage, formatMoney, pluralRu } from '@/lib/utils';
import { CoverflowCarousel, type CoverflowSlide } from './CoverflowCarousel';

export function DeliveredCars({ section, cars }: { section: SectionView; cars: CarView[] }) {
  const carouselRef = useRef<{ nudge: (by: number) => void } | null>(null);

  if (!section.enabled || cars.length === 0) return null;

  const slides: CoverflowSlide[] = cars.map((car) => {
    const meta: { label: string; value: string }[] = [];
    meta.push({ label: 'Год', value: String(car.year) });
    if (car.mileage !== null) meta.push({ label: 'Пробег', value: formatMileage(car.mileage) });
    if (car.engine) meta.push({ label: 'Двигатель', value: car.engine });
    if (car.drive) meta.push({ label: 'Привод', value: car.drive });
    else if (car.transmission) meta.push({ label: 'КПП', value: car.transmission });

    const subtitleParts = [
      car.trim,
      car.location,
      car.searchDays
        ? `нашли за ${car.searchDays} ${pluralRu(car.searchDays, ['день', 'дня', 'дней'])}`
        : null,
    ].filter(Boolean);

    return {
      id: car.id,
      src: car.imageUrl,
      alt: car.imageAlt ?? car.title,
      title: car.title,
      subtitle: subtitleParts.length ? subtitleParts.join(' · ') : null,
      badge: car.isDemo ? 'Демо' : null,
      accent: car.savings ? `−${formatMoney(car.savings)} к цене` : null,
      meta,
      price: car.price ? formatMoney(car.price) : null,
    };
  });

  return (
    <Section id="cars" tone="paper-2">
      <Container>
        <div className="mb-3 md:mb-16">
          <div className="h-px w-full bg-line" data-reveal="mask" />
          <div className="flex items-end justify-between gap-6 pt-5 md:pt-10">
            <h2
              className="display text-[clamp(1.85rem,4.6vw,3.9rem)] leading-[1.04]"
              data-reveal="up"
            >
              {section.title}
            </h2>
            {cars.length > 1 && (
              <div className="hidden shrink-0 items-center gap-2 pb-1 sm:flex">
                <button
                  type="button"
                  aria-label="Предыдущий автомобиль"
                  onClick={() => carouselRef.current?.nudge(-1)}
                  className="flex h-14 w-[4.25rem] items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-dark"
                >
                  <ChevronLeft className="size-7" strokeWidth={2.5} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Следующий автомобиль"
                  onClick={() => carouselRef.current?.nudge(1)}
                  className="flex h-14 w-[4.25rem] items-center justify-center rounded-2xl bg-brand text-white shadow-md shadow-brand/25 transition-colors hover:bg-brand-dark"
                >
                  <ChevronRight className="size-7" strokeWidth={2.5} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>
      </Container>

      <div data-reveal="up">
        <CoverflowCarousel controlRef={carouselRef} slides={slides} />
      </div>

    </Section>
  );
}
