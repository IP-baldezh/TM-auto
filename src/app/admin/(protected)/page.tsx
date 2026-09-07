import Link from 'next/link';
import { AlertTriangle, ArrowRight, Database } from 'lucide-react';

import { prisma } from '@/lib/db';
import { AdminCard, PageHeader } from '@/components/admin/ui';
import { formatDateTimeRu } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const STATUS_LABEL: Record<string, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  DONE: 'Готово',
  SPAM: 'Спам',
};

const STATUS_COLOR: Record<string, string> = {
  NEW: 'bg-brand/10 text-brand',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  DONE: 'bg-green-100 text-green-700',
  SPAM: 'bg-black/6 text-black/40',
};

export default async function DashboardPage() {
  const stats = await prisma
    .$transaction([
      prisma.lead.count({ where: { status: 'NEW' } }),
      prisma.lead.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.lead.count({ where: { status: 'DONE' } }),
      prisma.lead.count(),
      prisma.deliveredCar.count({ where: { isDemo: true } }),
      prisma.testimonial.count({ where: { isDemo: true } }),
    ])
    .catch(() => null);

  const recent = await prisma.lead
    .findMany({ orderBy: { createdAt: 'desc' }, take: 8 })
    .catch(() => []);

  const [newCount = 0, inProgress = 0, done = 0, total = 0, demoCars = 0, demoTestimonials = 0] =
    stats ?? [];

  const demoTotal = demoCars + demoTestimonials;

  return (
    <>
      <PageHeader title="Сводка" />

      {/* Нет БД */}
      {!stats && (
        <AdminCard className="mb-6 flex items-start gap-3 border-brand/25 bg-brand/[0.04] p-4">
          <Database className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
          <div className="text-[13px] leading-relaxed text-black/65">
            <p className="font-semibold text-black">Нет связи с базой данных</p>
            <p className="mt-1">
              Проверьте <code className="rounded bg-black/6 px-1">DATABASE_URL</code> и выполните{' '}
              <code className="rounded bg-black/6 px-1">npm run db:deploy</code>.
            </p>
          </div>
        </AdminCard>
      )}

      {/* Статистика */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: 'Новые', value: newCount, red: true },
          { label: 'В работе', value: inProgress },
          { label: 'Завершено', value: done },
          { label: 'Всего', value: total },
        ].map((s) => (
          <Link key={s.label} href="/admin/leads">
            <AdminCard className="p-5 transition-shadow hover:shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wide text-black/40">{s.label}</p>
              <p className={`mt-2 text-3xl font-bold tabular ${s.red ? 'text-brand' : 'text-black'}`}>
                {s.value}
              </p>
            </AdminCard>
          </Link>
        ))}
      </div>

      {/* Демо-данные */}
      {demoTotal > 0 && (
        <AdminCard className="mt-4 flex items-start gap-3 border-amber-300/50 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
          <div className="text-[13px] text-black/65">
            <p className="font-semibold text-black">На сайте демо-данные: {demoTotal} записей</p>
            <p className="mt-0.5">
              Автомобили — {demoCars}, отзывы — {demoTestimonials}. Замените на реальные до публикации.
            </p>
            <div className="mt-2 flex gap-4">
              <Link href="/admin/cars" className="font-medium text-brand hover:underline">Автомобили →</Link>
              <Link href="/admin/testimonials" className="font-medium text-brand hover:underline">Отзывы →</Link>
            </div>
          </div>
        </AdminCard>
      )}

      {/* Последние заявки */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">Последние заявки</h2>
          <Link
            href="/admin/leads"
            className="flex items-center gap-1 text-[13px] text-brand hover:underline"
          >
            Все <ArrowRight className="size-3.5" />
          </Link>
        </div>

        <AdminCard>
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-center text-[13px] text-black/35">Заявок пока нет</p>
          ) : (
            <ul className="divide-y divide-black/[0.06]">
              {recent.map((lead) => (
                <li key={lead.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{lead.name}</p>
                    <p className="text-[12px] text-black/45">{lead.phone}</p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_COLOR[lead.status] ?? 'bg-black/6 text-black/50'}`}
                  >
                    {STATUS_LABEL[lead.status] ?? lead.status}
                  </span>
                  <span className="shrink-0 text-[11px] text-black/30">
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
