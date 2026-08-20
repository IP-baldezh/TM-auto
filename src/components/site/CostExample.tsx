'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Container, Section } from '@/components/site/Section';
import { SmartImage } from '@/components/ui/SmartImage';

type LineItem = {
  label: string;
  sublabel?: string;
  amount: string;
};

type CarExample = {
  id: string;
  flag: string;
  brand: string;
  model: string;
  year: string;
  origin: string;
  priceSource: string;
  imageUrl: string;
  imageAlt: string;
  items: LineItem[];
  total: string;
};

const EXAMPLES: CarExample[] = [
  {
    id: 'mazda-cx5',
    flag: '🇨🇳',
    brand: 'Mazda',
    model: 'CX-5',
    year: '2026',
    origin: 'Китай',
    priceSource: '126 000 ¥',
    imageUrl: '/cars/mazda-cx5.png',
    imageAlt: 'Mazda CX-5 2023',
    items: [
      { label: 'Стоимость авто в Китае', sublabel: '126 000 юаней по курсу', amount: '≈ 1 680 000 ₽' },
      { label: 'Комиссия банка', sublabel: 'курс + 2,5%', amount: '≈ 42 000 ₽' },
      { label: 'Растаможка + утилизационный сбор', sublabel: 'таможенная пошлина + утиль', amount: '755 000 ₽' },
      { label: 'Лаборатория + ЭПТС', sublabel: 'СБКТС и электронный ПТС', amount: '60 000 ₽' },
      { label: 'Доставка до РФ', sublabel: 'море + наземная логистика', amount: '250 000 ₽' },
      { label: 'Сопутствующие расходы', sublabel: 'страховка, хранение, прочее', amount: '100 000 ₽' },
      { label: 'Комиссия ТМ Авто', sublabel: 'фиксируется в договоре', amount: 'по договору' },
    ],
    total: '≈ 3 000 000 ₽',
  },
  {
    id: 'audi-q5',
    flag: '🇨🇳',
    brand: 'Audi',
    model: 'Q5L',
    year: '2026',
    origin: 'Китай',
    priceSource: '329 800 ¥',
    imageUrl: '/cars/audi-q5.png',
    imageAlt: 'Audi Q5L 2023',
    items: [
      { label: 'Стоимость авто в Китае', sublabel: '329 800 юаней по курсу', amount: '≈ 4 450 000 ₽' },
      { label: 'Комиссия банка', sublabel: 'курс + 2,5%', amount: '≈ 111 000 ₽' },
      { label: 'Растаможка + утилизационный сбор', sublabel: 'таможенная пошлина + утиль', amount: '1 800 000 ₽' },
      { label: 'Лаборатория + ЭПТС', sublabel: 'СБКТС и электронный ПТС', amount: '60 000 ₽' },
      { label: 'Доставка до РФ', sublabel: 'море + наземная логистика', amount: '250 000 ₽' },
      { label: 'Сопутствующие расходы', sublabel: 'страховка, хранение, прочее', amount: '100 000 ₽' },
      { label: 'Комиссия ТМ Авто', sublabel: 'фиксируется в договоре', amount: 'по договору' },
    ],
    total: '≈ 7 000 000 ₽',
  },
  {
    id: 'byd-han',
    flag: '🇨🇳',
    brand: 'BYD',
    model: 'Han EV',
    year: '2024',
    origin: 'Китай',
    priceSource: '189 800 ¥',
    imageUrl: '/cars/byd-han.png',
    imageAlt: 'BYD Han EV 2024',
    items: [
      { label: 'Стоимость авто в Китае', sublabel: '189 800 юаней по курсу', amount: '≈ 2 530 000 ₽' },
      { label: 'Комиссия банка', sublabel: 'курс + 2,5%', amount: '≈ 63 000 ₽' },
      { label: 'Утилизационный сбор', sublabel: 'таможенная пошлина 0% для EV', amount: '380 000 ₽' },
      { label: 'Лаборатория + ЭПТС', sublabel: 'СБКТС и электронный ПТС', amount: '60 000 ₽' },
      { label: 'Доставка до РФ', sublabel: 'море + наземная логистика', amount: '250 000 ₽' },
      { label: 'Сопутствующие расходы', sublabel: 'страховка, хранение, прочее', amount: '100 000 ₽' },
      { label: 'Комиссия ТМ Авто', sublabel: 'фиксируется в договоре', amount: 'по договору' },
    ],
    total: '≈ 3 600 000 ₽',
  },
  {
    id: 'hyundai-tucson',
    flag: '🇰🇷',
    brand: 'Hyundai',
    model: 'Tucson',
    year: '2022',
    origin: 'Корея',
    priceSource: '21 500 000 ₩',
    imageUrl: '/cars/hyundai-tucson.png',
    imageAlt: 'Hyundai Tucson 2022',
    items: [
      { label: 'Стоимость авто в Корее', sublabel: '21 500 000 вон по курсу', amount: '≈ 1 400 000 ₽' },
      { label: 'Аукционная комиссия', sublabel: 'комиссия аукциона + агент', amount: '≈ 80 000 ₽' },
      { label: 'Растаможка + утилизационный сбор', sublabel: 'таможенная пошлина + утиль', amount: '680 000 ₽' },
      { label: 'Лаборатория + ЭПТС', sublabel: 'СБКТС и электронный ПТС', amount: '60 000 ₽' },
      { label: 'Доставка до РФ', sublabel: 'море + наземная логистика', amount: '200 000 ₽' },
      { label: 'Сопутствующие расходы', sublabel: 'страховка, хранение, прочее', amount: '100 000 ₽' },
      { label: 'Комиссия ТМ Авто', sublabel: 'фиксируется в договоре', amount: 'по договору' },
    ],
    total: '≈ 2 700 000 ₽',
  },
];

export function CostExample() {
  const [activeId, setActiveId] = useState(EXAMPLES[0]!.id);
  const active = EXAMPLES.find((e) => e.id === activeId) ?? EXAMPLES[0]!;

  return (
    <Section id="cost-example" tone="paper">
      <Container>
        {/* Заголовок */}
        <div className="mb-10 md:mb-14" data-reveal="up">
          <h2 className="display text-[clamp(1.85rem,4.6vw,3.9rem)] leading-[1.04]">
            Пример расчёта стоимости авто в РФ
          </h2>
          <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-relaxed text-steel">
            Реальные цифры по каждой статье расходов — без скрытых платежей.
          </p>
        </div>

        {/* Переключатель моделей */}
        <div className="mb-8 flex flex-wrap gap-2" data-reveal="up">
          {EXAMPLES.map((example) => (
            <button
              key={example.id}
              type="button"
              onClick={() => setActiveId(example.id)}
              className={cn(
                'rounded-full px-5 py-2.5 text-[0.875rem] font-semibold transition-colors',
                activeId === example.id
                  ? 'bg-ink text-paper'
                  : 'bg-paper-3 text-steel hover:text-ink',
              )}
            >
              <span className="mr-1.5">{example.flag}</span>
              {example.brand} {example.model}
            </button>
          ))}
        </div>

        <div className="grid items-stretch gap-6 xl:grid-cols-12 xl:gap-8" data-reveal="up">
          {/* Карточка с расчётом */}
          <div className="flex flex-col xl:col-span-7">
            <div className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-line bg-paper-2">
              {/* Шапка */}
              <div className="flex items-center justify-between gap-4 bg-ink px-6 py-5 sm:px-8">
                <div>
                  <p className="text-[0.75rem] font-medium uppercase tracking-widest text-steel-3">
                    {active.flag} Расчёт под ключ · {active.origin}
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-paper">
                    {active.brand} {active.model}{' '}
                    <span className="text-steel-3">{active.year}</span>
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-[0.75rem] text-steel-3">Цена на рынке</p>
                  <p className="text-[1rem] font-semibold text-paper">{active.priceSource}</p>
                </div>
              </div>

              {/* Строки расходов */}
              <ul className="flex-1 divide-y divide-line">
                {active.items.map((item, i) => (
                  <li key={i} className="flex items-center justify-between gap-4 px-6 py-4 sm:px-8">
                    <div className="min-w-0">
                      <p className="text-[0.9375rem] font-medium text-ink">{item.label}</p>
                      {item.sublabel && (
                        <p className="mt-0.5 text-[0.8125rem] text-steel">{item.sublabel}</p>
                      )}
                    </div>
                    <p
                      className={cn(
                        'shrink-0 text-right text-[0.9375rem] font-semibold tabular-nums',
                        item.amount === 'по договору' ? 'text-steel' : 'text-ink',
                      )}
                    >
                      {item.amount}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Итого */}
              <div className="flex items-center justify-between gap-4 border-t-2 border-ink bg-ink px-6 py-5 sm:px-8">
                <p className="text-[1rem] font-bold text-paper">Итого в РФ</p>
                <p className="text-[1.5rem] font-bold tabular-nums text-white">{active.total}</p>
              </div>
            </div>
          </div>

          {/* Фото автомобиля */}
          <div className="xl:col-span-5">
            <div className="relative h-64 overflow-hidden rounded-3xl bg-paper-3 sm:h-80 xl:h-full">
              {EXAMPLES.map((example) => (
                <div
                  key={example.id}
                  aria-hidden={example.id !== activeId}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    example.id === activeId ? 'opacity-100' : 'opacity-0',
                  )}
                >
                  <SmartImage
                    src={example.imageUrl}
                    alt={example.imageAlt}
                    fill
                    sizes="(max-width: 1280px) 100vw, 38vw"
                    className="object-cover object-center"
                  />
                </div>
              ))}

              {/* Плашка с моделью */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-6 pb-5 pt-16">
                <p className="text-[0.75rem] font-medium uppercase tracking-widest text-white/60">
                  {active.flag} {active.origin}
                </p>
                <p className="mt-1 text-lg font-bold text-white">
                  {active.brand} {active.model} {active.year}
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-[0.8125rem] leading-relaxed text-steel" data-reveal="up">
          Все цифры приблизительные. Итоговая стоимость зависит от актуального курса валюты и комплектации.
        </p>
      </Container>
    </Section>
  );
}
