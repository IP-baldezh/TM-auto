'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Car,
  ExternalLink,
  FileText,
  Gauge,
  Inbox,
  LayoutGrid,
  ListOrdered,
  LogOut,
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
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const NAV = [
  { href: '/admin', label: 'Сводка', icon: Gauge, exact: true },
  { href: '/admin/leads', label: 'Заявки', icon: Inbox },
  { section: 'Контент' },
  { href: '/admin/sections', label: 'Секции и заголовки', icon: LayoutGrid },
  { href: '/admin/hero', label: 'Главный экран', icon: Sparkles },
  { href: '/admin/promotions', label: 'Акции', icon: Tag },
  { href: '/admin/services', label: 'Услуги', icon: Wrench },
  { href: '/admin/inspection', label: 'Что проверяем', icon: ListOrdered },
  { href: '/admin/calculator', label: 'Калькулятор', icon: Gauge },
  { href: '/admin/cars', label: 'Автомобили', icon: Car },
  { href: '/admin/process', label: 'Этапы работы', icon: ListOrdered },
  { href: '/admin/reasons', label: 'Почему доверяют', icon: ShieldCheck },
  { href: '/admin/cases', label: 'Разборы', icon: FileText },
  { href: '/admin/testimonials', label: 'Отзывы', icon: Star },
  { href: '/admin/faq', label: 'Вопросы и ответы', icon: MessageSquareQuote },
  { section: 'Сайт' },
  { href: '/admin/navigation', label: 'Меню', icon: Menu },
  { href: '/admin/contacts', label: 'Контакты', icon: Phone },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
] as const;

export function AdminShell({
  children,
  userName,
  onLogout,
}: {
  children: React.ReactNode;
  userName: string;
  /** Server action — приходит из layout админки. */
  onLogout: () => void | Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-graphite text-paper">
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/8 px-4">
        <span className="text-sm font-bold uppercase tracking-wide">Sunservice</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-white/60 hover:text-white lg:hidden"
          aria-label="Закрыть меню"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        <ul className="space-y-0.5">
          {NAV.map((item, i) => {
            if ('section' in item) {
              return (
                <li
                  key={`s-${i}`}
                  className="px-2.5 pb-1.5 pt-5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/35"
                >
                  {item.section}
                </li>
              );
            }
            const Icon = item.icon;
            const active =
              'exact' in item && item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-[3px] px-2.5 py-2 text-[0.8125rem] transition-colors',
                    active ? 'bg-brand text-white' : 'text-white/70 hover:bg-white/8 hover:text-white',
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="shrink-0 border-t border-white/8 p-3">
        <Link
          href="/"
          target="_blank"
          className="mb-1 flex items-center gap-2.5 rounded-[3px] px-2.5 py-2 text-[0.8125rem] text-white/70 transition-colors hover:bg-white/8 hover:text-white"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Открыть сайт
        </Link>
        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
          <span className="truncate text-[0.75rem] text-white/50">{userName}</span>
          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 text-[0.75rem] text-white/60 transition-colors hover:text-white"
          >
            <LogOut className="size-3.5" aria-hidden="true" />
            Выйти
          </button>
        </div>
      </div>
    </div>
  );

  return (
    // data-admin переключает заголовки на Manrope: широкий дисплейный шрифт
    // мешает плотности служебного интерфейса.
    <div data-admin className="flex min-h-screen bg-[#f6f6f4]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-60">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-black/8 bg-white/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Открыть меню"
            className="flex size-9 items-center justify-center rounded-[3px] border border-black/10"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-semibold">Админ-панель</span>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-9">{children}</main>
      </div>
    </div>
  );
}
