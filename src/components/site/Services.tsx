import type { SectionView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';

const STEPS = [
  { num: '01', title: 'Подписываем договор', note: 'Фиксируем ваши критерии: марку, модель, комплектацию и бюджет.' },
  { num: '02', title: 'Аванс 100 000 ₽', note: 'Резервируем место в поставке и приступаем к подбору.' },
  { num: '03', title: 'Выбираете автомобиль', note: 'Из актуального прайса — цвет кузова, салона и комплектация.' },
  { num: '04', title: 'Осмотр и бронирование', note: 'Фото- и видеоотчёт с автомобилем. Оформляем бронь у экспортёра.' },
  { num: '05', title: 'Оплата инвойса', note: 'Переводите стоимость авто в юанях через ВТБ — займёт 5–10 минут.' },
  { num: '06', title: 'Деньги поступают экспортёру', note: 'Обычно 2–3 рабочих дня. Сразу готовим экспортные документы.' },
  { num: '07', title: 'Оплата доставки', note: 'Фиксированная стоимость логистики до границы с Россией.' },
  { num: '08', title: 'Везём автомобиль в Россию', note: 'Маршрут: Китай → нейтральная зона → Казахстан → СВХ в РФ.' },
  { num: '09', title: 'Таможенное оформление', note: 'Берём на себя все процедуры растаможки.' },
  { num: '10', title: 'Оплата таможенной пошлины', note: 'Выставляем квитанции — вы оплачиваете по фактическим ставкам.' },
  { num: '11', title: 'Сертификация', note: 'Лаборатория, СБКТС и электронный ПТС — авто готово к регистрации.' },
  { num: '12', title: 'Доставка до вашего города', note: 'Отправляем автовозом или транспортной компанией.' },
  { num: '13', title: 'Мойка и подготовка', note: 'Приводим автомобиль в порядок перед передачей.' },
  { num: '14', title: 'Передаём вам ключи', note: 'Осматриваем вместе и подписываем акт приёма.' },
  { num: '15', title: 'ТО и допоборудование', note: 'По желанию — сразу сделаем первое ТО и установим всё нужное.' },
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
                      <span className="mb-1 tabular-nums text-[0.8125rem] font-bold leading-none text-brand">
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

              {/* Отступ между строками */}
              {rowIndex < rows.length - 1 && <div className="h-3" />}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
