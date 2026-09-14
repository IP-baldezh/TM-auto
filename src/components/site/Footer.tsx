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

          <p className="flex items-center gap-2">
            <span>Разработчик</span>
            <a
              href="https://aisis.ru"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="aisis — сайт разработчика"
              className="transition-colors hover:text-paper"
            >
              <AisisLogo />
            </a>
          </p>
        </div>
      </Container>
    </footer>
  );
}

function AisisLogo() {
  return (
    <svg viewBox="0 0 146 33" role="img" aria-label="aisis" className="h-4 w-auto fill-current">
      <path d="M132.608 17.9765C132.448 19.4461 131.89 20.7469 130.932 21.8788C129.995 23.0108 128.778 23.8945 127.282 24.53C125.806 25.1655 124.14 25.4832 122.285 25.4832C120.231 25.4832 118.416 25.1059 116.84 24.3513C115.264 23.5966 114.038 22.5441 113.16 21.1937C112.282 19.8433 111.844 18.2843 111.844 16.5169C111.844 14.7494 112.282 13.2004 113.16 11.8699C114.038 10.5195 115.264 9.46693 116.84 8.71229C118.416 7.93779 120.231 7.55054 122.285 7.55054C124.14 7.55054 125.806 7.86828 127.282 8.50377C128.778 9.13926 129.995 10.023 130.932 11.155C131.89 12.2671 132.448 13.5778 132.608 15.087H127.073C126.853 13.9948 126.305 13.1607 125.427 12.5848C124.569 11.989 123.522 11.6911 122.285 11.6911C121.308 11.6911 120.45 11.8798 119.712 12.2571C118.994 12.6345 118.436 13.1905 118.037 13.9253C117.638 14.6402 117.438 15.5041 117.438 16.5169C117.438 17.5297 117.638 18.3936 118.037 19.1085C118.436 19.8234 118.994 20.3695 119.712 20.7469C120.45 21.1242 121.308 21.3129 122.285 21.3129C123.542 21.3129 124.599 21.015 125.457 20.4192C126.315 19.8036 126.853 18.9893 127.073 17.9765H132.608Z" />
      <path d="M88.2478 25.0113V8.02246H93.6465V22.0308L92.4006 21.6732L101.923 8.02246H109.012V25.0113H103.584V10.6751L104.859 11.0626L95.1 25.0113H88.2478Z" />
      <path d="M85.4163 17.9765C85.2567 19.4461 84.6982 20.7469 83.7408 21.8788C82.8033 23.0108 81.5866 23.8945 80.0906 24.53C78.6146 25.1655 76.949 25.4832 75.094 25.4832C73.0396 25.4832 71.2244 25.1059 69.6487 24.3513C68.0729 23.5966 66.8462 22.5441 65.9686 21.1937C65.0909 19.8433 64.6521 18.2843 64.6521 16.5169C64.6521 14.7494 65.0909 13.2004 65.9686 11.8699C66.8462 10.5195 68.0729 9.46693 69.6487 8.71229C71.2244 7.93779 73.0396 7.55054 75.094 7.55054C76.949 7.55054 78.6146 7.86828 80.0906 8.50377C81.5866 9.13926 82.8033 10.023 83.7408 11.155C84.6982 12.2671 85.2567 13.5778 85.4163 15.087H79.8812C79.6618 13.9948 79.1132 13.1607 78.2356 12.5848C77.3779 11.989 76.3307 11.6911 75.094 11.6911C74.1167 11.6911 73.259 11.8798 72.521 12.2571C71.8029 12.6345 71.2444 13.1905 70.8455 13.9253C70.4465 14.6402 70.2471 15.5041 70.2471 16.5169C70.2471 17.5297 70.4465 18.3936 70.8455 19.1085C71.2444 19.8234 71.8029 20.3695 72.521 20.7469C73.259 21.1242 74.1167 21.3129 75.094 21.3129C76.3507 21.3129 77.4078 21.015 78.2655 20.4192C79.1232 19.8036 79.6618 18.9893 79.8812 17.9765H85.4163Z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.0566 8.09587V25.0114H48.0646L56.741 12.9381V25.0114H62.2927V8.09587H55.0421L46.578 19.9093V8.09587H41.0566Z"
      />
      <path d="M46.6084 5.1579C47.8421 6.12733 49.4702 6.61205 51.4927 6.61205C53.5354 6.61205 55.1736 6.12733 56.4073 5.1579C57.641 4.18847 58.3995 2.78379 58.6826 0.943848H54.3444C54.2028 1.755 53.8792 2.37821 53.3736 2.81346C52.8882 3.24872 52.2612 3.46634 51.4927 3.46634C50.7443 3.46634 50.1174 3.24872 49.6118 2.81346C49.1264 2.37821 48.8028 1.755 48.641 0.943848H44.3027C44.6061 2.78379 45.3746 4.18847 46.6084 5.1579Z" />
      <path d="M17.4175 20.5457V16.0505H32.8098V20.5457H17.4175ZM28.8875 2.8313L39.1688 25.0112H33.1961L24.3708 5.16759H26.0942L17.2986 25.0112H11.3259L21.6073 2.8313H28.8875Z" />
      <path d="M132.608 0H145.179V32.4676H132.608V26.7669H141.555L138.006 30.278V2.18968L141.555 5.70071H132.608V0Z" />
      <path d="M12.5718 0V5.70071H3.66205L7.17308 2.18968V30.278L3.66205 26.7669H12.5718V32.4676H0V0H12.5718Z" />
    </svg>
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
