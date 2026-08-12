'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Loader2, RotateCcw } from 'lucide-react';

import type { CalculatorView } from '@/lib/content';
import {
  calculateEstimate,
  createEmptyAnswers,
  isStepAnswered,
  type CalculatorAnswers,
} from '@/lib/calculator/engine';
import { Button } from '@/components/ui/Button';
import { LeadFields } from '@/components/forms/LeadFields';
import { useLeadForm } from '@/components/forms/useLeadForm';
import { cn, formatMoney } from '@/lib/utils';

import { BudgetStep } from './steps/BudgetStep';
import { OptionsStep } from './steps/OptionsStep';
import { useCountUp } from './useCountUp';

export function Calculator({
  config,
  privacyUrl,
  consentUrl,
}: {
  config: CalculatorView;
  privacyUrl: string;
  consentUrl: string;
}) {
  const steps = config.steps;
  const [stepIndex, setStepIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<CalculatorAnswers>(() => createEmptyAnswers(steps));
  const headingRef = useRef<HTMLHeadingElement>(null);

  const form = useLeadForm('CALCULATOR');

  const estimate = useMemo(() => calculateEstimate(config, answers), [config, answers]);
  const animatedPrice = useCountUp(showResult ? estimate.price : 0);

  if (!steps.length) return null;

  const step = steps[stepIndex];
  const canAdvance = step ? isStepAnswered(step, answers) : false;
  const isLast = stepIndex === steps.length - 1;
  const progress = showResult ? 100 : (stepIndex / steps.length) * 100;

  // Фокус переносится на заголовок шага — иначе при работе с клавиатуры
  // после «Далее» непонятно, где ты находишься.
  const focusHeading = () => {
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const goNext = () => {
    if (!canAdvance) return;
    if (isLast) {
      setShowResult(true);
    } else {
      setStepIndex((i) => i + 1);
    }
    focusHeading();
  };

  const goBack = () => {
    if (showResult) {
      setShowResult(false);
    } else if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    }
    focusHeading();
  };

  const restart = () => {
    setAnswers(createEmptyAnswers(steps));
    setStepIndex(0);
    setShowResult(false);
    form.reset();
    focusHeading();
  };

  const setChoice = (key: string, values: string[]) =>
    setAnswers((prev) => ({ ...prev, choices: { ...prev.choices, [key]: values } }));

  // ── Успешная отправка ──────────────────────────────────────────────────
  if (form.status === 'success') {
    return (
      <div className="rounded-[4px] border border-line bg-white p-8 text-center sm:p-14">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-brand text-white">
          <Check className="size-7" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h3 className="mt-6 text-2xl font-bold tracking-[-0.02em]">{config.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-[0.9375rem] leading-relaxed text-steel">
          {config.successText}
        </p>
        <Button variant="outline" size="md" className="mt-8" onClick={restart}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Рассчитать ещё раз
        </Button>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[4px] border border-line bg-white">
      {/* Полоса прогресса */}
      <div className="h-[3px] w-full bg-paper-3">
        <div
          className="h-full bg-brand transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-12">
        {/* ── Список шагов ────────────────────────────────────────────── */}
        <nav
          aria-label="Шаги расчёта"
          className="border-b border-line bg-paper px-5 py-5 lg:col-span-4 lg:border-b-0 lg:border-r lg:px-7 lg:py-9 xl:col-span-3"
        >
          <ol className="flex gap-4 overflow-x-auto no-scrollbar lg:flex-col lg:gap-0 lg:overflow-visible">
            {steps.map((item, index) => {
              const done = showResult || index < stepIndex;
              const current = !showResult && index === stepIndex;
              return (
                <li key={item.id} className="shrink-0 lg:shrink lg:border-b lg:border-line/70 lg:last:border-0">
                  <button
                    type="button"
                    onClick={() => {
                      // Назад — свободно, вперёд — только по пройденным шагам.
                      if (index <= stepIndex) {
                        setShowResult(false);
                        setStepIndex(index);
                        focusHeading();
                      }
                    }}
                    disabled={index > stepIndex}
                    aria-current={current ? 'step' : undefined}
                    className={cn(
                      'flex w-full items-center gap-2.5 py-2 text-left transition-colors lg:gap-3 lg:py-3.5',
                      index > stepIndex ? 'cursor-default' : 'cursor-pointer',
                    )}
                  >
                    <span
                      className={cn(
                        'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                        current && 'border-brand bg-brand text-white',
                        done && !current && 'border-ink bg-ink text-paper',
                        !current && !done && 'border-line-strong text-steel-2',
                      )}
                      aria-hidden="true"
                    >
                      {done && !current ? (
                        <Check className="size-2.5" strokeWidth={3.5} />
                      ) : (
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            current ? 'bg-white' : 'bg-line-strong',
                          )}
                        />
                      )}
                    </span>
                    <span
                      className={cn(
                        'hidden text-[0.8125rem] leading-snug lg:block',
                        current ? 'font-semibold text-ink' : 'text-steel',
                      )}
                    >
                      {item.title}
                    </span>
                  </button>
                </li>
              );
            })}

            <li className="shrink-0 lg:pt-3.5">
              <div className="flex items-center gap-2.5 lg:gap-3">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border',
                    showResult
                      ? 'border-brand bg-brand text-white'
                      : 'border-line-strong text-steel-2',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      showResult ? 'bg-white' : 'bg-line-strong',
                    )}
                  />
                </span>
                <span
                  className={cn(
                    'hidden text-[0.8125rem] lg:block',
                    showResult ? 'font-semibold text-ink' : 'text-steel',
                  )}
                >
                  Результат
                </span>
              </div>
            </li>
          </ol>
        </nav>

        {/* ── Содержимое шага ─────────────────────────────────────────── */}
        <div className="min-w-0 p-5 sm:p-8 lg:col-span-8 lg:p-10 xl:col-span-9">
          {!showResult && step ? (
            <div key={step.id} className="animate-[fadeStep_.35s_var(--ease-out-quart)]">
              <p className="mb-3 text-[0.8125rem] text-steel-2">
                Шаг {stepIndex + 1} из {steps.length}
              </p>
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="text-[clamp(1.35rem,2.4vw,1.9rem)] leading-[1.12] outline-none"
              >
                {step.title}
              </h3>
              {step.hint && <p className="mt-2 text-[0.9375rem] text-steel">{step.hint}</p>}

              <div className="mt-7">
                {step.kind === 'RANGE' && step.rangeConfig ? (
                  <BudgetStep
                    config={step.rangeConfig}
                    title={step.title}
                    value={answers.budget ?? {
                      from: step.rangeConfig.defaultFrom,
                      to: step.rangeConfig.defaultTo,
                    }}
                    onChange={(budget) => setAnswers((prev) => ({ ...prev, budget }))}
                  />
                ) : (
                  <OptionsStep
                    step={step}
                    selected={answers.choices[step.key] ?? []}
                    onChange={(values) => setChoice(step.key, values)}
                  />
                )}
              </div>

              <div className="mt-9 flex items-center justify-between gap-4 border-t border-line pt-6">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={goBack}
                  disabled={stepIndex === 0}
                  className={cn(stepIndex === 0 && 'invisible')}
                >
                  <ArrowLeft className="size-4" aria-hidden="true" />
                  Назад
                </Button>

                <Button variant="primary" size="md" onClick={goNext} disabled={!canAdvance}>
                  {isLast ? 'Показать расчёт' : 'Далее'}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-[fadeStep_.4s_var(--ease-out-quart)]">
              <h3
                ref={headingRef}
                tabIndex={-1}
                className="text-xl font-bold tracking-[-0.02em] outline-none sm:text-2xl"
              >
                {config.resultTitle}
              </h3>

              {/* ── Числа ─────────────────────────────────────────────── */}
              <div className="mt-7 grid gap-px overflow-hidden rounded-[3px] bg-line sm:grid-cols-3">
                <div className="bg-paper p-5">
                  <p className="eyebrow text-steel-2">Стоимость услуги</p>
                  <p className="tabular mt-2 text-2xl font-bold tracking-[-0.02em] text-brand sm:text-[1.75rem]">
                    {formatMoney(animatedPrice)}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-steel">
                    ориентир {formatMoney(estimate.priceFrom, false)}–
                    {formatMoney(estimate.priceTo)}
                  </p>
                </div>

                <div className="bg-paper p-5">
                  <p className="eyebrow text-steel-2">Бюджет на автомобиль</p>
                  <p className="tabular mt-2 text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">
                    {estimate.budgetFrom !== null && estimate.budgetTo !== null
                      ? `${formatMoney(estimate.budgetFrom, false)}–${formatMoney(estimate.budgetTo, false)}`
                      : '—'}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-steel">в этом диапазоне начинаем поиск</p>
                </div>

                <div className="bg-paper p-5">
                  <p className="eyebrow text-steel-2">Резерв на обслуживание</p>
                  <p className="tabular mt-2 text-2xl font-bold tracking-[-0.02em] sm:text-[1.75rem]">
                    {estimate.reserve !== null ? formatMoney(estimate.reserve, false) : '—'}
                  </p>
                  <p className="mt-1 text-[0.8125rem] text-steel">рекомендуемый запас</p>
                </div>
              </div>

              {config.resultNote && (
                <p className="mt-4 text-[0.8125rem] leading-relaxed text-steel">
                  {config.resultNote}
                </p>
              )}

              {/* ── Расшифровка ответов ───────────────────────────────── */}
              {estimate.breakdown.length > 0 && (
                <dl className="mt-7 divide-y divide-line border-y border-line">
                  {estimate.breakdown.map((row) => (
                    <div key={row.label} className="flex flex-wrap gap-x-6 gap-y-1 py-3">
                      <dt className="min-w-[14rem] flex-1 text-[0.8125rem] text-steel">
                        {row.label}
                      </dt>
                      <dd className="text-[0.8125rem] font-medium">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* ── Контактные данные ─────────────────────────────────── */}
              <form
                className="relative mt-8"
                noValidate
                onSubmit={(event) => {
                  event.preventDefault();
                  void form.submit(answers);
                }}
              >
                <p className="mb-4 text-[0.9375rem] font-semibold">
                  Оставьте контакты — пришлём подходящие варианты
                </p>

                <LeadFields
                  form={form}
                  privacyUrl={privacyUrl}
                  consentUrl={consentUrl}
                />

                {form.error && (
                  <p role="alert" className="mt-4 text-[0.8125rem] text-brand">
                    {form.error}
                  </p>
                )}

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={form.status === 'submitting'}
                  >
                    {form.status === 'submitting' && (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    )}
                    {config.ctaLabel}
                  </Button>
                  <Button type="button" variant="ghost" size="md" onClick={goBack}>
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Изменить параметры
                  </Button>
                </div>
              </form>

              <p className="mt-7 border-t border-line pt-5 text-[0.75rem] leading-relaxed text-steel-2">
                {config.disclaimer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
