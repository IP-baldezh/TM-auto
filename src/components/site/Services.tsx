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

function StepCard({ step }: { step: typeof STEPS[number] }) {
  return (
    <div className="rounded-2xl bg-paper-2 px-5 py-4 ring-1 ring-black/[0.06]">
      <span className="tabular-nums text-[0.8125rem] font-bold leading-none text-brand">
        {step.num}
      </span>
      <p className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-ink">
        {step.title}
      </p>
      {step.note && (
        <p className="mt-1 text-[0.75rem] leading-relaxed text-steel">
          {step.note}
        </p>
      )}
    </div>
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
            <StepCard key={step.num} step={step} />
          ))}
        </div>

        {/* Desktop: зигзаг */}
        <div className="relative mt-10 hidden md:block">
          {/* Вертикальная линия по центру */}
          <div
            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(to bottom, transparent, color-mix(in srgb, currentColor 12%, transparent) 4%, color-mix(in srgb, currentColor 12%, transparent) 96%, transparent)' }}
          />

          <div className="flex flex-col gap-3">
            {STEPS.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={step.num}
                  data-reveal="up"
                  className={`flex items-center gap-6 ${isLeft ? '' : 'flex-row-reverse'}`}
                >
                  {/* Карточка */}
                  <div className="flex-1">
                    <div className={`max-w-sm ${isLeft ? 'ml-auto' : 'mr-auto'}`}>
                      <StepCard step={step} />
                    </div>
                  </div>

                  {/* Точка на линии */}
                  <div className="relative z-10 flex w-6 shrink-0 justify-center">
                    <div
                      className="h-3 w-3 rounded-full bg-brand"
                      style={{ boxShadow: '0 0 0 3px var(--color-paper)' }}
                    />
                  </div>

                  {/* Пустая половина */}
                  <div className="flex-1" />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
