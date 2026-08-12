import { prisma } from '@/lib/db';
import { DEFAULT_CALCULATOR } from '@/content/defaults';
import { ENTITIES } from '@/lib/admin/entities';
import { loadEntity } from '@/lib/admin/queries';
import { SingletonPage } from '@/components/admin/SingletonPage';
import { CollectionEditor } from '@/components/admin/CollectionEditor';
import { AdminCard } from '@/components/admin/ui';
import { StepOptionsEditor } from './StepOptionsEditor';

export const dynamic = 'force-dynamic';

export default async function CalculatorAdminPage() {
  const [config, steps, tiers, options] = await Promise.all([
    prisma.calculatorConfig.findUnique({ where: { id: 'calculator' } }).catch(() => null),
    loadEntity('calculatorSteps'),
    loadEntity('budgetTiers'),
    loadEntity('calculatorOptions'),
  ]);

  return (
    <SingletonPage
      singleton="calculator"
      missing={!config}
      values={(config ?? DEFAULT_CALCULATOR) as unknown as Record<string, unknown>}
    >
      <section className="mt-10">
        <h2 className="mb-1.5 text-lg font-bold">Пороги по бюджету</h2>
        <p className="mb-4 max-w-3xl text-[0.8125rem] text-black/55">
          Коэффициент выбирается по верхней границе бюджета, который указал посетитель. Строка без
          суммы работает как «и выше».
        </p>
        <CollectionEditor
          entity="budgetTiers"
          fields={ENTITIES.budgetTiers.fields}
          items={tiers}
          titleField="label"
          singular="порог"
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-1.5 text-lg font-bold">Шаги калькулятора</h2>
        <p className="mb-4 max-w-3xl text-[0.8125rem] text-black/55">
          Шаг типа «Диапазон» — это выбор бюджета ползунком; его варианты ответа не используются,
          коэффициенты берутся из порогов выше.
        </p>
        <CollectionEditor
          entity="calculatorSteps"
          fields={ENTITIES.calculatorSteps.fields}
          items={steps}
          titleField="title"
          singular="шаг"
        />
      </section>

      <section className="mt-10">
        <h2 className="mb-1.5 text-lg font-bold">Варианты ответа</h2>
        <p className="mb-4 max-w-3xl text-[0.8125rem] text-black/55">
          Итог = (базовая стоимость + сумма надбавок) × произведение коэффициентов. При
          множественном выборе берётся наибольший коэффициент, а не произведение.
        </p>

        {steps.length === 0 ? (
          <AdminCard className="p-6 text-sm text-black/50">
            Сначала добавьте шаги калькулятора.
          </AdminCard>
        ) : (
          <StepOptionsEditor steps={steps} options={options} />
        )}
      </section>
    </SingletonPage>
  );
}
