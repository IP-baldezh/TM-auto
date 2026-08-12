import { Clock, MapPin, Navigation, Send } from 'lucide-react';

import type { ContactChannelView, SectionView, SiteSettingsView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';
import { ButtonLink } from '@/components/ui/Button';
import { formatPhone, telHref } from '@/lib/utils';

export function Contacts({
  section,
  site,
  contacts,
}: {
  section: SectionView;
  site: SiteSettingsView;
  contacts: ContactChannelView[];
}) {
  if (!section.enabled) return null;

  const messengers = [
    site.whatsappUrl ? { label: 'WhatsApp', href: site.whatsappUrl } : null,
    site.telegramUrl ? { label: 'Telegram', href: site.telegramUrl } : null,
    site.maxUrl ? { label: 'MAX', href: site.maxUrl } : null,
    site.vkUrl ? { label: 'ВКонтакте', href: site.vkUrl } : null,
  ].filter((m): m is { label: string; href: string } => m !== null);

  return (
    <Section id="contacts" tone="paper">
      <Container>
        <SectionHeading title={section.title} subtitle={section.subtitle} />

        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* ── Реквизиты ─────────────────────────────────────────────── */}
          <div className="lg:col-span-5">
            <dl className="border-t border-line">
              <div className="flex gap-4 border-b border-line py-6" data-reveal="up">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <dt className="eyebrow text-steel-2">Адрес</dt>
                  <dd className="mt-1.5 text-lg font-semibold">{site.address}</dd>
                </div>
              </div>

              <div className="flex gap-4 border-b border-line py-6" data-reveal="up">
                <Clock className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                <div>
                  <dt className="eyebrow text-steel-2">Режим работы</dt>
                  <dd className="mt-1.5 text-lg font-semibold">{site.hours}</dd>
                </div>
              </div>

              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-baseline justify-between gap-4 border-b border-line py-4"
                  data-reveal="up"
                >
                  <dt className="text-[0.875rem] text-steel">
                    {contact.label}
                    {contact.isPrimary && (
                      <span className="ml-2 inline-block rounded-[2px] bg-brand px-1.5 py-0.5 align-middle text-[0.625rem] font-semibold uppercase tracking-wider text-white">
                        Подбор
                      </span>
                    )}
                  </dt>
                  <dd>
                    <a
                      href={`tel:${telHref(contact.phone)}`}
                      className="tabular text-[0.9375rem] font-semibold transition-colors hover:text-brand"
                    >
                      {formatPhone(contact.phone)}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-7 flex flex-wrap gap-3" data-reveal="up">
              {site.routeUrl && (
                <ButtonLink
                  href={site.routeUrl}
                  variant="dark"
                  size="md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="size-4" aria-hidden="true" />
                  Проложить маршрут
                </ButtonLink>
              )}
              {messengers.map((messenger) => (
                <ButtonLink
                  key={messenger.label}
                  href={messenger.href}
                  variant="outline"
                  size="md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Send className="size-4" aria-hidden="true" />
                  {messenger.label}
                </ButtonLink>
              ))}
            </div>
          </div>

          {/* ── Карта ─────────────────────────────────────────────────── */}
          {site.mapEmbedUrl && (
            <div className="lg:col-span-7" data-reveal="mask">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-paper-3 sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
                <iframe
                  src={site.mapEmbedUrl}
                  title={`Схема проезда: ${site.address}`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 size-full border-0"
                />
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
