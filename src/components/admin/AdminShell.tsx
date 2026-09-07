'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Car,
  ChevronRight,
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

type NavItem =
  | { section: string }
  | { href: string; label: string; icon: React.ElementType; exact?: boolean };

const NAV: NavItem[] = [
  { href: '/admin', label: 'Сводка', icon: Gauge, exact: true },
  { href: '/admin/leads', label: 'Заявки', icon: Inbox },

  { section: 'Блоки сайта' },
  { href: '/admin/hero', label: 'Главный экран', icon: Sparkles },
  { href: '/admin/promotions', label: 'Акции', icon: Tag },
  { href: '/admin/services', label: 'Как мы работаем', icon: Wrench },
  { href: '/admin/calculator', label: 'Калькулятор', icon: Gauge },
  { href: '/admin/cars', label: 'Автомобили', icon: Car },
  { href: '/admin/reasons', label: 'Почему доверяют', icon: ShieldCheck },
  { href: '/admin/process', label: 'Этапы работы', icon: ListOrdered },
  { href: '/admin/testimonials', label: 'Отзывы', icon: Star },
  { href: '/admin/faq', label: 'Вопросы и ответы', icon: MessageSquareQuote },

  { section: 'Сайт' },
  { href: '/admin/sections', label: 'Секции', icon: LayoutGrid },
  { href: '/admin/navigation', label: 'Меню', icon: Menu },
  { href: '/admin/contacts', label: 'Контакты', icon: Phone },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
];

export function AdminShell({
  children,
  userName,
  onLogout,
}: {
  children: React.ReactNode;
  userName: string;
  onLogout: () => void | Promise<void>;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-[#111317] text-white">
      {/* Шапка */}
      <div className="flex h-[52px] shrink-0 items-center gap-3 border-b border-white/[0.07] px-4">
        <span className="flex size-7 shrink-0 items-center justify-center rounded bg-brand text-[10px] font-black">
          ТМ
        </span>
        <span className="text-[13px] font-semibold tracking-[-0.01em]">ТМ Авто</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto text-white/40 hover:text-white lg:hidden"
          aria-label="Закрыть меню"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Навигация */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <ul>
          {NAV.map((item, i) => {
            if ('section' in item) {
              return (
                <li
                  key={`s-${i}`}
                  className="mt-4 px-2 pb-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/30 first:mt-1"
                >
                  {item.section}
                </li>
              );
            }

            const Icon = item.icon;
            const active =
              'exact' in item && item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-[4px] px-2.5 py-[6px] text-[13px] transition-colors',
                    active
                      ? 'bg-white/[0.09] font-medium text-white'
                      : 'text-white/55 hover:bg-white/[0.05] hover:text-white/90',
                  )}
                >
                  <Icon
                    className={cn('size-[14px] shrink-0', active ? 'text-brand' : 'text-white/40')}
                    aria-hidden="true"
                  />
                  {item.label}
                  {active && <ChevronRight className="ml-auto size-3 text-white/25" aria-hidden="true" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Подвал */}
      <div className="shrink-0 border-t border-white/[0.07] p-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-[4px] px-2.5 py-[6px] text-[13px] text-white/40 transition-colors hover:bg-white/[0.05] hover:text-white/80"
        >
          <ExternalLink className="size-[14px] shrink-0" aria-hidden="true" />
          Открыть сайт
        </Link>

        <div className="mt-1 flex items-center gap-2 rounded-[4px] bg-white/[0.05] px-2.5 py-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand text-[10px] font-bold uppercase">
            {userName.slice(0, 2)}
          </span>
          <span className="min-w-0 flex-1 truncate text-[12px] text-white/45">{userName}</span>
          <button
            type="button"
            onClick={onLogout}
            title="Выйти"
            className="shrink-0 text-white/30 transition-colors hover:text-white/80"
          >
            <LogOut className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div data-admin className="flex min-h-screen bg-[#f5f5f3]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-52 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-52">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-52">
        <header className="sticky top-0 z-20 flex h-[52px] items-center gap-3 border-b border-black/[0.07] bg-[#f5f5f3]/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Открыть меню"
            className="flex size-8 items-center justify-center rounded-[4px] border border-black/[0.1]"
          >
            <Menu className="size-4" />
          </button>
          <span className="text-[13px] font-semibold">Панель управления</span>
        </header>

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
