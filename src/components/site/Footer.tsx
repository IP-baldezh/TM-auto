import Link from 'next/link';

import type { ContactChannelView, NavItemView, SiteSettingsView } from '@/lib/content';
import { Container } from '@/components/site/Section';
import { BrandMark } from './BrandMark';
import { formatPhone, telHref } from '@/lib/utils';

export function Footer({
  site,
  contacts,
  nav,
  legal,
}: {
  site: SiteSettingsView;
  contacts: ContactChannelView[];
  nav: NavItemView[];
  legal: NavItemView[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mx-4 rounded-t-3xl bg-ink text-paper sm:mx-6 lg:mx-8">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-4">
            <BrandMark
              brandName={site.brandName}
              brandNote={site.brandNote}
              logoUrl={site.logoUrl}
              tone="light"
            />
            <p className="mt-5 max-w-[34ch] text-[0.875rem] leading-relaxed text-steel-3">
              Пригон автомобилей из Китая и Кореи под ключ. Таможня, доставка и СБКТС — берём на себя.
            </p>
          </div>

          <nav aria-label="Разделы сайта" className="lg:col-span-3">
            <p className="eyebrow mb-4 text-steel">Разделы</p>
            <ul className="space-y-2.5">
              {nav.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="text-[0.875rem] text-steel-3 transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4 text-steel">Телефоны</p>
            <ul className="space-y-3">
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <a
                    href={`tel:${telHref(contact.phone)}`}
                    className="block transition-colors hover:text-brand-bright"
                  >
                    <span className="tabular block text-[0.9375rem] font-semibold">
                      {formatPhone(contact.phone)}
                    </span>
                    <span className="text-[0.75rem] text-steel">{contact.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="eyebrow mb-4 text-steel">Адрес</p>
            <address className="text-[0.875rem] not-italic leading-relaxed text-steel-3">
              {site.address}
              <br />
              <span className="mt-2 block">{site.hours}</span>
            </address>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-line-dark py-7 text-[0.8125rem] text-steel sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brandName}
            {site.legalName ? ` · ${site.legalName}` : ''}
            {site.legalInn ? ` · ИНН ${site.legalInn}` : ''}
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((item) => (
              <li key={item.id}>
                <Link href={item.href} className="transition-colors hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
