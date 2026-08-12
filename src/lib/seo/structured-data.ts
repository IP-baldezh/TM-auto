import type { FaqView, ServiceView, SiteSettingsView } from '@/lib/content';
import { absoluteUrl, telHref } from '@/lib/utils';

type Json = Record<string, unknown>;

/**
 * Разметка отдаётся только для того, что реально есть на странице:
 * FAQPage добавляется, лишь когда секция вопросов видима и не пуста.
 */
export function buildStructuredData({
  site,
  services,
  faq,
  description,
  imageUrl,
}: {
  site: SiteSettingsView;
  services: ServiceView[];
  faq: FaqView[];
  description: string;
  imageUrl?: string | null;
}): Json[] {
  const url = absoluteUrl('/');
  const businessId = `${url}#business`;

  const business: Json = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': businessId,
    name: `${site.brandName} — подбор автомобилей`,
    description,
    url,
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.city,
      streetAddress: site.address.replace(new RegExp(`^${site.city},\\s*`), ''),
      addressCountry: 'RU',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '20:00',
      },
    ],
    areaServed: [
      { '@type': 'City', name: site.city },
      { '@type': 'AdministrativeArea', name: 'Нижегородская область' },
    ],
  };

  if (imageUrl) business.image = imageUrl;
  if (site.email) business.email = site.email;
  if (site.legalName) business.legalName = site.legalName;
  if (site.mapLat !== null && site.mapLng !== null) {
    business.geo = { '@type': 'GeoCoordinates', latitude: site.mapLat, longitude: site.mapLng };
  }

  const nodes: Json[] = [business];

  for (const service of services) {
    nodes.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.title,
      description: service.excerpt.slice(0, 400),
      serviceType: 'Подбор и проверка автомобиля с пробегом',
      provider: { '@id': businessId },
      areaServed: { '@type': 'City', name: site.city },
    });
  }

  nodes.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: url },
      { '@type': 'ListItem', position: 2, name: 'Подбор автомобилей', item: `${url}#services` },
    ],
  });

  if (faq.length > 0) {
    nodes.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return nodes;
}

/** Телефоны добавляются отдельно: их список приходит из другой таблицы. */
export function withPhones(business: Json, phones: string[]): Json {
  if (!phones.length) return business;
  return {
    ...business,
    telephone: telHref(phones[0] ?? ''),
    contactPoint: phones.map((phone) => ({
      '@type': 'ContactPoint',
      telephone: telHref(phone),
      contactType: 'customer service',
      areaServed: 'RU',
      availableLanguage: 'Russian',
    })),
  };
}
