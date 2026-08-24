import 'server-only';

import { prisma, safeQuery } from '@/lib/db';
import * as D from '@/content/defaults';

/**
 * Слой между Prisma и компонентами.
 *
 * Компоненты сайта не импортируют типы Prisma — они работают с view-моделями
 * из этого файла. Это позволяет отдавать те же самые данные из
 * src/content/defaults.ts, когда база недоступна.
 */

export type NavItemView = { id: string; label: string; href: string; external: boolean };

export type SectionView = {
  key: string;
  eyebrow: string | null;
  title: string | null;
  subtitle: string | null;
  enabled: boolean;
  sortOrder: number;
};

export type HeroView = {
  eyebrow: string | null;
  titleLead: string;
  titleAccent: string;
  titleTail: string;
  subtitle: string;
  trustLine: string | null;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  layerSkyUrl: string;
  layerMidUrl: string | null;
  layerCarUrl: string;
  layerCarIsCutout: boolean;
  layerForegroundUrl: string | null;
  enabled: boolean;
};

export type TrustItemView = { id: string; title: string; text: string };

export type PromotionView = {
  id: string;
  title: string;
  subtitle: string | null;
  price: string;
  oldPrice: string | null;
  ctaLabel: string;
  ctaHref: string;
  validUntil: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
  isDemo: boolean;
};

export type InspectionView = {
  id: string;
  code: string;
  title: string;
  summary: string;
  points: string[];
  imageUrl: string | null;
  imageAlt: string | null;
};

export type ServiceView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  outcomes: string[];
  imageUrl: string | null;
  imageAlt: string | null;
  ctaLabel: string;
  ctaHref: string;
  featured: boolean;
};

export type CarView = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  mileage: number | null;
  engine: string | null;
  transmission: string | null;
  drive: string | null;
  trim: string | null;
  location: string | null;
  searchDays: number | null;
  price: number | null;
  savings: number | null;
  description: string | null;
  imageUrl: string;
  imageAlt: string | null;
  gallery: string[];
  videoUrl: string | null;
  handedOverAt: Date | null;
  isDemo: boolean;
  reviewAuthor: string | null;
  reviewText: string | null;
};

export type ProcessView = {
  id: string;
  title: string;
  text: string;
  detail: string | null;
  imageUrl: string | null;
};

export type ReasonView = {
  id: string;
  title: string;
  text: string;
  imageUrl: string | null;
  imageAlt: string | null;
  size: 'LARGE' | 'MEDIUM' | 'SMALL';
};

export type CaseView = {
  id: string;
  eyebrow: string | null;
  title: string;
  listingTitle: string;
  listingPrice: string | null;
  listingText: string | null;
  findings: string[];
  risks: string[];
  decisionTitle: string;
  decisionText: string;
  images: string[];
  imageAlt: string | null;
  isDemo: boolean;
};

export type TestimonialView = {
  id: string;
  author: string;
  city: string | null;
  carTitle: string | null;
  text: string;
  rating: number | null;
  isDemo: boolean;
};

export type FaqView = { id: string; question: string; answer: string };

export type ContactChannelView = { id: string; label: string; phone: string; isPrimary: boolean };

/**
 * Типы описаны явно, а не выведены из defaults.ts: значение по умолчанию
 * `routeUrl: 'https://…'` сузило бы поле до string, тогда как в базе оно
 * обнуляемое.
 */
export type SiteSettingsView = {
  id: string;
  brandName: string;
  brandNote: string;
  logoUrl: string | null;
  city: string;
  address: string;
  hours: string;
  email: string | null;
  whatsappUrl: string | null;
  telegramUrl: string | null;
  vkUrl: string | null;
  maxUrl: string | null;
  routeUrl: string | null;
  mapEmbedUrl: string | null;
  mapLat: number | null;
  mapLng: number | null;
  legalName: string | null;
  legalInn: string | null;
  leadWebhookUrl: string | null;
  leadWebhookSecret: string | null;
  privacyUrl: string;
  consentUrl: string;
};

export type SeoView = {
  id: string;
  title: string;
  description: string;
  h1: string;
  keywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImageUrl: string | null;
  canonicalUrl: string | null;
  robots: string;
  headScripts: string | null;
};

export type RangeConfig = {
  min: number;
  max: number;
  step: number;
  defaultFrom: number;
  defaultTo: number;
  unit: string;
  quick: { label: string; from: number; to: number }[];
};

export type CalculatorOptionView = {
  id: string;
  label: string;
  value: string;
  hint: string | null;
  multiplier: number;
  addend: number;
};

export type CalculatorStepView = {
  id: string;
  key: string;
  kind: 'RANGE' | 'SINGLE' | 'MULTI';
  title: string;
  hint: string | null;
  searchable: boolean;
  required: boolean;
  rangeConfig: RangeConfig | null;
  options: CalculatorOptionView[];
};

export type BudgetTierView = {
  id: string;
  upTo: number | null;
  label: string;
  multiplier: number;
  addend: number;
};

export type CalculatorView = {
  eyebrow: string | null;
  title: string;
  subtitle: string | null;
  baseFee: number;
  minEstimate: number;
  maxEstimate: number;
  roundTo: number;
  spread: number;
  reserveShare: number;
  resultTitle: string;
  resultNote: string | null;
  disclaimer: string;
  ctaLabel: string;
  successTitle: string;
  successText: string;
  enabled: boolean;
  steps: CalculatorStepView[];
  budgetTiers: BudgetTierView[];
};

export type SiteContent = {
  site: SiteSettingsView;
  contacts: ContactChannelView[];
  nav: { header: NavItemView[]; footer: NavItemView[]; legal: NavItemView[] };
  sections: Record<string, SectionView>;
  hero: HeroView;
  trust: TrustItemView[];
  promotions: PromotionView[];
  inspection: InspectionView[];
  services: ServiceView[];
  extraServices: string[];
  calculator: CalculatorView;
  cars: CarView[];
  process: ProcessView[];
  reasons: ReasonView[];
  caseStudy: CaseView | null;
  testimonials: TestimonialView[];
  faq: FaqView[];
  seo: SeoView;
  /** false — данные отданы из defaults.ts, база не ответила. */
  fromDatabase: boolean;
};

// ── Значения по умолчанию в форме view-моделей ───────────────────────────

const withId = <T>(items: T[], prefix: string): (T & { id: string })[] =>
  items.map((item, i) => ({ ...item, id: `${prefix}-${i}` }));

const fallbackSections: Record<string, SectionView> = Object.fromEntries(
  D.DEFAULT_SECTIONS.map((s) => [
    s.key,
    {
      key: s.key,
      eyebrow: s.eyebrow,
      title: s.title,
      subtitle: s.subtitle,
      enabled: true,
      sortOrder: s.sortOrder,
    },
  ]),
);

const fallbackCalculator: CalculatorView = {
  ...D.DEFAULT_CALCULATOR,
  enabled: true,
  steps: D.DEFAULT_CALCULATOR_STEPS.map((step, i) => ({
    id: `step-${i}`,
    key: step.key,
    kind: step.kind,
    title: step.title,
    hint: step.hint,
    searchable: step.searchable,
    required: step.required,
    rangeConfig: (step.rangeConfig as RangeConfig | null) ?? null,
    options: step.options.map((o, j) => ({
      id: `opt-${i}-${j}`,
      label: o.label,
      value: o.value,
      hint: 'hint' in o ? ((o as { hint?: string }).hint ?? null) : null,
      multiplier: o.multiplier,
      addend: o.addend,
    })),
  })),
  budgetTiers: withId(D.DEFAULT_BUDGET_TIERS, 'tier'),
};

function fallbackContent(): SiteContent {
  return {
    site: D.DEFAULT_SITE,
    contacts: withId(D.DEFAULT_CONTACTS, 'contact'),
    nav: {
      header: D.DEFAULT_NAVIGATION.filter((n) => n.group === 'HEADER').map((n, i) => ({
        id: `h-${i}`,
        label: n.label,
        href: n.href,
        external: 'external' in n ? Boolean(n.external) : false,
      })),
      footer: D.DEFAULT_NAVIGATION.filter((n) => n.group === 'FOOTER').map((n, i) => ({
        id: `f-${i}`,
        label: n.label,
        href: n.href,
        external: 'external' in n ? Boolean(n.external) : false,
      })),
      legal: D.DEFAULT_NAVIGATION.filter((n) => n.group === 'LEGAL').map((n, i) => ({
        id: `l-${i}`,
        label: n.label,
        href: n.href,
        external: false,
      })),
    },
    sections: fallbackSections,
    hero: { ...D.DEFAULT_HERO, enabled: true },
    trust: withId(D.DEFAULT_TRUST_ITEMS, 'trust'),
    promotions: withId(D.DEFAULT_PROMOTIONS, 'promo'),
    inspection: withId(D.DEFAULT_INSPECTION, 'insp'),
    services: withId(
      D.DEFAULT_SERVICES.map((s) => ({ ...s, ctaHref: '#calculator', outcomes: [...s.outcomes] })),
      'srv',
    ),
    extraServices: [...D.DEFAULT_EXTRA_SERVICES],
    calculator: fallbackCalculator,
    cars: withId(
      D.DEFAULT_CARS.map((c) => ({
        ...c,
        gallery: [] as string[],
        videoUrl: null,
        handedOverAt: null,
        isDemo: true,
        reviewAuthor: c.reviewAuthor ?? null,
        reviewText: c.reviewText ?? null,
      })),
      'car',
    ),
    process: withId(D.DEFAULT_PROCESS, 'proc'),
    reasons: withId(D.DEFAULT_REASONS, 'reason'),
    caseStudy: {
      ...D.DEFAULT_CASE,
      id: 'case-0',
      findings: [...D.DEFAULT_CASE.findings],
      risks: [...D.DEFAULT_CASE.risks],
      images: [...D.DEFAULT_CASE.images],
    },
    testimonials: withId(
      D.DEFAULT_TESTIMONIALS.map((t) => ({ ...t, isDemo: true })),
      'tst',
    ),
    faq: withId(D.DEFAULT_FAQ, 'faq'),
    seo: D.DEFAULT_SEO,
    fromDatabase: false,
  };
}

// ── Чтение из базы ───────────────────────────────────────────────────────

const enabledAsc = { where: { enabled: true }, orderBy: { sortOrder: 'asc' as const } };

/**
 * Одно обращение к базе на запрос страницы. Каждая выборка независимо
 * деградирует до значения по умолчанию, поэтому частичная авария базы
 * не роняет весь лендинг.
 */
export async function getSiteContent(): Promise<SiteContent> {
  const fb = fallbackContent();

  if (!process.env.DATABASE_URL) return fb;

  const [
    site,
    contacts,
    navItems,
    sectionRows,
    hero,
    trust,
    inspection,
    services,
    calcConfig,
    calcSteps,
    budgetTiers,
    cars,
    processSteps,
    reasons,
    caseStudy,
    testimonials,
    faq,
    promotionRows,
    seo,
  ] = await Promise.all([
    safeQuery(() => prisma.siteSettings.findUnique({ where: { id: 'site' } }), null, 'settings'),
    safeQuery(() => prisma.contactChannel.findMany(enabledAsc), null, 'contacts'),
    safeQuery(
      () => prisma.navigationItem.findMany({ ...enabledAsc, orderBy: { sortOrder: 'asc' } }),
      null,
      'navigation',
    ),
    safeQuery(() => prisma.sectionBlock.findMany({ orderBy: { sortOrder: 'asc' } }), null, 'sections'),
    safeQuery(() => prisma.heroSection.findUnique({ where: { id: 'hero' } }), null, 'hero'),
    safeQuery(() => prisma.trustItem.findMany(enabledAsc), null, 'trust'),
    safeQuery(() => prisma.inspectionCategory.findMany(enabledAsc), null, 'inspection'),
    safeQuery(() => prisma.service.findMany(enabledAsc), null, 'services'),
    safeQuery(
      () => prisma.calculatorConfig.findUnique({ where: { id: 'calculator' } }),
      null,
      'calculator',
    ),
    safeQuery(
      () =>
        prisma.calculatorStep.findMany({
          ...enabledAsc,
          include: { options: { where: { enabled: true }, orderBy: { sortOrder: 'asc' } } },
        }),
      null,
      'calculator-steps',
    ),
    safeQuery(
      () => prisma.calculatorBudgetTier.findMany({ orderBy: { sortOrder: 'asc' } }),
      null,
      'budget-tiers',
    ),
    safeQuery(
      () =>
        prisma.deliveredCar.findMany({
          where: { published: true },
          orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }],
        }),
      null,
      'cars',
    ),
    safeQuery(() => prisma.processStep.findMany(enabledAsc), null, 'process'),
    safeQuery(() => prisma.trustReason.findMany(enabledAsc), null, 'reasons'),
    safeQuery(
      () => prisma.caseStudy.findFirst({ where: { enabled: true }, orderBy: { sortOrder: 'asc' } }),
      undefined,
      'case',
    ),
    safeQuery(() => prisma.testimonial.findMany(enabledAsc), null, 'testimonials'),
    safeQuery(() => prisma.faqItem.findMany(enabledAsc), null, 'faq'),
    safeQuery(() => prisma.promotion.findMany(enabledAsc), null, 'promotions'),
    safeQuery(() => prisma.seoSettings.findUnique({ where: { id: 'seo' } }), null, 'seo'),
  ]);

  const sections: Record<string, SectionView> = { ...fb.sections };
  if (sectionRows) {
    for (const row of sectionRows) {
      sections[row.key] = {
        key: row.key,
        eyebrow: row.eyebrow,
        title: row.title,
        subtitle: row.subtitle,
        enabled: row.enabled,
        sortOrder: row.sortOrder,
      };
    }
  }

  const navFor = (group: 'HEADER' | 'FOOTER' | 'LEGAL', fallback: NavItemView[]): NavItemView[] => {
    if (!navItems) return fallback;
    const filtered = navItems.filter((n) => n.group === group);
    return filtered.length
      ? filtered.map((n) => ({ id: n.id, label: n.label, href: n.href, external: n.external }))
      : fallback;
  };

  const nonEmpty = <T>(rows: T[] | null, fallback: T[]): T[] =>
    rows && rows.length ? rows : fallback;

  return {
    site: site ?? fb.site,
    contacts: nonEmpty(contacts, fb.contacts),
    nav: {
      header: navFor('HEADER', fb.nav.header),
      footer: navFor('FOOTER', fb.nav.footer),
      legal: navFor('LEGAL', fb.nav.legal),
    },
    sections,
    hero: hero
      ? {
          ...hero,
          layerSkyUrl: hero.layerSkyUrl || fb.hero.layerSkyUrl,
          layerCarUrl: hero.layerCarUrl || fb.hero.layerCarUrl,
        }
      : fb.hero,
    trust: nonEmpty(trust, fb.trust),
    promotions: nonEmpty(promotionRows, fb.promotions),
    inspection: nonEmpty(inspection, fb.inspection),
    services: nonEmpty(services, fb.services),
    extraServices: fb.extraServices,
    calculator:
      calcConfig && calcSteps && calcSteps.length
        ? {
            ...calcConfig,
            steps: calcSteps.map((s) => ({
              id: s.id,
              key: s.key,
              kind: s.kind,
              title: s.title,
              hint: s.hint,
              searchable: s.searchable,
              required: s.required,
              rangeConfig: (s.rangeConfig as RangeConfig | null) ?? null,
              options: s.options.map((o) => ({
                id: o.id,
                label: o.label,
                value: o.value,
                hint: o.hint,
                multiplier: o.multiplier,
                addend: o.addend,
              })),
            })),
            budgetTiers: nonEmpty(budgetTiers, fb.calculator.budgetTiers),
          }
        : fb.calculator,
    cars: nonEmpty(cars, fb.cars),
    process: nonEmpty(processSteps, fb.process),
    reasons: nonEmpty(reasons, fb.reasons),
    // Кейс — единственная секция, которую корректно скрыть целиком:
    // undefined значит «база не ответила» (берём демо), null — «кейса нет».
    caseStudy: caseStudy === undefined ? fb.caseStudy : caseStudy,
    testimonials: testimonials ?? fb.testimonials,
    faq: nonEmpty(faq, fb.faq),
    seo: seo ?? fb.seo,
    fromDatabase: Boolean(site ?? hero ?? seo),
  };
}

export async function getSeoSettings(): Promise<SeoView> {
  if (!process.env.DATABASE_URL) return D.DEFAULT_SEO;
  const row = await safeQuery(
    () => prisma.seoSettings.findUnique({ where: { id: 'seo' } }),
    null,
    'seo',
  );
  return row ?? D.DEFAULT_SEO;
}

export async function getSiteSettings(): Promise<SiteSettingsView> {
  if (!process.env.DATABASE_URL) return D.DEFAULT_SITE;
  const row = await safeQuery(
    () => prisma.siteSettings.findUnique({ where: { id: 'site' } }),
    null,
    'settings',
  );
  return row ?? D.DEFAULT_SITE;
}
