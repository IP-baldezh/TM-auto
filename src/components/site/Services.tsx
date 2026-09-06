import type { SectionView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';
import { CardSticky, ContainerScroll } from '@/components/ui/ContainerScroll';

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

type Step = (typeof STEPS)[number];

/* Пятнадцать шагов сгруппированы в пять этапов: колода из пятнадцати
   карточек нечитаема — от каждой погребённой остаётся полоска в
   несколько пикселей. Границы срезов идут по смыслу этапа. */
const PHASES: { title: string; steps: Step[] }[] = [
  { title: 'Договор и подбор',      steps: STEPS.slice(0, 3) },
  { title: 'Оплата и бронирование', steps: STEPS.slice(3, 6) },
  { title: 'Логистика',             steps: STEPS.slice(6, 8) },
  { title: 'Таможня и документы',   steps: STEPS.slice(8, 11) },
  { title: 'Подготовка и выдача',   steps: STEPS.slice(11) },
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

/* Карточка одного шага — используется в мобильном списке */
function StepCard({ step, accent }: { step: Step; accent: 'left' | 'right' }) {
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

/* Карточка этапа для колоды. Непрозрачный фон обязателен: карточки
   перекрывают друг друга. Тень направлена вверх — на те карточки,
   что уже ушли под неё.
   Название и номер стоят одной строкой в самом верху: именно эта
   строка остаётся видимой у погребённых карточек, поэтому колода
   читается как оглавление пройденных этапов. */
function PhaseCard({
  phase,
  index,
}: {
  phase: (typeof PHASES)[number];
  index: number;
}) {
  return (
    <div
      className="relative min-h-[16rem] overflow-hidden rounded-3xl border border-line bg-paper-2 px-8 py-7"
      style={{ boxShadow: '0 -10px 40px -12px rgba(14, 17, 20, 0.15)' }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[1.25rem] font-semibold leading-tight tracking-[-0.01em] text-ink">
          {phase.title}
        </h3>
        <span className="shrink-0 select-none tabular-nums text-[1.25rem] font-black leading-none text-brand">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <ul className="mt-6 flex flex-col gap-4 border-t border-line pt-6">
        {phase.steps.map((step) => (
          <li key={step.num} className="flex gap-4">
            <span className="mt-[0.15rem] w-5 shrink-0 tabular-nums text-[0.8125rem] font-bold text-brand">
              {parseInt(step.num, 10)}
            </span>
            <div>
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

      <LogoWatermark />
    </div>
  );
}

export function Services({ section }: { section: SectionView }) {
  if (!section.enabled) return null;

  return (
    <Section id="services" tone="paper">
      <Container>
        {/* До lg — заголовок и простой список: колода в узкой колонке тесна */}
        <div className="lg:hidden">
          <SectionHeading
            title={section.title ?? 'Как мы работаем'}
            subtitle={section.subtitle}
          />
          <div className="mt-8 flex flex-col gap-2">
            {STEPS.map((step) => (
              <StepCard key={step.num} step={step} accent="left" />
            ))}
          </div>
        </div>

        {/* lg+ — слева липкий заголовок, справа колода этапов */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-x-20">
          {/* self-start обязателен: иначе колонка растянется на всю высоту
              строки грида и липнуть будет нечему */}
          <div className="sticky top-24 self-start">
            <SectionHeading
              title={section.title ?? 'Как мы работаем'}
              subtitle={section.subtitle}
              align="stack"
              className="mb-0 md:mb-0"
            />
          </div>

          {/* baseY обходит фиксированную шапку (h-20 = 80px на lg) и
              совпадает с top-24 заголовка. incrementY подобран так, чтобы
              у погребённых карточек оставалась видна строка названия.
              gap задаёт темп — примерно экран прокрутки на карточку. */}
          <ContainerScroll className="flex flex-col gap-[55vh]">
            {PHASES.map((phase, i) => (
              <CardSticky key={phase.title} index={i} baseY={96} incrementY={56}>
                <PhaseCard phase={phase} index={i} />
              </CardSticky>
            ))}
            {/* Распорка даёт последней карточке время постоять собранной
                колодой: sticky ограничен content-box контейнера. */}
            <div aria-hidden className="h-0" />
          </ContainerScroll>
        </div>
      </Container>
    </Section>
  );
}
