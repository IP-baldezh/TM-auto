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
  { href: '/admin/services', label: 'Услуги', icon: Wrench },
  { href: '/admin/process', label: 'Как мы работаем', icon: ListOrdered },
  { href: '/admin/inspection', label: 'Что проверяем', icon: Search },
  { href: '/admin/calculator', label: 'Калькулятор', icon: Gauge },
  { href: '/admin/cars', label: 'Автомобили', icon: Car },
  { href: '/admin/reasons', label: 'Почему доверяют', icon: ShieldCheck },
  { href: '/admin/cases', label: 'Разборы', icon: FileText },
  { href: '/admin/testimonials', label: 'Отзывы', icon: Star },
  { href: '/admin/faq', label: 'Вопросы и ответы', icon: MessageSquareQuote },

  { section: 'Структура' },
  { href: '/admin/sections', label: 'Секции и заголовки', icon: LayoutGrid },
  { href: '/admin/navigation', label: 'Меню', icon: Menu },
  { href: '/admin/contacts', label: 'Контакты', icon: Phone },

  { section: 'Настройки' },
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
    <div className="flex h-full flex-col" style={{ background: '#16181d' }}>
      {/* Логотип */}
      <div className="flex h-14 shrink-0 items-center justify-between px-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <span
            className="flex size-7 shrink-0 items-center justify-center rounded-[4px] text-[0.625rem] font-black text-white"
            style={{ background: '#c60f13' }}
          >
            ТМ
          </span>
          <div>
            <p className="text-[0.8125rem] font-bold leading-none text-white">ТМ Авто</p>
            <p className="mt-0.5 text-[0.625rem] leading-none" style={{ color: 'rgba(255,255,255,0.35)' }}>Панель управления</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="lg:hidden"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          aria-label="Закрыть меню"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Навигация */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-px">
          {NAV.map((item, i) => {
            if ('section' in item) {
              return (
                <li
                  key={`s-${i}`}
                  className="px-2 pb-1 pt-5 text-[0.625rem] font-bold uppercase tracking-[0.12em] first:pt-1"
                  style={{ color: 'rgba(255,255,255,0.28)' }}
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
                    'group relative flex items-center gap-2.5 rounded-[5px] px-2.5 py-[7px] text-[0.8125rem] transition-all duration-150',
                    active
                      ? 'font-medium text-white'
                      : 'font-normal hover:text-white',
                  )}
                  style={
                    active
                      ? { background: 'rgba(255,255,255,0.08)', color: '#fff' }
                      : { color: 'rgba(255,255,255,0.55)' }
                  }
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = '';
                  }}
                >
                  {/* Левая полоска активного пункта */}
                  {active && (
                    <span
                      className="absolute inset-y-[3px] left-0 w-[3px] rounded-full"
                      style={{ background: '#c60f13' }}
                    />
                  )}
                  <Icon
                    className="size-[15px] shrink-0"
                    aria-hidden="true"
                    style={{ color: active ? '#c60f13' : undefined }}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                  {active && (
                    <ChevronRight
                      className="size-3 shrink-0 opacity-40"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Подвал сайдбара */}
      <div className="shrink-0 px-3 pb-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link
          href="/"
          target="_blank"
          className="mt-3 flex items-center gap-2.5 rounded-[5px] px-2.5 py-[7px] text-[0.8125rem] transition-colors"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)';
          }}
        >
          <ExternalLink className="size-[15px] shrink-0" aria-hidden="true" />
          Открыть сайт
        </Link>

        <div
          className="mt-1 flex items-center justify-between rounded-[5px] px-2.5 py-2"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full text-[0.5625rem] font-bold text-white uppercase"
              style={{ background: '#c60f13' }}
            >
              {userName.slice(0, 2)}
            </span>
            <span className="truncate text-[0.75rem]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {userName}
            </span>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 ml-2 transition-colors"
            style={{ color: 'rgba(255,255,255,0.35)' }}
            title="Выйти"
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.35)')}
          >
            <LogOut className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div data-admin className="flex min-h-screen" style={{ background: '#f0f0ee' }}>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[220px] lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[220px]">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:ml-[220px]">
        {/* Мобильный хедер */}
        <header
          className="sticky top-0 z-20 flex h-14 items-center gap-3 px-4 lg:hidden"
          style={{ background: 'rgba(240,240,238,0.92)', borderBottom: '1px solid rgba(0,0,0,0.07)', backdropFilter: 'blur(8px)' }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Открыть меню"
            className="flex size-9 items-center justify-center rounded-[5px]"
            style={{ border: '1px solid rgba(0,0,0,0.12)' }}
          >
            <Menu className="size-[18px]" />
          </button>
          <span className="text-[0.875rem] font-semibold">Панель управления</span>
        </header>

        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8 lg:px-10 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
