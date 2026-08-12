import type { BudgetTierView, CalculatorStepView, CalculatorView } from '@/lib/content';

/**
 * Движок расчёта стоимости услуги.
 *
 * Чистая функция без зависимостей от React и Prisma: одинаково выполняется
 * на клиенте (мгновенный предпросмотр) и на сервере (пересчёт при приёме
 * заявки, чтобы значение в CRM нельзя было подделать из браузера).
 *
 *   итог = clamp( round( (baseFee + Σ addend) × Π multiplier ) )
 *
 * ⚠️ Ни одно число не зашито в код — всё приходит из CalculatorConfig,
 *    CalculatorOption и CalculatorBudgetTier и редактируется в админке.
 */

export type BudgetAnswer = { from: number; to: number };

export type CalculatorAnswers = {
  /** key шага → выбранные value (для RANGE — пусто, значение в budget). */
  choices: Record<string, string[]>;
  budget: BudgetAnswer | null;
};

export type CalculatorEstimate = {
  /** Точечная оценка стоимости услуги, ₽. */
  price: number;
  /** Вилка вокруг точечной оценки, ₽. */
  priceFrom: number;
  priceTo: number;
  /** Бюджет на автомобиль, как его указал пользователь. */
  budgetFrom: number | null;
  budgetTo: number | null;
  /** Рекомендуемый резерв на первичное обслуживание, ₽. */
  reserve: number | null;
  /** Человекочитаемая расшифровка выбранных ответов. */
  breakdown: { label: string; value: string }[];
};

function roundTo(value: number, step: number): number {
  if (step <= 0) return Math.round(value);
  return Math.round(value / step) * step;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Порог, под который попадает бюджет: первый tier с upTo >= budget. */
export function findBudgetTier(tiers: BudgetTierView[], budget: number): BudgetTierView | null {
  const sorted = [...tiers].sort((a, b) => {
    if (a.upTo === null) return 1;
    if (b.upTo === null) return -1;
    return a.upTo - b.upTo;
  });
  for (const tier of sorted) {
    if (tier.upTo === null || budget <= tier.upTo) return tier;
  }
  return sorted.length ? (sorted[sorted.length - 1] ?? null) : null;
}

export function createEmptyAnswers(steps: CalculatorStepView[]): CalculatorAnswers {
  const rangeStep = steps.find((s) => s.kind === 'RANGE');
  const range = rangeStep?.rangeConfig;
  return {
    choices: {},
    budget: range ? { from: range.defaultFrom, to: range.defaultTo } : null,
  };
}

/** Отвечен ли шаг настолько, чтобы можно было идти дальше. */
export function isStepAnswered(step: CalculatorStepView, answers: CalculatorAnswers): boolean {
  if (!step.required) return true;
  if (step.kind === 'RANGE') return answers.budget !== null;
  return (answers.choices[step.key]?.length ?? 0) > 0;
}

export function calculateEstimate(
  config: CalculatorView,
  answers: CalculatorAnswers,
): CalculatorEstimate {
  let addends = 0;
  let multiplier = 1;
  const breakdown: { label: string; value: string }[] = [];

  // Коэффициент по бюджету — из отдельной таблицы порогов.
  const budgetFrom = answers.budget?.from ?? null;
  const budgetTo = answers.budget?.to ?? null;
  if (budgetTo !== null) {
    const tier = findBudgetTier(config.budgetTiers, budgetTo);
    if (tier) {
      multiplier *= tier.multiplier;
      addends += tier.addend;
    }
  }

  // Коэффициенты по остальным шагам.
  for (const step of config.steps) {
    if (step.kind === 'RANGE') continue;
    const selected = answers.choices[step.key] ?? [];
    if (!selected.length) continue;

    const options = step.options.filter((o) => selected.includes(o.value));
    if (!options.length) continue;

    // При множественном выборе берём максимальный коэффициент, а не
    // произведение — иначе пять выбранных марок множили бы цену впятеро.
    if (step.kind === 'MULTI') {
      const maxMultiplier = Math.max(...options.map((o) => o.multiplier));
      const maxAddend = Math.max(...options.map((o) => o.addend));
      multiplier *= maxMultiplier;
      addends += maxAddend;
    } else {
      for (const option of options) {
        multiplier *= option.multiplier;
        addends += option.addend;
      }
    }

    breakdown.push({ label: step.title, value: options.map((o) => o.label).join(', ') });
  }

  const raw = (config.baseFee + addends) * multiplier;
  const price = clamp(
    roundTo(raw, config.roundTo),
    config.minEstimate,
    Math.max(config.minEstimate, config.maxEstimate),
  );

  const spread = Math.max(0, config.spread);
  const priceFrom = clamp(
    roundTo(price * (1 - spread), config.roundTo),
    config.minEstimate,
    config.maxEstimate,
  );
  const priceTo = clamp(
    roundTo(price * (1 + spread), config.roundTo),
    config.minEstimate,
    config.maxEstimate,
  );

  const reserve =
    budgetTo !== null ? roundTo(budgetTo * Math.max(0, config.reserveShare), config.roundTo) : null;

  return { price, priceFrom, priceTo, budgetFrom, budgetTo, reserve, breakdown };
}

/** Компактное представление ответов для сохранения в Lead.calculatorData. */
export function serializeAnswers(
  config: CalculatorView,
  answers: CalculatorAnswers,
  estimate: CalculatorEstimate,
) {
  return {
    budget: answers.budget,
    choices: config.steps
      .filter((s) => s.kind !== 'RANGE')
      .map((step) => {
        const selected = answers.choices[step.key] ?? [];
        return {
          key: step.key,
          question: step.title,
          values: selected,
          labels: step.options.filter((o) => selected.includes(o.value)).map((o) => o.label),
        };
      })
      .filter((c) => c.values.length > 0),
    estimate: {
      price: estimate.price,
      priceFrom: estimate.priceFrom,
      priceTo: estimate.priceTo,
      reserve: estimate.reserve,
    },
    calculatedAt: new Date().toISOString(),
  };
}
