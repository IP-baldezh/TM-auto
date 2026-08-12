'use client';

import { useId, useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';

import type { CalculatorStepView } from '@/lib/content';
import { cn } from '@/lib/utils';

/**
 * Варианты ответа — нативные radio/checkbox внутри fieldset.
 *
 * Внешне это карточки, но управление остаётся штатным: стрелки переключают
 * радиогруппу, пробел отмечает чекбокс, скринридер объявляет группу
 * и состояние. Собственные роли и обработчики клавиш не нужны.
 */
export function OptionsStep({
  step,
  selected,
  onChange,
}: {
  step: CalculatorStepView;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const uid = useId();
  const [query, setQuery] = useState('');
  const multiple = step.kind === 'MULTI';

  const options = useMemo(() => {
    if (!step.searchable || !query.trim()) return step.options;
    const q = query.trim().toLowerCase();
    return step.options.filter((o) => o.label.toLowerCase().includes(q));
  }, [step.options, step.searchable, query]);

  const toggle = (value: string) => {
    if (!multiple) {
      onChange([value]);
      return;
    }
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  };

  const columns = multiple
    ? 'grid-cols-2 sm:grid-cols-3'
    : step.options.some((o) => o.hint)
      ? 'grid-cols-1 sm:grid-cols-2'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <fieldset className="min-w-0">
      <legend className="sr-only">{step.title}</legend>

      {step.searchable && (
        <div className="relative mb-5">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel-2"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Найти марку"
            aria-label="Поиск по маркам"
            className="h-11 w-full rounded-[3px] border border-line-strong bg-white pl-10 pr-4 text-[0.9375rem] outline-none transition-colors placeholder:text-steel-2 focus:border-ink"
          />
        </div>
      )}

      <div className={cn('grid gap-2.5', columns)}>
        {options.map((option) => {
          const isSelected = selected.includes(option.value);
          const id = `${uid}-${option.value}`;
          return (
            <label
              key={option.id}
              htmlFor={id}
              className={cn(
                'group relative flex cursor-pointer items-start gap-3 rounded-[3px] border p-3.5 transition-colors',
                'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand',
                isSelected
                  ? 'border-ink bg-ink text-paper'
                  : 'border-line-strong bg-white text-ink hover:border-steel-2',
              )}
            >
              <input
                id={id}
                type={multiple ? 'checkbox' : 'radio'}
                name={multiple ? `${uid}-${option.value}` : uid}
                value={option.value}
                checked={isSelected}
                onChange={() => toggle(option.value)}
                className="sr-only"
              />

              <span
                className={cn(
                  'mt-px flex size-5 shrink-0 items-center justify-center border transition-colors',
                  multiple ? 'rounded-[3px]' : 'rounded-full',
                  isSelected ? 'border-brand bg-brand' : 'border-line-strong bg-white',
                )}
                aria-hidden="true"
              >
                {isSelected &&
                  (multiple ? (
                    <Check className="size-3 text-white" strokeWidth={3} />
                  ) : (
                    <span className="size-2 rounded-full bg-white" />
                  ))}
              </span>

              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-medium leading-snug">
                  {option.label}
                </span>
                {option.hint && (
                  <span
                    className={cn(
                      'mt-1 block text-[0.8125rem] leading-snug',
                      isSelected ? 'text-paper/65' : 'text-steel',
                    )}
                  >
                    {option.hint}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {options.length === 0 && (
        <p className="py-6 text-center text-sm text-steel">
          Ничего не нашлось. Оставьте поле пустым — обсудим марки на консультации.
        </p>
      )}
    </fieldset>
  );
}
