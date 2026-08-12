'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { prisma } from '@/lib/db';
import { requireAdminForAction } from '@/lib/auth/guard';
import { createSession, destroySession, verifyPassword } from '@/lib/auth/session';
import { ENTITIES, SINGLETONS, type EntityKey, type SingletonKey } from '@/lib/admin/entities';
import { rateLimit } from '@/lib/rate-limit';

export type ActionResult = { ok: true } | { ok: false; error: string };

/**
 * Prisma-делегаты у разных моделей имеют разные типы, а обработчик один.
 * Приведение сделано ровно в одной точке и безопасно: до Prisma доходят
 * только поля, прошедшие zod-схему соответствующей сущности, — всё
 * остальное из запроса отбрасывается.
 */
type Delegate = {
  create(args: { data: Record<string, unknown> }): Promise<{ id: string }>;
  update(args: { where: { id: string }; data: Record<string, unknown> }): Promise<unknown>;
  delete(args: { where: { id: string } }): Promise<unknown>;
};

const asDelegate = (model: unknown) => model as Delegate;

const DELEGATES: Record<EntityKey, Delegate> = {
  promotions: asDelegate(prisma.promotion),
  trust: asDelegate(prisma.trustItem),
  services: asDelegate(prisma.service),
  inspection: asDelegate(prisma.inspectionCategory),
  cars: asDelegate(prisma.deliveredCar),
  process: asDelegate(prisma.processStep),
  reasons: asDelegate(prisma.trustReason),
  cases: asDelegate(prisma.caseStudy),
  testimonials: asDelegate(prisma.testimonial),
  faq: asDelegate(prisma.faqItem),
  contacts: asDelegate(prisma.contactChannel),
  navigation: asDelegate(prisma.navigationItem),
  sections: asDelegate(prisma.sectionBlock),
  calculatorSteps: asDelegate(prisma.calculatorStep),
  calculatorOptions: asDelegate(prisma.calculatorOption),
  budgetTiers: asDelegate(prisma.calculatorBudgetTier),
};

function refresh() {
  revalidatePath('/', 'layout');
}

function describeError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes('Unique constraint')) {
      return 'Такое значение уже используется — измените ключ или значение.';
    }
    if (error.message.includes('Требуется вход')) return error.message;
  }
  return 'Не удалось сохранить. Проверьте подключение к базе данных.';
}

// ── Списки ───────────────────────────────────────────────────────────────

export async function saveEntityItem(
  entity: EntityKey,
  id: string | null,
  values: Record<string, unknown>,
  parent?: { stepId?: string },
): Promise<ActionResult> {
  try {
    await requireAdminForAction();

    const config = ENTITIES[entity];
    const parsed = config.schema.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { ok: false, error: first ? `${first.path.join('.')}: ${first.message}` : 'Проверьте поля' };
    }

    const data: Record<string, unknown> = { ...parsed.data };
    if (entity === 'calculatorOptions' && parent?.stepId) data.stepId = parent.stepId;

    if (id) {
      await DELEGATES[entity].update({ where: { id }, data });
    } else {
      await DELEGATES[entity].create({ data });
    }

    refresh();
    return { ok: true };
  } catch (error) {
    console.error(`[admin] сохранение ${entity}`, error);
    return { ok: false, error: describeError(error) };
  }
}

export async function deleteEntityItem(entity: EntityKey, id: string): Promise<ActionResult> {
  try {
    await requireAdminForAction();
    await DELEGATES[entity].delete({ where: { id } });
    refresh();
    return { ok: true };
  } catch (error) {
    console.error(`[admin] удаление ${entity}`, error);
    return { ok: false, error: 'Не удалось удалить запись.' };
  }
}

export async function reorderEntity(entity: EntityKey, ids: string[]): Promise<ActionResult> {
  try {
    await requireAdminForAction();
    // Последовательно, а не транзакцией: делегаты здесь приведены к общему
    // типу и теряют PrismaPromise, который нужен $transaction. Операция
    // идемпотентна, поэтому частичное применение безопасно — порядок
    // допишется при следующем перетаскивании.
    for (const [index, id] of ids.entries()) {
      await DELEGATES[entity].update({ where: { id }, data: { sortOrder: index } });
    }
    refresh();
    return { ok: true };
  } catch (error) {
    console.error(`[admin] сортировка ${entity}`, error);
    return { ok: false, error: 'Не удалось сохранить порядок.' };
  }
}

// ── Синглтоны ────────────────────────────────────────────────────────────

const SINGLETON_IDS: Record<SingletonKey, string> = {
  hero: 'hero',
  calculator: 'calculator',
  settings: 'site',
  seo: 'seo',
};

export async function saveSingleton(
  key: SingletonKey,
  values: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    await requireAdminForAction();

    const config = SINGLETONS[key];
    const parsed = config.schema.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return { ok: false, error: first ? `${first.path.join('.')}: ${first.message}` : 'Проверьте поля' };
    }

    const id = SINGLETON_IDS[key];
    const data = parsed.data;

    switch (key) {
      case 'hero':
        await prisma.heroSection.upsert({
          where: { id },
          create: { id, ...data } as never,
          update: data as never,
        });
        break;
      case 'calculator':
        await prisma.calculatorConfig.upsert({
          where: { id },
          create: { id, ...data } as never,
          update: data as never,
        });
        break;
      case 'settings':
        await prisma.siteSettings.upsert({
          where: { id },
          create: { id, ...data } as never,
          update: data as never,
        });
        break;
      case 'seo':
        await prisma.seoSettings.upsert({
          where: { id },
          create: { id, ...data } as never,
          update: data as never,
        });
        break;
    }

    refresh();
    return { ok: true };
  } catch (error) {
    console.error(`[admin] сохранение ${key}`, error);
    return { ok: false, error: describeError(error) };
  }
}

// ── Заявки ───────────────────────────────────────────────────────────────

export async function updateLeadStatus(
  id: string,
  status: 'NEW' | 'IN_PROGRESS' | 'DONE' | 'SPAM',
): Promise<ActionResult> {
  try {
    await requireAdminForAction();
    await prisma.lead.update({ where: { id }, data: { status } });
    revalidatePath('/admin/leads');
    return { ok: true };
  } catch (error) {
    console.error('[admin] статус заявки', error);
    return { ok: false, error: 'Не удалось изменить статус.' };
  }
}

export async function saveLeadNote(id: string, note: string): Promise<ActionResult> {
  try {
    await requireAdminForAction();
    await prisma.lead.update({ where: { id }, data: { adminNote: note.slice(0, 2000) } });
    revalidatePath('/admin/leads');
    return { ok: true };
  } catch (error) {
    console.error('[admin] заметка к заявке', error);
    return { ok: false, error: 'Не удалось сохранить заметку.' };
  }
}

export async function deleteLead(id: string): Promise<ActionResult> {
  try {
    await requireAdminForAction();
    await prisma.lead.delete({ where: { id } });
    revalidatePath('/admin/leads');
    return { ok: true };
  } catch (error) {
    console.error('[admin] удаление заявки', error);
    return { ok: false, error: 'Не удалось удалить заявку.' };
  }
}

// ── Вход и выход ─────────────────────────────────────────────────────────

export type LoginState = { error: string | null };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) return { error: 'Введите e-mail и пароль' };

  // Ограничение перебора: 10 попыток на адрес за 15 минут.
  const limit = rateLimit(`login:${email}`, 10, 15 * 60 * 1000);
  if (!limit.ok) {
    return { error: `Слишком много попыток. Повторите через ${Math.ceil(limit.retryAfterSec / 60)} мин.` };
  }

  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });

    // Пароль сверяем даже при отсутствии пользователя: иначе по времени
    // ответа можно определить, какие адреса зарегистрированы.
    const hash = user?.passwordHash ?? '$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidin';
    const valid = await verifyPassword(password, hash);

    if (!user || !valid) return { error: 'Неверный e-mail или пароль' };

    await createSession(user.id);
  } catch (error) {
    console.error('[admin] вход', error);
    return { error: 'Не удалось выполнить вход. Проверьте подключение к базе данных.' };
  }

  redirect('/admin');
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect('/admin/login');
}
