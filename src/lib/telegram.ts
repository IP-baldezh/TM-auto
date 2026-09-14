const TELEGRAM_API = 'https://api.telegram.org';

function getChatIds(): string[] {
  const raw = process.env.TELEGRAM_CHAT_IDS ?? '';
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export interface LeadTelegramData {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  pageUrl?: string | null;
}

export async function sendLeadToTelegram(lead: LeadTelegramData): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = getChatIds();
  if (!token || chatIds.length === 0) return;

  const lines = [
    '🔔 <b>Новая заявка — ТМ Авто</b>',
    '',
    `👤 <b>Имя:</b> ${esc(lead.name)}`,
    `📞 <b>Телефон:</b> ${esc(lead.phone)}`,
    lead.email ? `✉️ <b>Email:</b> ${esc(lead.email)}` : null,
    lead.message ? `💬 <b>Сообщение:</b> ${esc(lead.message)}` : null,
    `📌 <b>Источник:</b> ${esc(lead.source)}`,
    lead.pageUrl ? `🌐 <b>Страница:</b> ${esc(lead.pageUrl)}` : null,
  ].filter((l) => l !== null).join('\n');

  const results = await Promise.allSettled(
    chatIds.map((chatId) =>
      fetch(`${TELEGRAM_API}/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: lines, parse_mode: 'HTML' }),
        signal: AbortSignal.timeout(8000),
      }),
    ),
  );
  for (const r of results) {
    if (r.status === 'rejected') console.error('[telegram] не удалось отправить', r.reason);
  }
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
