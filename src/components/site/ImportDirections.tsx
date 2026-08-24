import { Container, Section } from '@/components/site/Section';
import { ButtonLink } from '@/components/ui/Button';

const DIRECTIONS = [
  {
    id: 'new',
    heading: 'Новые автомобили',
    flag: '🌍',
    tagline: 'Напрямую от дилеров и производителей',
    features: [
      'Audi, BMW, Mercedes-Benz, Volkswagen, Porsche и другие',
      'Предотгрузочная инспекция на заводе или складе',
      'Доставка морем или автотранспортом',
      'Таможня, СБКТС и ЭПТС под ключ',
    ],
    bg: 'bg-ink',
    text: 'text-paper',
    accent: 'text-brand-bright',
    muted: 'text-steel-3',
    cta: { label: 'Подобрать новое авто', href: '#calculator' },
    watermarkColor: 'fill-white',
    watermarkOpacity: 'opacity-[0.06]',
  },
  {
    id: 'used',
    heading: 'Авто с пробегом',
    flag: '🏁',
    tagline: 'С международных аукционов и у официальных дилеров',
    features: [
      'BMW, Mercedes-Benz, Toyota, Lexus и другие марки',
      'Проверка по международным базам данных',
      'Аукционная документация и история обслуживания',
      'Доставка и растаможка с фиксированной ценой',
    ],
    bg: 'bg-brand',
    text: 'text-white',
    accent: 'text-white',
    muted: 'text-white/70',
    cta: { label: 'Подобрать авто с пробегом', href: '#calculator' },
    watermarkColor: 'fill-white',
    watermarkOpacity: 'opacity-[0.10]',
  },
];

function BrandWatermark({ fillClass, opacityClass }: { fillClass: string; opacityClass: string }) {
  return (
    <svg
      viewBox="0 0 187 89"
      aria-hidden="true"
      className={`pointer-events-none absolute -right-[8%] top-1/2 h-[75%] w-auto -translate-y-1/2 select-none ${opacityClass} ${fillClass}`}
    >
      <path d="M93.0379 0.0988639C133.037 -1.10095 149.371 8.93223 152.538 14.0989L159.538 24.0989C161.205 24.9322 164.538 26.0986 164.538 24.0989C164.038 15.0993 175.038 16.5989 178.038 16.5989C194.536 22.0986 176.538 28.7654 166.538 31.0989V32.0989C176.137 31.2997 181.538 42.099 183.038 47.5989C190.637 75.9971 182.205 86.7646 177.038 88.5989C183.459 67.4459 166.901 72.5706 156.336 78.5403C155.751 78.9041 155.151 79.2581 154.538 79.5989C155.112 79.2468 155.714 78.8917 156.336 78.5403C166.046 72.4993 171.809 63.5286 173.538 59.5989C184.337 34.4003 149.371 54.099 130.538 67.0989L135.038 61.0989C130.638 65.4988 105.205 67.2655 93.0379 67.5989C80.8714 67.2655 55.4385 65.4987 51.0379 61.0989L55.5379 67.0989C36.7046 54.0989 1.73804 34.399 12.5379 59.5989C14.2671 63.5287 20.0286 72.4993 29.7391 78.5403C30.3611 78.8918 30.9633 79.2467 31.5379 79.5989C30.9243 79.258 30.3241 78.9042 29.7391 78.5403C19.1741 72.5704 2.61629 67.445 9.03791 88.5989C3.87125 86.7655 -4.56208 75.9989 3.03791 47.5989C4.53815 42.0987 9.93828 31.2989 19.5379 32.0989V31.0989C9.53791 28.7655 -8.46209 22.0989 8.03791 16.5989C11.0392 16.5986 22.0374 15.1003 21.5379 24.0989C21.5379 26.0989 24.8712 24.9322 26.5379 24.0989L33.5379 14.0989C36.7057 8.93198 53.0398 -1.10108 93.0379 0.0988639ZM155 29.0002C152.833 29.8336 146.2 31.5002 137 31.5002H48.9998C39.8002 31.5002 33.1668 29.8336 30.9998 29.0002L27.4998 33.5002C25.0998 36.7002 26.1665 39.1669 26.9998 40.0002C33.1666 45.0003 46.1999 55.5002 48.9998 57.5002C51.8003 61.1001 79.5 62.0002 92.9998 62.0002C106.5 62.0002 134.2 61.1002 137 57.5002C139.8 55.4997 152.833 45.0001 159 40.0002C159.833 39.1667 160.899 36.6999 158.5 33.5002L155 29.0002ZM66.5379 7.59886C53.3395 7.99882 46.3723 10.7653 44.5379 12.0989C41.8714 14.0988 36.1382 19.199 34.5379 23.5989C32.9379 27.9989 72.8712 29.0989 93.0379 29.0989C113.205 29.0988 153.137 27.9987 151.538 23.5989C149.938 19.1991 144.205 14.099 141.538 12.0989C139.705 10.7655 132.737 7.99894 119.538 7.59886H66.5379Z" />
      <ellipse cx="92.9998" cy="58.5002" rx="3" ry="1.5" />
    </svg>
  );
}

export function ImportDirections() {
  return (
    <Section id="directions" tone="paper-2">
      <Container>
        <div className="mb-8 md:mb-16" data-reveal="up">
          <h2 className="display text-[clamp(1.85rem,4.6vw,3.9rem)] leading-[1.04]">
            Работаем с основными рынками — выбирайте направление или доверьте выбор нам.
          </h2>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {DIRECTIONS.map((dir) => (
            <div
              key={dir.id}
              data-reveal="up"
              className={`relative overflow-hidden rounded-3xl p-8 sm:p-10 ${dir.bg} ${dir.text}`}
            >
              <BrandWatermark fillClass={dir.watermarkColor} opacityClass={dir.watermarkOpacity} />

              <div className="relative">
                <h3 className={`text-[2rem] font-bold leading-tight tracking-[-0.02em] ${dir.accent}`}>
                  {dir.heading}
                </h3>
                <p className={`mt-2 text-[0.9375rem] ${dir.muted}`}>{dir.tagline}</p>

                <ul className="mt-7 flex flex-col gap-3">
                  {dir.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-current opacity-50" />
                      <span className={`text-[0.9375rem] leading-snug ${dir.muted}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <ButtonLink
                    href={dir.cta.href}
                    variant={dir.bg === 'bg-brand' ? 'dark' : 'primary'}
                    size="md"
                  >
                    {dir.cta.label}
                  </ButtonLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
