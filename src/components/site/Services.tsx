import type { SectionView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';

const STEPS = [
  {
    num: '01',
    title: 'Заключение договора',
    note: 'С прописанными критериями поиска. Цена актуальна и указана в прайсе.',
  },
  {
    num: '02',
    title: 'Авансовый платёж — 100 000 ₽',
    note: 'Обязательное условие. Залог подтверждения намерений.',
  },
  {
    num: '03',
    title: 'Выбор автомобиля из прайса',
    note: 'Цвет кузова, салона и комплектация.',
  },
  {
    num: '04',
    title: 'Осмотр с фото/видео отчётом',
    note: 'Бронирование у экспортёра. Оплата инвойса в юанях через ВТБ — 5–10 минут.',
  },
  {
    num: '05',
    title: 'Перевод поступает в Китай',
    note: 'В течение 2–3 рабочих дней.',
  },
  {
    num: '06',
    title: 'Подготовка экспортных документов',
    note: null,
  },
  {
    num: '07',
    title: 'Оплата стоимости доставки',
    note: null,
  },
  {
    num: '08',
    title: 'Доставка на СВХ в России',
    note: 'Китай → нейтральная зона → Казахстан → РФ.',
  },
  {
    num: '09',
    title: 'Таможенная очистка',
    note: 'Растаможка автомобиля.',
  },
  {
    num: '10',
    title: 'Оплата пошлины',
    note: 'По квитанциям.',
  },
  {
    num: '11',
    title: 'Лаборатория, СБКТС и ЭПТС',
    note: null,
  },
  {
    num: '12',
    title: 'Доставка до вашего города',
    note: null,
  },
  {
    num: '13',
    title: 'Мойка и подготовка к выдаче',
    note: null,
  },
  {
    num: '14',
    title: 'Выдача автомобиля',
    note: null,
  },
  {
    num: '15',
    title: 'ТО и доп. оборудование',
    note: 'По желанию клиента.',
  },
];

export function Services({ section }: { section: SectionView }) {
  if (!section.enabled) return null;

  return (
    <Section id="services" tone="paper">
      <Container>
        <SectionHeading
          title={section.title ?? 'Как мы работаем'}
          subtitle={section.subtitle}
        />

        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 md:mt-12">
          {STEPS.map((step) => (
            <li
              key={step.num}
              data-reveal="up"
              className="flex items-start gap-4 rounded-2xl bg-paper-2 px-5 py-4"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 shrink-0 select-none text-[1.25rem] font-bold leading-none tabular-nums text-ink/20"
              >
                {step.num}
              </span>
              <div className="min-w-0">
                <p className="text-[0.9375rem] font-semibold leading-snug text-ink">
                  {step.title}
                </p>
                {step.note && (
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-steel">
                    {step.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
