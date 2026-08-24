'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';

import type { CalculatorView } from '@/lib/content';
import {
  calculateEstimate,
  createEmptyAnswers,
  isStepAnswered,
  type CalculatorAnswers,
} from '@/lib/calculator/engine';
import { LeadFields } from '@/components/forms/LeadFields';
import { useLeadForm } from '@/components/forms/useLeadForm';
import { cn } from '@/lib/utils';
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
  const formRef = useRef<HTMLFormElement>(null);
  const form = useLeadForm('CALCULATOR');
  const estimate = useMemo(() => calculateEstimate(config, answers), [config, answers]);
  useCountUp(showResult ? estimate.price : 0); // сохраняем анимацию в памяти

  if (!steps.length) return null;

  const step = steps[stepIndex];
  const canAdvance = step ? isStepAnswered(step, answers) : false;
  const isLast = stepIndex === steps.length - 1;

  const focus = () => requestAnimationFrame(() => headingRef.current?.focus());

  const goNext = () => {
    if (!canAdvance) return;
    if (isLast) setShowResult(true);
    else setStepIndex((i) => i + 1);
    focus();
  };

  const goBack = () => {
    if (showResult) setShowResult(false);
    else if (stepIndex > 0) setStepIndex((i) => i - 1);
    focus();
  };

  const restart = () => {
    setAnswers(createEmptyAnswers(steps));
    setStepIndex(0);
    setShowResult(false);
    form.reset();
    focus();
  };

  const setChoice = (key: string, vals: string[]) =>
    setAnswers((prev) => ({ ...prev, choices: { ...prev.choices, [key]: vals } }));

  const toggleOption = (key: string, value: string, single: boolean) => {
    if (single) {
      setChoice(key, [value]);
    } else {
      const cur = answers.choices[key] ?? [];
      setChoice(key, cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]);
    }
  };

  /* ── Успех после отправки ────────────────────────────────────────── */
  if (form.status === 'success') {
    return (
      <QuizCard>
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-brand text-white">
            <Check className="size-8" strokeWidth={2.5} />
          </span>
          <div>
            <h3 className="text-2xl font-bold">{config.successTitle}</h3>
            <p className="mx-auto mt-2 max-w-sm text-[0.9375rem] text-steel">{config.successText}</p>
          </div>
          <button
            type="button"
            onClick={restart}
            className="rounded-full border border-line px-8 py-3 text-[0.875rem] font-semibold text-ink transition hover:border-ink"
          >
            Рассчитать ещё раз
          </button>
        </div>
      </QuizCard>
    );
  }

  return (
    <QuizCard>
      {/* Прогресс */}
      <div className="h-0.5 bg-line">
        <div
          className="h-full bg-brand transition-[width] duration-500"
          style={{ width: `${showResult ? 100 : Math.round((stepIndex / steps.length) * 100)}%` }}
        />
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        {!showResult && step ? (
          /* ── Шаг с вопросом ───────────────────────────────────────── */
          <div key={step.id} className="animate-[fadeStep_.3s_var(--ease-out-quart)]">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.13em] text-brand">
              Вопрос {stepIndex + 1} из {steps.length}
            </p>
            <p className="mt-1 text-[0.875rem] text-steel">
              Ответьте на несколько вопросов и узнайте стоимость авто под заказ
            </p>

            <h3
              ref={headingRef}
              tabIndex={-1}
              className="mt-5 text-[clamp(1.1rem,2.3vw,1.5rem)] font-bold leading-snug tracking-tight outline-none"
            >
              {stepIndex + 1}. {step.title}
            </h3>

            {/* Варианты */}
            <div
              className={cn(
                'mt-5',
                step.kind === 'MULTI'
                  ? 'grid grid-cols-2 gap-x-8 gap-y-3.5 sm:grid-cols-3'
                  : 'flex flex-col gap-2',
              )}
            >
              {step.kind === 'MULTI'
                ? step.options.map((opt) => {
                    const sel = (answers.choices[step.key] ?? []).includes(opt.value);
                    return (
                      <CheckOption
                        key={opt.value}
                        label={opt.label}
                        selected={sel}
                        onClick={() => toggleOption(step.key, opt.value, false)}
                      />
                    );
                  })
                : step.options.map((opt) => {
                    const sel = (answers.choices[step.key] ?? []).includes(opt.value);
                    return (
                      <RadioOption
                        key={opt.value}
                        label={opt.label}
                        hint={opt.hint ?? undefined}
                        selected={sel}
                        onClick={() => toggleOption(step.key, opt.value, true)}
                      />
                    );
                  })}
            </div>

            {/* Навигация */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
              <div>
                {stepIndex > 0 && (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1.5 text-[0.875rem] text-steel transition hover:text-ink"
                  >
                    <ArrowLeft className="size-4" />
                    Назад
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={goNext}
                disabled={!canAdvance}
                className={cn(
                  'rounded-full px-10 py-3.5 text-[1rem] font-bold transition-all',
                  canAdvance
                    ? 'bg-ink text-white hover:bg-graphite'
                    : 'cursor-not-allowed bg-paper-3 text-steel-2',
                )}
              >
                {isLast ? 'Узнать стоимость' : 'Далее'}
              </button>
            </div>
          </div>
        ) : (
          /* ── Финальный шаг: форма ─────────────────────────────────── */
          <div className="animate-[fadeStep_.4s_var(--ease-out-quart)]">
            <p className="text-[0.875rem] font-semibold text-steel">Все готово!</p>
            <p className="text-[0.875rem] text-steel">Остался последний шаг</p>

            <h3
              ref={headingRef}
              tabIndex={-1}
              className="mt-4 text-[clamp(1.2rem,2.4vw,1.625rem)] font-bold leading-snug tracking-tight outline-none"
            >
              Вы получите{' '}
              <span className="text-brand">индивидуальный расчёт</span>
            </h3>
            <p className="mt-3 max-w-[52ch] text-[0.875rem] leading-relaxed text-steel">
              Оставьте номер телефона, чтобы мы могли связаться с вами, предложить варианты и обсудить детали
            </p>

            <form
              ref={formRef}
              className="mt-6"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                void form.submit(answers);
              }}
            >
              <LeadFields form={form} privacyUrl={privacyUrl} consentUrl={consentUrl} />
              {form.error && (
                <p role="alert" className="mt-3 text-[0.8125rem] text-brand">{form.error}</p>
              )}
            </form>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-line pt-6">
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-1.5 text-[0.875rem] text-steel transition hover:text-ink"
              >
                <ArrowLeft className="size-4" />
                Назад
              </button>

              <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                disabled={form.status === 'submitting'}
                className="rounded-full bg-ink px-10 py-3.5 text-[1rem] font-bold text-white transition hover:bg-graphite disabled:opacity-60"
              >
                {form.status === 'submitting' ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  'Отправить'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </QuizCard>
  );
}

/* ── Карточка с водяным знаком ───────────────────────────────────────────── */

function QuizCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-paper-2 shadow-xl shadow-ink/[0.06]">
      {/* SVG-логотип как водяной знак — правая половина обрезается */}
      <svg
        viewBox="0 0 187 89"
        aria-hidden="true"
        className="pointer-events-none absolute -right-[12%] top-1/2 h-[75%] w-auto -translate-y-1/2 select-none opacity-[0.045]"
        fill="currentColor"
      >
        <path d="M93.0379 0.0988639C133.037 -1.10095 149.371 8.93223 152.538 14.0989L159.538 24.0989C161.205 24.9322 164.538 26.0986 164.538 24.0989C164.038 15.0993 175.038 16.5989 178.038 16.5989C194.536 22.0986 176.538 28.7654 166.538 31.0989V32.0989C176.137 31.2997 181.538 42.099 183.038 47.5989C190.637 75.9971 182.205 86.7646 177.038 88.5989C183.459 67.4459 166.901 72.5706 156.336 78.5403C155.751 78.9041 155.151 79.2581 154.538 79.5989C155.112 79.2468 155.714 78.8917 156.336 78.5403C166.046 72.4993 171.809 63.5286 173.538 59.5989C184.337 34.4003 149.371 54.099 130.538 67.0989L135.038 61.0989C130.638 65.4988 105.205 67.2655 93.0379 67.5989C80.8714 67.2655 55.4385 65.4987 51.0379 61.0989L55.5379 67.0989C36.7046 54.0989 1.73804 34.399 12.5379 59.5989C14.2671 63.5287 20.0286 72.4993 29.7391 78.5403C30.3611 78.8918 30.9633 79.2467 31.5379 79.5989C30.9243 79.258 30.3241 78.9042 29.7391 78.5403C19.1741 72.5704 2.61629 67.445 9.03791 88.5989C3.87125 86.7655 -4.56208 75.9989 3.03791 47.5989C4.53815 42.0987 9.93828 31.2989 19.5379 32.0989V31.0989C9.53791 28.7655 -8.46209 22.0989 8.03791 16.5989C11.0392 16.5986 22.0374 15.1003 21.5379 24.0989C21.5379 26.0989 24.8712 24.9322 26.5379 24.0989L33.5379 14.0989C36.7057 8.93198 53.0398 -1.10108 93.0379 0.0988639ZM155 29.0002C152.833 29.8336 146.2 31.5002 137 31.5002H48.9998C39.8002 31.5002 33.1668 29.8336 30.9998 29.0002L27.4998 33.5002C25.0998 36.7002 26.1665 39.1669 26.9998 40.0002C33.1666 45.0003 46.1999 55.5002 48.9998 57.5002C51.8003 61.1001 79.5 62.0002 92.9998 62.0002C106.5 62.0002 134.2 61.1002 137 57.5002C139.8 55.4997 152.833 45.0001 159 40.0002C159.833 39.1667 160.899 36.6999 158.5 33.5002L155 29.0002ZM66.5379 7.59886C53.3395 7.99882 46.3723 10.7653 44.5379 12.0989C41.8714 14.0988 36.1382 19.199 34.5379 23.5989C32.9379 27.9989 72.8712 29.0989 93.0379 29.0989C113.205 29.0988 153.137 27.9987 151.538 23.5989C149.938 19.1991 144.205 14.099 141.538 12.0989C139.705 10.7655 132.737 7.99894 119.538 7.59886H66.5379Z" />
        <ellipse cx="92.9998" cy="58.5002" rx="3" ry="1.5" />
      </svg>

      {children}
    </div>
  );
}

/* ── Радио-кнопка (одиночный выбор) ─────────────────────────────────────── */

function RadioOption({
  label,
  hint,
  selected,
  onClick,
}: {
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-all',
        selected ? 'border-brand bg-brand/[0.06]' : 'border-line bg-paper-2 hover:border-brand/40',
      )}
    >
      <div>
        <span className="block text-[0.9375rem] font-medium text-ink">{label}</span>
        {hint && <span className="mt-0.5 block text-[0.8125rem] text-steel">{hint}</span>}
      </div>
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
          selected ? 'border-brand bg-brand text-white' : 'border-line-strong',
        )}
      >
        {selected && <Check className="size-2.5" strokeWidth={4} />}
      </span>
    </button>
  );
}

/* ── Чекбокс (мультивыбор, марки) ───────────────────────────────────────── */

function CheckOption({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="flex items-center gap-2.5 text-left transition-colors"
    >
      <span
        className={cn(
          'flex size-[18px] shrink-0 items-center justify-center rounded border-2 transition-all',
          selected ? 'border-brand bg-brand text-white' : 'border-line-strong bg-paper',
        )}
      >
        {selected && <Check className="size-2.5" strokeWidth={4} />}
      </span>
      <span className={cn('text-[0.9375rem]', selected ? 'font-semibold text-ink' : 'text-ink')}>
        {label}
      </span>
    </button>
  );
}
