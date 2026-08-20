import { Clock, Mail, MapPin, Phone } from 'lucide-react';

import type { ContactChannelView, SectionView, SiteSettingsView } from '@/lib/content';
import { Container, Section, SectionHeading } from '@/components/site/Section';
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

  return (
    <Section id="contacts" tone="paper">
      <Container>
        <SectionHeading title={section.title} subtitle={section.subtitle} />

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8" data-reveal="up">
          {/* ── Тёмная карточка с контактами ────────────────────────── */}
          <div className="relative overflow-hidden rounded-2xl bg-graphite-2 p-8 text-paper sm:p-10">
            {/* Водяной знак */}
            <svg
              viewBox="0 0 187 89"
              aria-hidden="true"
              className="pointer-events-none absolute -right-[10%] top-1/2 h-[80%] w-auto -translate-y-1/2 select-none opacity-[0.07]"
              fill="white"
            >
              <path d="M93.0379 0.0988639C133.037 -1.10095 149.371 8.93223 152.538 14.0989L159.538 24.0989C161.205 24.9322 164.538 26.0986 164.538 24.0989C164.038 15.0993 175.038 16.5989 178.038 16.5989C194.536 22.0986 176.538 28.7654 166.538 31.0989V32.0989C176.137 31.2997 181.538 42.099 183.038 47.5989C190.637 75.9971 182.205 86.7646 177.038 88.5989C183.459 67.4459 166.901 72.5706 156.336 78.5403C155.751 78.9041 155.151 79.2581 154.538 79.5989C155.112 79.2468 155.714 78.8917 156.336 78.5403C166.046 72.4993 171.809 63.5286 173.538 59.5989C184.337 34.4003 149.371 54.099 130.538 67.0989L135.038 61.0989C130.638 65.4988 105.205 67.2655 93.0379 67.5989C80.8714 67.2655 55.4385 65.4987 51.0379 61.0989L55.5379 67.0989C36.7046 54.0989 1.73804 34.399 12.5379 59.5989C14.2671 63.5287 20.0286 72.4993 29.7391 78.5403C30.3611 78.8918 30.9633 79.2467 31.5379 79.5989C30.9243 79.258 30.3241 78.9042 29.7391 78.5403C19.1741 72.5704 2.61629 67.445 9.03791 88.5989C3.87125 86.7655 -4.56208 75.9989 3.03791 47.5989C4.53815 42.0987 9.93828 31.2989 19.5379 32.0989V31.0989C9.53791 28.7655 -8.46209 22.0989 8.03791 16.5989C11.0392 16.5986 22.0374 15.1003 21.5379 24.0989C21.5379 26.0989 24.8712 24.9322 26.5379 24.0989L33.5379 14.0989C36.7057 8.93198 53.0398 -1.10108 93.0379 0.0988639ZM155 29.0002C152.833 29.8336 146.2 31.5002 137 31.5002H48.9998C39.8002 31.5002 33.1668 29.8336 30.9998 29.0002L27.4998 33.5002C25.0998 36.7002 26.1665 39.1669 26.9998 40.0002C33.1666 45.0003 46.1999 55.5002 48.9998 57.5002C51.8003 61.1001 79.5 62.0002 92.9998 62.0002C106.5 62.0002 134.2 61.1002 137 57.5002C139.8 55.4997 152.833 45.0001 159 40.0002C159.833 39.1667 160.899 36.6999 158.5 33.5002L155 29.0002ZM66.5379 7.59886C53.3395 7.99882 46.3723 10.7653 44.5379 12.0989C41.8714 14.0988 36.1382 19.199 34.5379 23.5989C32.9379 27.9989 72.8712 29.0989 93.0379 29.0989C113.205 29.0988 153.137 27.9987 151.538 23.5989C149.938 19.1991 144.205 14.099 141.538 12.0989C139.705 10.7655 132.737 7.99894 119.538 7.59886H66.5379Z" />
              <ellipse cx="92.9998" cy="58.5002" rx="3" ry="1.5" />
            </svg>

            <h3 className="mb-7 text-2xl font-bold tracking-tight text-white">Контакты</h3>

            <ul className="flex flex-col gap-5">
              {/* Телефоны */}
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <a
                    href={`tel:${telHref(contact.phone)}`}
                    className="flex items-center gap-4 transition-opacity hover:opacity-80"
                  >
                    <IconCircle bg="#c60f13">
                      <Phone className="size-5 fill-white stroke-none" />
                    </IconCircle>
                    <div>
                      <p className="text-[0.75rem] text-steel-3">{contact.label}</p>
                      <p className="text-[1rem] font-bold text-white">{formatPhone(contact.phone)}</p>
                    </div>
                  </a>
                </li>
              ))}

              {/* WhatsApp */}
              {site.whatsappUrl && (
                <li>
                  <a
                    href={site.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 transition-opacity hover:opacity-80"
                  >
                    <IconCircle bg="#c60f13">
                      <WhatsAppIcon />
                    </IconCircle>
                    <div>
                      <p className="text-[0.75rem] text-steel-3">WhatsApp</p>
                      <p className="text-[1rem] font-bold text-white">Написать</p>
                    </div>
                  </a>
                </li>
              )}

              {/* Telegram */}
              {site.telegramUrl && (
                <li>
                  <a
                    href={site.telegramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 transition-opacity hover:opacity-80"
                  >
                    <IconCircle bg="#c60f13">
                      <TelegramIcon />
                    </IconCircle>
                    <div>
                      <p className="text-[0.75rem] text-steel-3">Telegram</p>
                      <p className="text-[1rem] font-bold text-white">Написать</p>
                    </div>
                  </a>
                </li>
              )}

              {/* Max */}
              {site.maxUrl && (
                <li>
                  <a
                    href={site.maxUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 transition-opacity hover:opacity-80"
                  >
                    <IconCircle bg="#c60f13">
                      <MaxIcon />
                    </IconCircle>
                    <div>
                      <p className="text-[0.75rem] text-steel-3">Макс</p>
                      <p className="text-[1rem] font-bold text-white">Написать</p>
                    </div>
                  </a>
                </li>
              )}

              {/* Email */}
              {site.email && (
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="flex items-center gap-4 transition-opacity hover:opacity-80"
                  >
                    <IconCircle bg="#c60f13">
                      <Mail className="size-5 fill-white stroke-none" />
                    </IconCircle>
                    <div>
                      <p className="text-[0.75rem] text-steel-3">Email</p>
                      <p className="text-[1rem] font-bold text-white">{site.email}</p>
                    </div>
                  </a>
                </li>
              )}

              {/* Адрес */}
              {site.address && (
                <li className="flex items-center gap-4">
                  <IconCircle bg="#c60f13">
                    <MapPin className="size-5 fill-white stroke-none" />
                  </IconCircle>
                  <div>
                    <p className="text-[0.75rem] text-steel-3">Офис</p>
                    <p className="text-[1rem] font-bold text-white">{site.address}</p>
                  </div>
                </li>
              )}

              {/* Режим работы */}
              {site.hours && (
                <li className="flex items-center gap-4">
                  <IconCircle bg="#c60f13">
                    <Clock className="size-5 fill-white stroke-none" />
                  </IconCircle>
                  <div>
                    <p className="text-[0.75rem] text-steel-3">Режим работы</p>
                    <p className="text-[1rem] font-bold text-white">{site.hours}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* ── Карта ────────────────────────────────────────────────── */}
          {site.mapEmbedUrl ? (
            <div className="relative overflow-hidden rounded-2xl" data-reveal="mask">
              <iframe
                src={site.mapEmbedUrl}
                title={`Схема проезда: ${site.address}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[400px] w-full border-0"
              />
              {/* Блокирует клики на метку — убирает баннер «Организации в доме» */}
              <div className="absolute inset-0" aria-hidden="true" />
            </div>
          ) : (
            <div className="flex min-h-[400px] items-center justify-center rounded-2xl bg-paper-3 text-steel">
              Карта не настроена
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}

/* ── Вспомогательные компоненты ─────────────────────────────────────────── */

function IconCircle({ bg, children }: { bg: string; children: React.ReactNode }) {
  return (
    <span
      className="flex size-11 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: bg }}
    >
      {children}
    </span>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function MaxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5 fill-white" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.5 14h-1.75v-5.586l-2.375 3.211h-.75L9.25 10.414V16H7.5V8h1.563l2.937 4.016L14.938 8H16.5v8z" />
    </svg>
  );
}
