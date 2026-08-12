/**
 * Первичное наполнение базы.
 *
 * Скрипт идемпотентен: повторный запуск обновляет существующие записи и не
 * плодит дубликаты. Списки, у которых нет естественного уникального ключа,
 * заполняются только если таблица пуста, — чтобы не затирать правки
 * редактора при повторном запуске.
 *
 * Источник содержимого — src/content/defaults.ts.
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

import * as D from '../src/content/defaults';

const prisma = new PrismaClient();

const SECTION_LABELS = new Map(D.DEFAULT_SECTIONS.map((s) => [s.key, s.label]));

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log('  · администратор пропущен (не заданы ADMIN_EMAIL и ADMIN_PASSWORD)');
    return;
  }

  if (password.length < 8) {
    console.warn('  · ADMIN_PASSWORD короче 8 символов — администратор не создан');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, name: process.env.ADMIN_NAME ?? 'Администратор' },
    update: { passwordHash },
  });
  console.log(`  · администратор: ${email}`);
}

async function main() {
  console.log('Наполнение базы данными по умолчанию…');

  // ── Настройки, SEO, hero, калькулятор ──────────────────────────────────
  await prisma.siteSettings.upsert({
    where: { id: 'site' },
    create: D.DEFAULT_SITE,
    update: {},
  });

  await prisma.seoSettings.upsert({
    where: { id: 'seo' },
    create: D.DEFAULT_SEO,
    update: {},
  });

  await prisma.heroSection.upsert({
    where: { id: 'hero' },
    create: D.DEFAULT_HERO,
    update: {},
  });

  await prisma.calculatorConfig.upsert({
    where: { id: 'calculator' },
    create: D.DEFAULT_CALCULATOR,
    update: {},
  });
  console.log('  · настройки, SEO, главный экран, калькулятор');

  // ── Секции ─────────────────────────────────────────────────────────────
  for (const section of D.DEFAULT_SECTIONS) {
    await prisma.sectionBlock.upsert({
      where: { key: section.key },
      create: {
        key: section.key,
        label: SECTION_LABELS.get(section.key) ?? section.key,
        eyebrow: section.eyebrow,
        title: section.title,
        subtitle: section.subtitle,
        sortOrder: section.sortOrder,
      },
      update: {},
    });
  }
  console.log(`  · секции: ${D.DEFAULT_SECTIONS.length}`);

  // ── Навигация ──────────────────────────────────────────────────────────
  if ((await prisma.navigationItem.count()) === 0) {
    await prisma.navigationItem.createMany({
      data: D.DEFAULT_NAVIGATION.map((item) => ({
        group: item.group,
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
        external: 'external' in item ? Boolean(item.external) : false,
      })),
    });
    console.log(`  · пункты меню: ${D.DEFAULT_NAVIGATION.length}`);
  }

  // ── Телефоны ───────────────────────────────────────────────────────────
  if ((await prisma.contactChannel.count()) === 0) {
    await prisma.contactChannel.createMany({ data: D.DEFAULT_CONTACTS });
    console.log(`  · телефоны: ${D.DEFAULT_CONTACTS.length}`);
  }

  // ── ДЕМО: акции ────────────────────────────────────────────────────────
  if ((await prisma.promotion.count()) === 0) {
    await prisma.promotion.createMany({ data: D.DEFAULT_PROMOTIONS });
    console.log(`  · ДЕМО акции: ${D.DEFAULT_PROMOTIONS.length}`);
  }

  // ── Полоса доверия ─────────────────────────────────────────────────────
  if ((await prisma.trustItem.count()) === 0) {
    await prisma.trustItem.createMany({ data: D.DEFAULT_TRUST_ITEMS });
    console.log(`  · тезисы доверия: ${D.DEFAULT_TRUST_ITEMS.length}`);
  }

  // ── Что проверяем ──────────────────────────────────────────────────────
  for (const category of D.DEFAULT_INSPECTION) {
    await prisma.inspectionCategory.upsert({
      where: { code: category.code },
      create: category,
      update: {},
    });
  }
  console.log(`  · категории проверки: ${D.DEFAULT_INSPECTION.length}`);

  // ── Услуги ─────────────────────────────────────────────────────────────
  for (const service of D.DEFAULT_SERVICES) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      create: { ...service, ctaHref: '#calculator' },
      update: {},
    });
  }
  console.log(`  · услуги: ${D.DEFAULT_SERVICES.length}`);

  // ── Этапы, доверие ─────────────────────────────────────────────────────
  if ((await prisma.processStep.count()) === 0) {
    await prisma.processStep.createMany({ data: D.DEFAULT_PROCESS });
    console.log(`  · этапы работы: ${D.DEFAULT_PROCESS.length}`);
  }

  if ((await prisma.trustReason.count()) === 0) {
    await prisma.trustReason.createMany({ data: D.DEFAULT_REASONS });
    console.log(`  · блоки доверия: ${D.DEFAULT_REASONS.length}`);
  }

  // ── FAQ ────────────────────────────────────────────────────────────────
  if ((await prisma.faqItem.count()) === 0) {
    await prisma.faqItem.createMany({ data: D.DEFAULT_FAQ });
    console.log(`  · вопросы и ответы: ${D.DEFAULT_FAQ.length}`);
  }

  // ── ДЕМО: автомобили, кейс, отзывы ─────────────────────────────────────
  if ((await prisma.deliveredCar.count()) === 0) {
    await prisma.deliveredCar.createMany({
      data: D.DEFAULT_CARS.map((car) => ({ ...car, isDemo: true, published: true })),
    });
    console.log(`  · ДЕМО автомобили: ${D.DEFAULT_CARS.length}`);
  }

  if ((await prisma.caseStudy.count()) === 0) {
    await prisma.caseStudy.create({ data: D.DEFAULT_CASE });
    console.log('  · ДЕМО разбор автомобиля: 1');
  }

  if ((await prisma.testimonial.count()) === 0) {
    await prisma.testimonial.createMany({
      data: D.DEFAULT_TESTIMONIALS.map((t) => ({ ...t, isDemo: true })),
    });
    console.log(`  · ДЕМО отзывы: ${D.DEFAULT_TESTIMONIALS.length}`);
  }

  // ── Калькулятор: пороги, шаги, варианты ────────────────────────────────
  if ((await prisma.calculatorBudgetTier.count()) === 0) {
    await prisma.calculatorBudgetTier.createMany({ data: D.DEFAULT_BUDGET_TIERS });
    console.log(`  · пороги бюджета: ${D.DEFAULT_BUDGET_TIERS.length}`);
  }

  for (const step of D.DEFAULT_CALCULATOR_STEPS) {
    const saved = await prisma.calculatorStep.upsert({
      where: { key: step.key },
      create: {
        configId: 'calculator',
        key: step.key,
        kind: step.kind,
        title: step.title,
        hint: step.hint,
        searchable: step.searchable,
        required: step.required,
        rangeConfig: step.rangeConfig ?? undefined,
        sortOrder: step.sortOrder,
      },
      update: {},
    });

    for (const option of step.options) {
      await prisma.calculatorOption.upsert({
        where: { stepId_value: { stepId: saved.id, value: option.value } },
        create: {
          stepId: saved.id,
          label: option.label,
          value: option.value,
          hint: 'hint' in option ? ((option as { hint?: string }).hint ?? null) : null,
          multiplier: option.multiplier,
          addend: option.addend,
          sortOrder: option.sortOrder,
        },
        update: {},
      });
    }
  }
  console.log(`  · шаги калькулятора: ${D.DEFAULT_CALCULATOR_STEPS.length}`);

  await seedAdmin();

  console.log('\nГотово.');
  console.log('⚠️  Записи с пометкой ДЕМО (автомобили, отзывы, разбор) и параметры');
  console.log('   калькулятора требуют согласования — см. README, раздел «Данные,');
  console.log('   которые необходимо заменить перед production».');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
