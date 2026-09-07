import Link from 'next/link';

import type { NavItemView, SiteSettingsView } from '@/lib/content';
import { Container } from '@/components/site/Section';
import { BrandMark } from './BrandMark';
import { EMAILS, PHONES, TG_CHANNEL_URL, VK_URL } from '@/content/contacts';
import { formatPhone, telHref } from '@/lib/utils';

export function Footer({
  site,
  nav,
  legal,
}: {
  site: SiteSettingsView;
  nav: NavItemView[];
  legal: NavItemView[];
}) {
  const year = new Date().getFullYear();
  const vkUrl = site.vkUrl ?? VK_URL;
  const tgChannelUrl = TG_CHANNEL_URL;

  return (
    <footer className="mx-4 rounded-t-3xl bg-ink text-paper sm:mx-6 lg:mx-8">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-4">
            <BrandMark
              brandName={site.brandName}
              brandNote={site.brandNote}
              logoUrl={site.logoUrl}
              tone="red"
            />
            <p className="mt-5 max-w-[34ch] text-[0.875rem] leading-relaxed text-steel-3">
              Авто под заказ из любой страны под ключ. Таможня, доставка и СБКТС — берём на себя.
            </p>

            <div className="mt-6">
              <p className="eyebrow mb-3 text-steel">Следите за нами</p>
              <div className="flex gap-3">
                <a
                  href={tgChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram-канал"
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#229ED9]"
                >
                  <FooterTelegramIcon />
                </a>
                {vkUrl && (
                  <a
                    href={vkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Группа ВКонтакте"
                    className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#0077FF]"
                  >
                    <FooterVkIcon />
                  </a>
                )}
              </div>
            </div>
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
            <p className="eyebrow mb-4 text-steel">Связь</p>
            <ul className="space-y-3">
              {PHONES.map((contact) => (
                <li key={contact.phone}>
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
              {EMAILS.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="block text-[0.875rem] text-steel-3 transition-colors hover:text-brand-bright"
                  >
                    {email}
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

function FooterTelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function FooterVkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-white" aria-hidden="true">
      <path d="M12.785 16.241s.288-.032.436-.194c.136-.148.132-.427.132-.427s-.02-1.304.576-1.496c.588-.19 1.341 1.26 2.14 1.818.605.422 1.064.33 1.064.33l2.137-.03s1.118-.071.588-.964c-.043-.073-.308-.661-1.588-1.87-1.34-1.264-1.16-1.059.453-3.246.983-1.332 1.376-2.145 1.253-2.493-.117-.332-.84-.244-.84-.244l-2.406.015s-.178-.025-.31.056c-.13.079-.212.262-.212.262s-.382 1.03-.89 1.907c-1.07 1.85-1.499 1.948-1.674 1.832-.407-.267-.305-1.075-.305-1.649 0-1.793.267-2.54-.521-2.733-.262-.065-.454-.107-1.123-.114-.858-.009-1.585.003-1.996.208-.274.135-.485.437-.356.454.159.022.519.099.71.365.246.344.237 1.115.237 1.115s.142 2.11-.33 2.371c-.325.18-.77-.187-1.725-1.865-.489-.859-.859-1.81-.859-1.81s-.07-.176-.198-.272c-.154-.115-.37-.151-.37-.151l-2.286.015s-.343.01-.469.161c-.112.135-.009.444-.009.444s1.79 4.258 3.817 6.403c1.858 1.967 3.968 1.838 3.968 1.838z" />
    </svg>
  );
}
