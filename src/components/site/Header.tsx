'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Menu, Phone, X } from 'lucide-react';

import type { NavItemView } from '@/lib/content';
import { useHeroPassed } from '@/components/animations/useScrolledPast';
import { ButtonLink } from '@/components/ui/Button';
import { cn, formatPhone, telHref } from '@/lib/utils';
import { BrandMark } from './BrandMark';

export function Header({
  nav,
  phone,
  phoneLabel,
  brandName,
  brandNote,
  logoUrl,
  ctaLabel = 'Подобрать авто',
  ctaHref = '#calculator',
}: {
  nav: NavItemView[];
  phone: string | null;
  phoneLabel?: string;
  brandName: string;
  brandNote: string;
  logoUrl: string | null;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  // Прозрачная шапка живёт только над hero — дальше нужен фон.
  const scrolled = useHeroPassed();
  const [open, setOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Меню на мобильном: блокируем прокрутку страницы и закрываем по Escape.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const solid = scrolled || open;

  const scrollToAnchor = useCallback((href: string) => {
    const id = href.startsWith('#') ? href.slice(1) : null;
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300',
          solid
            ? 'border-b border-line bg-paper/88 backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent',
        )}
      >
        <div className="container-page flex h-16 items-center justify-between gap-6 lg:h-20">
          <Link
            href="/"
            className="shrink-0"
            aria-label={`${brandName} — на главную`}
            onClick={() => {
              setOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <BrandMark
              brandName={brandName}
              brandNote={brandNote}
              logoUrl={logoUrl}
              tone={solid ? 'dark' : 'light'}
            />
          </Link>

          <nav aria-label="Основная навигация" className="hidden xl:block">
            <ul className="flex items-center gap-7">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    onClick={(e) => {
                      if (item.href.startsWith('#')) {
                        e.preventDefault();
                        scrollToAnchor(item.href);
                      }
                    }}
                    className={cn(
                      'relative py-2 text-[0.8125rem] font-medium transition-colors',
                      'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand after:transition-transform after:duration-300 hover:after:scale-x-100',
                      solid ? 'text-steel hover:text-ink' : 'text-white/75 hover:text-white',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {phone && (
              <a
                href={`tel:${telHref(phone)}`}
                className={cn(
                  'hidden items-center gap-2 text-[0.875rem] font-semibold transition-colors lg:flex',
                  solid ? 'text-ink hover:text-brand' : 'text-white hover:text-brand-bright',
                )}
              >
                <Phone className="size-4" aria-hidden="true" />
                <span className="tabular">{formatPhone(phone)}</span>
              </a>
            )}

            <ButtonLink
              href={ctaHref}
              size="sm"
              variant={solid ? 'primary' : 'light'}
              className="hidden sm:inline-flex"
            >
              {ctaLabel}
            </ButtonLink>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={open}
              className={cn(
                'flex size-10 items-center justify-center rounded-lg border transition-colors xl:hidden',
                solid
                  ? 'border-line-strong text-ink hover:bg-paper-3'
                  : 'border-white/25 text-white hover:bg-white/10',
              )}
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Мобильное меню ─────────────────────────────────────────────── */}
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            tabIndex={-1}
            className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="absolute inset-y-0 right-0 flex w-full flex-col bg-paper shadow-2xl sm:max-w-sm"
          >
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
              <BrandMark
                brandName={brandName}
                brandNote={brandNote}
                logoUrl={logoUrl}
                tone="dark"
              />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Закрыть меню"
                className="flex size-10 items-center justify-center rounded-lg border border-line-strong text-ink transition-colors hover:bg-paper-3"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Меню" className="flex-1 overflow-y-auto px-5 py-4">
              <ul>
                {nav.map((item) => (
                  <li key={item.id} className="border-b border-line/70 last:border-0">
                    <Link
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      onClick={(e) => {
                        setOpen(false);
                        if (item.href.startsWith('#')) {
                          e.preventDefault();
                          setTimeout(() => scrollToAnchor(item.href), 150);
                        }
                      }}
                      className="block py-4 font-[family-name:var(--font-display)] text-xl tracking-[-0.02em] transition-colors hover:text-brand"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="shrink-0 border-t border-line p-5">
              {phone && (
                <a
                  href={`tel:${telHref(phone)}`}
                  className="mb-3 flex items-center justify-center gap-2 text-lg font-bold"
                >
                  <Phone className="size-4 text-brand" aria-hidden="true" />
                  <span className="tabular">{formatPhone(phone)}</span>
                </a>
              )}
              {phoneLabel && (
                <p className="mb-4 text-center text-[0.75rem] text-steel-2">{phoneLabel}</p>
              )}
              <ButtonLink
                href={ctaHref}
                size="lg"
                variant="primary"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {ctaLabel}
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
