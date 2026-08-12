'use client';

import { useState } from 'react';

import { ENTITIES } from '@/lib/admin/entities';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
import { AdminCard } from '@/components/admin/ui';
import { cn } from '@/lib/utils';
import type { AdminRow } from '@/lib/admin/queries';

/** Варианты ответа редактируются в разрезе шага — иначе список нечитаем. */
export function StepOptionsEditor({
  steps,
  options,
}: {
  steps: AdminRow[];
  options: AdminRow[];
}) {
  const selectable = steps.filter((step) => step.kind !== 'RANGE');
  const [activeId, setActiveId] = useState<string>(String(selectable[0]?.id ?? ''));

  if (selectable.length === 0) {
    return (
      <AdminCard className="p-6 text-sm text-black/50">
        Нет шагов с вариантами ответа.
      </AdminCard>
    );
  }

  const active = selectable.find((step) => step.id === activeId) ?? selectable[0];
  if (!active) return null;

  const stepOptions = options.filter((option) => option.stepId === active.id);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {selectable.map((step) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveId(String(step.id))}
            aria-pressed={step.id === active.id}
            className={cn(
              'rounded-[3px] border px-3 py-1.5 text-[0.8125rem] transition-colors',
              step.id === active.id
                ? 'border-brand bg-brand text-white'
                : 'border-black/12 bg-white text-black/70 hover:border-black/35',
            )}
          >
            {String(step.title ?? step.key)}
          </button>
        ))}
      </div>

      <CollectionEditor
        key={active.id}
        entity="calculatorOptions"
        fields={ENTITIES.calculatorOptions.fields}
        items={stepOptions}
        titleField="label"
        singular="вариант"
        parentStepId={String(active.id)}
      />
    </div>
  );
}
