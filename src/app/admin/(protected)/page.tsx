import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Car,
  Database,
  FileText,
  Gauge,
  LayoutGrid,
  ListOrdered,
  Menu,
  MessageSquareQuote,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Wrench,
} from 'lucide-react';

import { prisma } from '@/lib/db';
import { AdminCard, PageHeader } from '@/components/admin/ui';
import { formatDateTimeRu } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const SITE_BLOCKS = [
  { href: '/admin/hero', label: 'Главный экран', icon: Sparkles, desc: 'Заголовок, фото, кнопки' },
  { href: '/admin/promotions', label: 'Акции', icon: Tag, desc: 'Карточки акций' },
  { href: '/admin/services', label: 'Услуги', icon: Wrench, desc: 'Перечень услуг' },
  { href: '/admin/process', label: 'Как мы работаем', icon: ListOrdered, desc: 'Этапы работы' },
  { href: '/admin/inspection', label: 'Что проверяем', icon: Search, desc: 'Чек-лист осмотра' },
  { href: '/admin/calculator', label: 'Калькулятор', icon: Gauge, desc: 'Шаги и коэффициенты' },
  { href: '/admin/cars', label: 'Автомобили', icon: Car, desc: 'Подобранные авто' },
  { href: '/admin/reasons', label: 'Почему доверяют', icon: ShieldCheck, desc: 'Плитки доверия' },
  { href: '/admin/cases', label: 'Разборы', icon: FileText, desc: 'Проверенные авто' },
  { href: '/admin/testimonials', label: 'Отзывы', icon: Star, desc: 'Отзывы клиентов' },
  { href: '/admin/faq', label: 'Вопросы и ответы', icon: MessageSquareQuote, desc: 'FAQ' },
];

const STRUCTURE_BLOCKS = [
  { href: '/admin/sections', label: 'Секции', icon: LayoutGrid, desc: 'Видимость и заголовки' },
  { href: '/admin/navigation', label: 'Меню', icon: Menu, desc: 'Навигация' },
  { href: '/admin/contacts', label: 'Контакты', icon: Phone, desc: 'Телефоны' },
  { href: '/admin/seo', label: 'SEO', icon: Search, desc: 'Мета-теги' },
  { href: '/admin/settings', label: 'Настройки', icon: Settings, desc: 'Данные компании' },
];

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
        description="Общая картина: заявки, состояние контента, быстрый доступ к блокам."
      />

      {!stats && (
        <AdminCard className="mb-5 flex items-start gap-3 border-brand/30 bg-brand/4 p-4">
          <Database className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
          <div className="text-[0.8125rem] leading-relaxed text-black/70">
            <p className="font-semibold text-black">Нет связи с базой данных</p>
            <p className="mt-1">
              Сайт отдаёт содержимое по умолчанию из{' '}
              <code className="rounded-[2px] bg-black/6 px-1">src/content/defaults.ts</code>.
              Проверьте <code className="rounded-[2px] bg-black/6 px-1">DATABASE_URL</code> и
              выполните <code className="rounded-[2px] bg-black/6 px-1">npm run db:deploy</code>.
            </p>
          </div>
        </AdminCard>
      )}

      {/* ── Статистика заявок ─────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Новые заявки', value: newCount, accent: true, href: '/admin/leads' },
          { label: 'В работе', value: inProgress, href: '/admin/leads' },
          { label: 'Завершено', value: done, href: '/admin/leads' },
          { label: 'Всего заявок', value: total, href: '/admin/leads' },
        ].map((card) => (
          <Link key={card.label} href={card.href}>
            <AdminCard className="group p-5 transition-shadow hover:shadow-sm">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-black/40">
                {card.label}
              </p>
              <p
                className={`mt-2.5 text-[2rem] font-bold tabular leading-none ${
                  card.accent ? 'text-brand' : 'text-black'
                }`}
              >
                {card.value}
              </p>
            </AdminCard>
          </Link>
        ))}
      </div>

      {/* ── Предупреждение о демо-данных ─────────────────────────────── */}
      {demoTotal > 0 && (
        <AdminCard className="mt-4 flex items-start gap-3 border-amber-300/60 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
          <div className="text-[0.8125rem] leading-relaxed text-black/70">
            <p className="font-semibold text-black">
              Демонстрационные данные на сайте: {demoTotal}
            </p>
            <p className="mt-0.5">
              Автомобили — {demoCars}, отзывы — {demoTestimonials}, разборы — {demoCases}. Замените
              реальными или отключите до публикации.
            </p>
            <div className="mt-2.5 flex flex-wrap gap-3">
              <Link href="/admin/cars" className="font-medium text-brand hover:underline">Автомобили</Link>
              <Link href="/admin/testimonials" className="font-medium text-brand hover:underline">Отзывы</Link>
              <Link href="/admin/cases" className="font-medium text-brand hover:underline">Разборы</Link>
            </div>
          </div>
        </AdminCard>
      )}

      {/* ── Последние заявки ─────────────────────────────────────────── */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[0.9375rem] font-bold">Последние заявки</h2>
          <Link
            href="/admin/leads"
            className="flex items-center gap-1 text-[0.8125rem] font-medium text-brand hover:underline"
          >
            Все заявки
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <AdminCard>
          {recent.length === 0 ? (
            <p className="p-6 text-sm text-black/40">Заявок пока нет.</p>
          ) : (
            <ul className="divide-y divide-black/6">
              {recent.map((lead) => (
                <li key={lead.id} className="flex flex-wrap items-center gap-x-4 gap-y-0.5 px-4 py-3">
                  <span className="text-[0.875rem] font-medium">{lead.name}</span>
                  <span className="tabular text-[0.875rem] text-black/55">{lead.phone}</span>
                  <span className="ml-auto text-[0.75rem] text-black/35">
                    {formatDateTimeRu(lead.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>
      </section>

      {/* ── Блоки сайта ──────────────────────────────────────────────── */}
      <section className="mt-8">
        <h2 className="mb-3 text-[0.9375rem] font-bold">Блоки сайта</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SITE_BLOCKS.map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href}>
              <AdminCard className="flex items-center gap-3 p-3.5 transition-shadow hover:shadow-sm">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-[4px]"
                  style={{ background: 'rgba(198,15,19,0.08)' }}
                >
                  <Icon className="size-[15px] text-brand" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.8125rem] font-semibold text-black">{label}</p>
                  <p className="truncate text-[0.6875rem] text-black/40">{desc}</p>
                </div>
              </AdminCard>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Структура и настройки ────────────────────────────────────── */}
      <section className="mt-5">
        <h2 className="mb-3 text-[0.9375rem] font-bold">Структура и настройки</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {STRUCTURE_BLOCKS.map(({ href, label, icon: Icon, desc }) => (
            <Link key={href} href={href}>
              <AdminCard className="flex items-center gap-3 p-3.5 transition-shadow hover:shadow-sm">
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-[4px]"
                  style={{ background: 'rgba(0,0,0,0.05)' }}
                >
                  <Icon className="size-[15px] text-black/50" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[0.8125rem] font-semibold text-black">{label}</p>
                  <p className="truncate text-[0.6875rem] text-black/40">{desc}</p>
                </div>
              </AdminCard>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
