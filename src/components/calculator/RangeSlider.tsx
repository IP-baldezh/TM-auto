'use client';

import { useId } from 'react';
import { formatMoneyShort } from '@/lib/utils';

/**
 * Диапазон бюджета: два нативных input[type=range] друг над другом.
 *
 * Нативные элементы выбраны сознательно — они дают работу с клавиатуры,
 * корректные роли для скринридеров и поведение на тач-экранах без
 * единой строчки собственной обработки жестов.
 */
export function RangeSlider({
  min,
  max,
  step,
  from,
  to,
  onChange,
  label,
}: {
  min: number;
  max: number;
  step: number;
  from: number;
  to: number;
  onChange: (next: { from: number; to: number }) => void;
  label: string;
}) {
  const uid = useId();
  const span = Math.max(1, max - min);
  const leftPct = ((from - min) / span) * 100;
  const rightPct = ((to - min) / span) * 100;

  const handleFrom = (value: number) => {
    onChange({ from: Math.min(value, to - step), to });
  };
  const handleTo = (value: number) => {
    onChange({ from, to: Math.max(value, from + step) });
  };

  return (
    <div className="pt-2">
      <div className="relative h-9">
        <div className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-line-strong" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-brand"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />

        <input
          id={`${uid}-from`}
          className="range-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={from}
          aria-label={`${label}: минимум`}
          aria-valuetext={formatMoneyShort(from)}
          onChange={(e) => handleFrom(Number(e.target.value))}
        />
        <input
          id={`${uid}-to`}
          className="range-input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={to}
          aria-label={`${label}: максимум`}
          aria-valuetext={formatMoneyShort(to)}
          onChange={(e) => handleTo(Number(e.target.value))}
        />
      </div>

      <div className="mt-1 flex justify-between text-[0.75rem] text-steel-2">
        <span>{formatMoneyShort(min)}</span>
        <span>{formatMoneyShort(max)}</span>
      </div>
    </div>
  );
}
