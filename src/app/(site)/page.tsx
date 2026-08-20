import type { Metadata } from 'next';

import { getSiteContent } from '@/lib/content';
import { absoluteUrl } from '@/lib/utils';
import { buildStructuredData, withPhones } from '@/lib/seo/structured-data';

import { Container, Section, SectionHeading } from '@/components/site/Section';
import { ParallaxHero } from '@/components/site/hero/ParallaxHero';
import { Promotions } from '@/components/site/Promotions';
import { Services } from '@/components/site/Services';

import { CostExample } from '@/components/site/CostExample';
import { CalculatorSection } from '@/components/site/CalculatorSection';
import { DeliveredCars } from '@/components/site/cars/DeliveredCars';
import { ProcessTimeline } from '@/components/site/ProcessTimeline';
import { ReasonsGrid } from '@/components/site/ReasonsGrid';
import { Testimonials } from '@/components/site/Testimonials';
import { FaqAccordion } from '@/components/site/FaqAccordion';
import { FinalCta } from '@/components/site/FinalCta';
import { ImportDirections } from '@/components/site/ImportDirections';
import { Contacts } from '@/components/site/Contacts';

/** Контент меняется только из админки — ISR вместо запроса к базе на каждый хит. */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { seo, site } = await getSiteContent();

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ?? undefined,
    alternates: { canonical: seo.canonicalUrl ?? absoluteUrl('/') },
    robots: seo.robots,
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      siteName: site.brandName,
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      url: seo.canonicalUrl ?? absoluteUrl('/'),
      images: seo.ogImageUrl ? [{ url: seo.ogImageUrl, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.ogTitle ?? seo.title,
      description: seo.ogDescription ?? seo.description,
      images: seo.ogImageUrl ? [seo.ogImageUrl] : undefined,
    },
  };
}

const FALLBACK_SECTION = {
  key: '',
  eyebrow: null,
  title: null,
  subtitle: null,
  enabled: true,
  sortOrder: 0,
};

export default async function HomePage() {
  const content = await getSiteContent();
  const { sections, site, seo } = content;

  const primaryPhone = content.contacts.find((c) => c.isPrimary) ?? content.contacts[0] ?? null;
  const messengerUrl = site.whatsappUrl ?? site.telegramUrl ?? null;

  const faqVisible = sections.faq?.enabled !== false && content.faq.length > 0;

  const structuredData = buildStructuredData({
    site,
    services: content.services,
    faq: faqVisible ? content.faq : [],
    description: seo.description,
    imageUrl: seo.ogImageUrl,
  });
  const [business, ...restNodes] = structuredData;

  return (
    <>
      <script
        type="application/ld+json"
        // Данные собираются на сервере из собственной базы, внешнего ввода нет.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            [
              business
                ? withPhones(
                    business,
                    content.contacts.map((c) => c.phone),
                  )
                : null,
              ...restNodes,
            ].filter(Boolean),
          ),
        }}
      />

      {content.hero.enabled && (
        <ParallaxHero
          hero={content.hero}
          privacyUrl={site.privacyUrl}
          consentUrl={site.consentUrl}
        />
      )}

      <ImportDirections />

      <Services
        section={sections.services ?? FALLBACK_SECTION}
      />

      <Promotions
        section={sections.promotions ?? FALLBACK_SECTION}
        privacyUrl={site.privacyUrl}
        consentUrl={site.consentUrl}
      />

      <CostExample />

<CalculatorSection
        section={sections.calculator ?? FALLBACK_SECTION}
        calculator={content.calculator}
        privacyUrl={site.privacyUrl}
        consentUrl={site.consentUrl}
      />

      <DeliveredCars section={sections.cars ?? FALLBACK_SECTION} cars={content.cars} />

      {sections.process?.enabled !== false && content.process.length > 0 && (
        <Section id="process" tone="paper">
          <Container>
            <SectionHeading
              title={sections.process?.title}
              subtitle={sections.process?.subtitle}
            />
            <ProcessTimeline steps={content.process} />
          </Container>
        </Section>
      )}

      {sections.reasons?.enabled !== false && content.reasons.length > 0 && (
        <section
          id="reasons"
          className="relative scroll-mt-20 overflow-x-clip bg-ink pt-20 text-paper md:pt-28 lg:pt-32"
        >
          <Container>
            <SectionHeading
              title={sections.reasons?.title}
              subtitle={sections.reasons?.subtitle}
              tone="dark"
            />
          </Container>
          <ReasonsGrid reasons={content.reasons} />
        </section>
      )}

      <Testimonials
        section={sections.testimonials ?? FALLBACK_SECTION}
        testimonials={content.testimonials}
      />

      {faqVisible && (
        <Section id="faq" tone="paper">
          <Container>
            <SectionHeading title={sections.faq?.title} subtitle={sections.faq?.subtitle} />
            <FaqAccordion items={content.faq} />
          </Container>
        </Section>
      )}

      <FinalCta
        section={sections.cta ?? FALLBACK_SECTION}
        phone={primaryPhone?.phone ?? null}
        messengerUrl={messengerUrl}
        privacyUrl={site.privacyUrl}
        consentUrl={site.consentUrl}
      />

      <Contacts
        section={sections.contacts ?? FALLBACK_SECTION}
        site={site}
        contacts={content.contacts}
      />
    </>
  );
}
