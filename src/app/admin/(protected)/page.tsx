import Link from 'next/link';
import { AlertTriangle, ArrowRight, Database } from 'lucide-react';

import { prisma } from '@/lib/db';
import { AdminCard, PageHeader } from '@/components/admin/ui';
import { formatDateTimeRu } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await prisma
    .$transaction([
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.lead.count({ where: { status: 'DONE' } }),
      prisma.lead.count(),
      prisma.deliveredCar.count({ where: { isDemo: true } }),
      prisma.testimonial.count({ where: { isDemo: true } }),
      prisma.caseStudy.count({ where: { isDemo: true } }),
    ])
    .catch(() => null);

  const recent = await prisma.lead
    .findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
    .catch(() => []);

  const [newCount, inProgress, done, total, demoCars, demoTestimonials, demoCases] = stats ?? [
    0, 0, 0, 0, 0, 0, 0,
  ];
  const demoTotal = demoCars + demoTestimonials + demoCases;

  return (
    <>
      <PageHeader
        title="Сводка"
        description="Заявки, состояние контента и то, что нужно заменить перед публикацией."
      />

      {!stats && (
        <AdminCard className="mb-5 flex items-start gap-3 border-brand/30 bg-brand/4 p-4">
          <Database className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
          <div className="text-[0.8125rem] leading-relaxed text-black/70">
            <p className="font-semibold text-black">Нет связи с базой данных</p>
            <p className="mt-1">
              Сайт сейчас отдаёт содержимое по умолчанию из{' '}
              <code className="rounded-[2px] bg-black/6 px-1">src/content/defaults.ts</code>.
              Проверьте переменную <code className="rounded-[2px] bg-black/6 px-1">DATABASE_URL</code>{' '}
              и выполните <code className="rounded-[2px] bg-black/6 px-1">npm run db:deploy</code>.
            </p>
          </div>
        </AdminCard>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Новые заявки', value: newCount, accent: true },
          { label: 'В работе', value: inProgress },
          { label: 'Завершено', value: done },
          { label: 'Всего заявок', value: total },
        ].map((card) => (
          <AdminCard key={card.label} className="p-5">
            <p className="text-[0.75rem] uppercase tracking-[0.1em] text-black/45">{card.label}</p>
            <p
              className={`mt-2 text-3xl font-bold tabular ${card.accent ? 'text-brand' : 'text-black'}`}
            >
              {card.value}
            </p>
          </AdminCard>
        ))}
      </div>

      {demoTotal > 0 && (
        <AdminCard className="mt-5 flex items-start gap-3 border-amber-300/60 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
          <div className="text-[0.8125rem] leading-relaxed text-black/70">
            <p className="font-semibold text-black">
              Демонстрационные данные на сайте: {demoTotal}
            </p>
            <p className="mt-1">
              Автомобили — {demoCars}, отзывы — {demoTestimonials}, разборы — {demoCases}. Их нужно
              заменить реальными или отключить до публикации.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-3">
              <Link href="/admin/cars" className="font-medium text-brand hover:underline">
                Автомобили
              </Link>
              <Link href="/admin/testimonials" className="font-medium text-brand hover:underline">
                Отзывы
              </Link>
              <Link href="/admin/cases" className="font-medium text-brand hover:underline">
                Разборы
              </Link>
            </div>
          </div>
        </AdminCard>
      )}

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Последние заявки</h2>
          <Link
            href="/admin/leads"
            className="flex items-center gap-1.5 text-[0.8125rem] font-medium text-brand hover:underline"
          >
            Все заявки
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>

        <AdminCard>
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-black/45">Заявок пока нет.</p>
          ) : (
            <ul className="divide-y divide-black/8">
              {recent.map((lead) => (
                <li key={lead.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                  <span className="text-[0.875rem] font-medium">{lead.name}</span>
                  <span className="tabular text-[0.875rem] text-black/60">{lead.phone}</span>
                  <span className="ml-auto text-[0.75rem] text-black/40">
                    {formatDateTimeRu(lead.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </section>
    </>
  );
}
