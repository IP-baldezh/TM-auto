import type { SectionView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';

const STEPS = [
  { num: '01', title: 'Заключение договора', note: 'С прописанными критериями поиска. Цена актуальна и указана в прайсе.' },
  { num: '02', title: 'Авансовый платёж — 100 000 ₽', note: 'Обязательное условие. Залог подтверждения намерений.' },
  { num: '03', title: 'Выбор автомобиля из прайса', note: 'Цвет кузова, салона и комплектация.' },
  { num: '04', title: 'Осмотр с фото/видео отчётом', note: 'Бронирование у экспортёра. Оплата инвойса в юанях через ВТБ — 5–10 минут.' },
  { num: '05', title: 'Перевод поступает в Китай', note: 'В течение 2–3 рабочих дней.' },
  { num: '06', title: 'Подготовка экспортных документов', note: null },
  { num: '07', title: 'Оплата стоимости доставки', note: null },
  { num: '08', title: 'Доставка на СВХ в России', note: 'Китай → нейтральная зона → Казахстан → РФ.' },
  { num: '09', title: 'Таможенная очистка', note: 'Растаможка автомобиля.' },
  { num: '10', title: 'Оплата пошлины', note: 'По квитанциям.' },
  { num: '11', title: 'Лаборатория, СБКТС и ЭПТС', note: null },
  { num: '12', title: 'Доставка до вашего города', note: null },
  { num: '13', title: 'Мойка и подготовка к выдаче', note: null },
  { num: '14', title: 'Выдача автомобиля', note: null },
  { num: '15', title: 'ТО и доп. оборудование', note: 'По желанию клиента.' },
];

const COLS = 3;

/* Горизонтальная линия-коннектор между карточками в одной строке */
function HLine() {
  return (
    <div className="flex items-center" aria-hidden="true">
      <div className="h-px w-full rounded-full bg-steel/30" />
    </div>
  );
}

/* Закруглённый поворот в конце строки — намекает «продолжение ниже» */
function RowTurn() {
  return (
    <div className="flex justify-end py-1" aria-hidden="true">
      <svg
        width="32"
        height="28"
        viewBox="0 0 32 28"
        fill="none"
        className="text-steel/30"
      >
        <path
          d="M 0 0 Q 30 0 30 14 Q 30 28 0 28"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* Группировка массива по N элементов */
function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export function Services({ section }: { section: SectionView }) {
  if (!section.enabled) return null;

  const rows = chunk(STEPS, COLS);

  return (
    <Section id="services" tone="paper">
      <Container>
        <SectionHeading
          title={section.title ?? 'Как мы работаем'}
          subtitle={section.subtitle}
        />

        <div className="mt-8 md:mt-12">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex}>
              {/* Строка карточек + горизонтальные коннекторы */}
              <div
                className="grid items-stretch"
                style={{ gridTemplateColumns: '1fr 28px 1fr 28px 1fr' }}
              >
                {row.map((step, ci) => (
                  <>
                    {ci > 0 && <HLine key={`h-${step.num}`} />}
                    <div
                      key={step.num}
                      data-reveal="up"
                      className="flex flex-col rounded-2xl bg-paper-2 px-5 py-4"
                    >
                      <span className="mb-1 tabular-nums text-[0.8125rem] font-bold leading-none text-ink/20">
                        {step.num}
                      </span>
                      <p className="text-[0.875rem] font-semibold leading-snug text-ink">
                        {step.title}
                      </p>
                      {step.note && (
                        <p className="mt-1.5 text-[0.75rem] leading-relaxed text-steel">
                          {step.note}
                        </p>
                      )}
                    </div>
                  </>
                ))}

                {/* Дополняем до COLS если строка неполная */}
                {row.length < COLS &&
                  Array.from({ length: COLS - row.length }).flatMap((_, i) => [
                    <HLine key={`eh-${i}`} />,
                    <div key={`ep-${i}`} />,
                  ])}
              </div>

              {/* Закруглённый поворот между строками */}
              {rowIndex < rows.length - 1 && <RowTurn />}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
