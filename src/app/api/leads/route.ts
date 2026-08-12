import { NextResponse } from 'next/server';

import { prisma } from '@/lib/db';
import { getSiteContent } from '@/lib/content';
import { calculateEstimate, serializeAnswers } from '@/lib/calculator/engine';
import { leadInputSchema, looksAutomated } from '@/lib/validation/lead';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Не более 5 заявок с одного адреса за 10 минут. */
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

export async function POST(request: Request) {
  const ip = clientIp(request.headers);
  const limit = rateLimit(`lead:${ip}`, LIMIT, WINDOW_MS);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: 'Слишком много заявок. Попробуйте позже или позвоните нам.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный запрос' }, { status: 400 });
  }

  const parsed = leadInputSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === 'string' && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { ok: false, error: 'Проверьте заполнение формы', fieldErrors },
      { status: 422 },
    );
  }

  const input = parsed.data;

  // Ботам отвечаем успехом: молчаливое отбрасывание работает лучше,
  // чем сообщение об ошибке, по которому можно подобрать обход.
  const isSpam = looksAutomated(input);

  const content = await getSiteContent();

  // Итог пересчитывается на сервере из тех же настроек — значение,
  // пришедшее из браузера, не используется.
  let calculatorData: ReturnType<typeof serializeAnswers> | null = null;
  if (input.calculator) {
    const answers = { budget: input.calculator.budget, choices: input.calculator.choices };
    const estimate = calculateEstimate(content.calculator, answers);
    calculatorData = serializeAnswers(content.calculator, answers, estimate);
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        message: input.message || null,
        source: input.source,
        status: isSpam ? 'SPAM' : 'NEW',
        calculatorData: calculatorData ?? undefined,
        utmSource: input.utmSource ?? null,
        utmMedium: input.utmMedium ?? null,
        utmCampaign: input.utmCampaign ?? null,
        utmContent: input.utmContent ?? null,
        utmTerm: input.utmTerm ?? null,
        pageUrl: input.pageUrl ?? null,
        referrer: input.referrer ?? null,
      },
    });

    if (!isSpam) {
      // Доставка во внешнюю систему не должна задерживать ответ пользователю.
      void deliverWebhook(lead.id, {
        id: lead.id,
        createdAt: lead.createdAt.toISOString(),
        name: lead.name,
        phone: lead.phone,
        email: lead.email,
        message: lead.message,
        source: lead.source,
        calculator: calculatorData,
        utm: {
          source: lead.utmSource,
          medium: lead.utmMedium,
          campaign: lead.utmCampaign,
          content: lead.utmContent,
          term: lead.utmTerm,
        },
        pageUrl: lead.pageUrl,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[leads] не удалось сохранить заявку', error);
    return NextResponse.json(
      {
        ok: false,
        error: 'Не удалось отправить заявку. Позвоните нам — мы на связи с 8:00 до 20:00.',
      },
      { status: 500 },
    );
  }
}

async function deliverWebhook(leadId: string, payload: unknown) {
  const settings = await prisma.siteSettings
    .findUnique({ where: { id: 'site' } })
    .catch(() => null);

  const url = settings?.leadWebhookUrl || process.env.LEAD_WEBHOOK_URL;
  if (!url) return;

  const secret = settings?.leadWebhookSecret || process.env.LEAD_WEBHOOK_SECRET;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(secret ? { 'X-Webhook-Secret': secret } : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    await prisma.lead.update({
      where: { id: leadId },
      data: { webhookStatus: response.ok ? `ok ${response.status}` : `ошибка ${response.status}` },
    });
  } catch (error) {
    await prisma.lead
      .update({
        where: { id: leadId },
        data: { webhookStatus: `ошибка: ${error instanceof Error ? error.message : 'unknown'}` },
      })
      .catch(() => {});
  }
}
