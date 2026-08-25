'use client';

import { ArrowUpRight } from 'lucide-react';

import type { CarView, SectionView } from '@/lib/content';
import { Container, Section } from '@/components/site/Section';
import { SectionHeading } from '@/components/site/Section';
import { formatMileage, formatMoney } from '@/lib/utils';

function CarCard({ car }: { car: CarView }) {
  const specs: { label: string; value: string }[] = [];
  if (car.trim)         specs.push({ label: 'Комплектация', value: car.trim });
  if (car.transmission) specs.push({ label: 'Трансмиссия',  value: car.transmission });
  if (car.drive)        specs.push({ label: 'Привод',        value: car.drive });
  if (car.engine)       specs.push({ label: 'Двигатель',     value: car.engine });
  if (car.mileage !== null) specs.push({ label: 'Пробег', value: formatMileage(car.mileage) });
  specs.push({ label: 'Год', value: String(car.year) });

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.06]">
      {/* Фото: впритык к краям сверху и по бокам, нижние углы закруглены */}
      <div className="relative aspect-square overflow-hidden rounded-b-2xl bg-graphite">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={car.imageUrl}
          alt={car.imageAlt ?? car.title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Контент */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Название + бейдж страны + видео */}
        <div className="flex items-start gap-2">
          <h3 className="flex-1 text-[0.9375rem] font-bold uppercase leading-tight tracking-wide text-ink">
            {car.title}
            {car.location && (
              <span className="ml-2 align-middle rounded bg-steel/10 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-steel">
                {car.location}
              </span>
            )}
          </h3>
          {car.videoUrl && (
            <a
              href={car.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1 text-[0.75rem] font-medium text-steel transition hover:text-brand"
            >
              Видео-обзор
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          )}
        </div>

        {/* Характеристики */}
        <ul className="flex flex-col gap-0.5">
          {specs.map((s) => (
            <li key={s.label} className="flex items-baseline gap-1 text-[0.75rem] leading-relaxed">
              <span className="shrink-0 text-ink/60">{s.label}:</span>
              <span className="font-medium text-brand">{s.value}</span>
            </li>
          ))}
        </ul>

        {/* Цена */}
        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-[0.6875rem] text-steel">Стоимость под ключ:</p>
            <p className="text-[1.25rem] font-bold leading-none tracking-[-0.02em] text-brand">
              {car.price ? `${formatMoney(car.price)} ₽` : 'По запросу'}
            </p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-white">
            <ArrowUpRight className="size-5" aria-hidden="true" />
          </div>
        </div>
      </div>
    </article>
  );
}

export function DeliveredCars({ section, cars }: { section: SectionView; cars: CarView[] }) {
  if (!section.enabled || cars.length === 0) return null;

  return (
    <Section id="cars" tone="paper">
      <Container>
        <SectionHeading
          title={section.title ?? 'Автомобили, которые мы привезли'}
          subtitle={section.subtitle}
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-12">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
