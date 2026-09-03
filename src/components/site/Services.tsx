import type { SectionView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';

const STEPS = [
  { num: '01', title: 'Подписываем договор', note: 'Фиксируем ваши критерии: марку, модель, комплектацию и бюджет.' },
  { num: '02', title: 'Аванс', note: 'Резервируем место в поставке и приступаем к подбору.' },
  { num: '03', title: 'Выбираете автомобиль', note: 'Из актуального прайса — цвет кузова, салона и комплектация.' },
  { num: '04', title: 'Осмотр и бронирование', note: 'Фото- и видеоотчёт с автомобилем. Оформляем бронь у экспортёра.' },
  { num: '05', title: 'Оплата инвойса', note: 'Переводите стоимость авто в юанях — займёт 5–10 минут.' },
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

const WATERMARK_CARDS = new Set(['02', '05', '08', '11', '15']);

function LogoWatermark() {
  return (
    <svg
      viewBox="0 0 187 89"
      aria-hidden="true"
      className="pointer-events-none absolute bottom-3 right-3 h-9 w-auto select-none opacity-[0.07]"
      fill="currentColor"
    >
      <path d="M93.0379 0.0988639C133.037 -1.10095 149.371 8.93223 152.538 14.0989L159.538 24.0989C161.205 24.9322 164.538 26.0986 164.538 24.0989C164.038 15.0993 175.038 16.5989 178.038 16.5989C194.536 22.0986 176.538 28.7654 166.538 31.0989V32.0989C176.137 31.2997 181.538 42.099 183.038 47.5989C190.637 75.9971 182.205 86.7646 177.038 88.5989C183.459 67.4459 166.901 72.5706 156.336 78.5403C155.751 78.9041 155.151 79.2581 154.538 79.5989C155.112 79.2468 155.714 78.8917 156.336 78.5403C166.046 72.4993 171.809 63.5286 173.538 59.5989C184.337 34.4003 149.371 54.099 130.538 67.0989L135.038 61.0989C130.638 65.4988 105.205 67.2655 93.0379 67.5989C80.8714 67.2655 55.4385 65.4987 51.0379 61.0989L55.5379 67.0989C36.7046 54.0989 1.73804 34.399 12.5379 59.5989C14.2671 63.5287 20.0286 72.4993 29.7391 78.5403C30.3611 78.8918 30.9633 79.2467 31.5379 79.5989C30.9243 79.258 30.3241 78.9042 29.7391 78.5403C19.1741 72.5704 2.61629 67.445 9.03791 88.5989C3.87125 86.7655 -4.56208 75.9989 3.03791 47.5989C4.53815 42.0987 9.93828 31.2989 19.5379 32.0989V31.0989C9.53791 28.7655 -8.46209 22.0989 8.03791 16.5989C11.0392 16.5986 22.0374 15.1003 21.5379 24.0989C21.5379 26.0989 24.8712 24.9322 26.5379 24.0989L33.5379 14.0989C36.7057 8.93198 53.0398 -1.10108 93.0379 0.0988639ZM155 29.0002C152.833 29.8336 146.2 31.5002 137 31.5002H48.9998C39.8002 31.5002 33.1668 29.8336 30.9998 29.0002L27.4998 33.5002C25.0998 36.7002 26.1665 39.1669 26.9998 40.0002C33.1666 45.0003 46.1999 55.5002 48.9998 57.5002C51.8003 61.1001 79.5 62.0002 92.9998 62.0002C106.5 62.0002 134.2 61.1002 137 57.5002C139.8 55.4997 152.833 45.0001 159 40.0002C159.833 39.1667 160.899 36.6999 158.5 33.5002L155 29.0002ZM66.5379 7.59886C53.3395 7.99882 46.3723 10.7653 44.5379 12.0989C41.8714 14.0988 36.1382 19.199 34.5379 23.5989C32.9379 27.9989 72.8712 29.0989 93.0379 29.0989C113.205 29.0988 153.137 27.9987 151.538 23.5989C149.938 19.1991 144.205 14.099 141.538 12.0989C139.705 10.7655 132.737 7.99894 119.538 7.59886H66.5379Z" />
      <ellipse cx="92.9998" cy="58.5002" rx="3" ry="1.5" />
    </svg>
  );
}

/* Карточка шага — штрих с той стороны, которая смотрит к центральной линии */
function StepCard({ step, accent }: { step: typeof STEPS[number]; accent: 'left' | 'right' }) {
  const hasWatermark = WATERMARK_CARDS.has(step.num);
  return (
    <div
      className={`relative flex min-h-[7rem] flex-col overflow-hidden rounded-2xl bg-paper-2 px-6 py-5 shadow-sm
        ${accent === 'left' ? 'border-l-[3px] border-brand' : 'border-r-[3px] border-brand'}`}
    >
      <p className="text-[0.9375rem] font-semibold leading-snug text-ink">
        {step.title}
      </p>
      {step.note && (
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-steel">
          {step.note}
        </p>
      )}
      {hasWatermark && <LogoWatermark />}
    </div>
  );
}

/* Большой полупрозрачный номер на противоположной стороне */
function BigNum({ num, align }: { num: string; align: 'left' | 'right' }) {
  return (
    <p
      className={`select-none tabular-nums text-[5.5rem] font-black leading-none text-ink/[0.06]
        ${align === 'left' ? 'pl-4 text-left' : 'pr-4 text-right'}`}
    >
      {String(parseInt(num, 10))}
    </p>
  );
}

export function Services({ section }: { section: SectionView }) {
  if (!section.enabled) return null;

  return (
    <Section id="services" tone="paper">
      <Container>
        <SectionHeading
          title={section.title ?? 'Как мы работаем'}
          subtitle={section.subtitle}
        />

        {/* Mobile: простой список */}
        <div className="mt-8 flex flex-col gap-2 md:hidden">
          {STEPS.map((step) => (
            <StepCard key={step.num} step={step} accent="left" />
          ))}
        </div>

        {/* Desktop: зигзаг с L-образными переходами */}
        <div className="mt-10 hidden md:block">
          <div className="flex flex-col">
            {STEPS.map((step, i) => {
              const cardOnLeft = i % 2 !== 0;
              const isLast = i === STEPS.length - 1;
              return (
                <div key={step.num}>
                  <div data-reveal="up" className="flex items-center">
                    {/* Левая половина */}
                    <div className="flex-1 pr-8">
                      {cardOnLeft
                        ? <StepCard step={step} accent="right" />
                        : <BigNum num={step.num} align="right" />}
                    </div>

                    <div className="w-0 shrink-0" />

                    {/* Правая половина */}
                    <div className="flex-1 pl-8">
                      {!cardOnLeft
                        ? <StepCard step={step} accent="left" />
                        : <BigNum num={step.num} align="left" />}
                    </div>
                  </div>

                  {/* Плавный дуговой переход между карточками */}
                  {!isLast && (
                    <div className="relative" style={{ height: '4rem' }}>
                      <div
                        className={`absolute inset-y-0 border-b-[3px] border-brand/35 ${
                          cardOnLeft
                            ? 'border-l-[3px] rounded-bl-[9999px]'
                            : 'border-r-[3px] rounded-br-[9999px]'
                        }`}
                        style={{
                          left: 'calc(50% - 2rem)',
                          right: 'calc(50% - 2rem)',
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
