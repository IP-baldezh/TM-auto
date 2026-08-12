import 'server-only';

import { prisma } from '@/lib/db';
import type { EntityKey } from './entities';

/**
 * Чтение списков для админки. В отличие от публичной части здесь
 * выбираются все записи, включая выключенные.
 */
const bySort = { orderBy: { sortOrder: 'asc' as const } };

const LOADERS: Record<EntityKey, () => Promise<Record<string, unknown>[]>> = {
  promotions: () => prisma.promotion.findMany(bySort),
  trust: () => prisma.trustItem.findMany(bySort),
  services: () => prisma.service.findMany(bySort),
  inspection: () => prisma.inspectionCategory.findMany(bySort),
  cars: () => prisma.deliveredCar.findMany(bySort),
  process: () => prisma.processStep.findMany(bySort),
  reasons: () => prisma.trustReason.findMany(bySort),
  cases: () => prisma.caseStudy.findMany(bySort),
  testimonials: () => prisma.testimonial.findMany(bySort),
  faq: () => prisma.faqItem.findMany(bySort),
  contacts: () => prisma.contactChannel.findMany(bySort),
  navigation: () => prisma.navigationItem.findMany({ orderBy: [{ group: 'asc' }, { sortOrder: 'asc' }] }),
  sections: () => prisma.sectionBlock.findMany(bySort),
  calculatorSteps: () => prisma.calculatorStep.findMany(bySort),
  calculatorOptions: () => prisma.calculatorOption.findMany(bySort),
  budgetTiers: () => prisma.calculatorBudgetTier.findMany(bySort),
};

export type AdminRow = Record<string, unknown> & { id: string };

/** Пустой список вместо исключения: без базы админка должна открыться и объяснить проблему. */
export async function loadEntity(entity: EntityKey): Promise<AdminRow[]> {
  try {
    const rows = await LOADERS[entity]();
    return rows.map((row) => normalize(row) as AdminRow);
  } catch (error) {
    console.error(`[admin] чтение ${entity}`, error);
    return [];
  }
}

/** Даты приводим к строке: клиентские поля работают со строками. */
function normalize(row: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = value instanceof Date ? value.toISOString() : value;
  }
  return out;
}
