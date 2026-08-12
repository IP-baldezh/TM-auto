import type { CarView, SectionView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';
import { formatMileage, formatMoney, pluralRu } from '@/lib/utils';
import { CoverflowCarousel, type CoverflowSlide } from './CoverflowCarousel';

export function DeliveredCars({ section, cars }: { section: SectionView; cars: CarView[] }) {
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
        <SectionHeading title={section.title} subtitle={section.subtitle} />
      </Container>

      {/* Карусель выходит за контейнер: боковые карточки должны уходить под
          края экрана, иначе теряется ощущение объёма. */}
      <div data-reveal="up">
        <CoverflowCarousel slides={slides} />
      </div>

      {cars.some((c) => c.isDemo) && (
        <Container>
          <p className="mt-10 text-center text-[0.8125rem] text-steel-2">
            Карточки с отметкой «Демо» — примеры оформления. Реальные подобранные автомобили
            добавляются в админ-панели.
          </p>
        </Container>
      )}
    </Section>
  );
}
