'use client';

import { useId } from 'react';
import type { RangeConfig } from '@/lib/content';
import { cn, formatMoney } from '@/lib/utils';
import { RangeSlider } from '../RangeSlider';

export function BudgetStep({
  config,
  value,
  onChange,
  title,
}: {
  config: RangeConfig;
  value: { from: number; to: number };
  onChange: (next: { from: number; to: number }) => void;
  title: string;
}) {
  const uid = useId();

  const commit = (next: { from: number; to: number }) => {
    const from = Math.min(Math.max(next.from, config.min), config.max - config.step);
    const to = Math.min(Math.max(next.to, from + config.step), config.max);
    onChange({ from, to });
  };

  const isActiveQuick = (quick: { from: number; to: number }) =>
    quick.from === value.from && quick.to === value.to;

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-from`} className="mb-2 block text-[0.8125rem] text-steel">
            От
          </label>
          <div className="relative">
            <input
              id={`${uid}-from`}
              type="text"
              inputMode="numeric"
              className="tabular h-13 w-full rounded-[3px] border border-line-strong bg-white px-4 pr-10 text-lg font-semibold text-ink outline-none transition-colors focus:border-ink"
              value={formatMoney(value.from, false)}
              onChange={(e) => {
                const raw = Number(e.target.value.replace(/\D/g, ''));
                if (!Number.isNaN(raw)) commit({ from: raw, to: value.to });
              }}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-steel-2">
              {config.unit}
            </span>
          </div>
        </div>

        <div>
          <label htmlFor={`${uid}-to`} className="mb-2 block text-[0.8125rem] text-steel">
            До
          </label>
          <div className="relative">
            <input
              id={`${uid}-to`}
              type="text"
              inputMode="numeric"
              className="tabular h-13 w-full rounded-[3px] border border-line-strong bg-white px-4 pr-10 text-lg font-semibold text-ink outline-none transition-colors focus:border-ink"
              value={formatMoney(value.to, false)}
              onChange={(e) => {
                const raw = Number(e.target.value.replace(/\D/g, ''));
                if (!Number.isNaN(raw)) commit({ from: value.from, to: raw });
              }}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-steel-2">
              {config.unit}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <RangeSlider
          min={config.min}
          max={config.max}
          step={config.step}
          from={value.from}
          to={value.to}
          onChange={commit}
          label={title}
        />
      </div>

      {config.quick.length > 0 && (
        <div className="mt-7">
          <p className="eyebrow mb-3 text-steel-2">Быстрый выбор</p>
          <div className="flex flex-wrap gap-2">
            {config.quick.map((quick) => (
              <button
                key={quick.label}
                type="button"
                aria-pressed={isActiveQuick(quick)}
                onClick={() => commit({ from: quick.from, to: quick.to })}
                className={cn(
                  'rounded-[3px] border px-3.5 py-2 text-[0.8125rem] font-medium transition-colors',
                  isActiveQuick(quick)
                    ? 'border-brand bg-brand text-white'
                    : 'border-line-strong bg-white text-steel hover:border-ink hover:text-ink',
                )}
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
