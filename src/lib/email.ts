import nodemailer from 'nodemailer';

const NOTIFY_EMAILS = ['moskalev_tmn@mail.ru', 'mike_badgo@mail.ru'];

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 465);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export interface LeadEmailData {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  pageUrl?: string | null;
}

export async function sendLeadNotification(lead: LeadEmailData): Promise<void> {
  const transport = createTransport();
  if (!transport) return;

  const from = process.env.SMTP_FROM || process.env.SMTP_USER!;

  const entries: [string, string][] = [
    ['Имя', lead.name],
    ['Телефон', lead.phone],
    ...(lead.email ? [['Email', lead.email] as [string, string]] : []),
    ...(lead.message ? [['Сообщение', lead.message] as [string, string]] : []),
    ['Источник', lead.source],
    ...(lead.pageUrl ? [['Страница', lead.pageUrl] as [string, string]] : []),
  ];

  const rows = entries
    .map(([k, v]) => `<tr><td style="color:#6b7585;padding:6px 12px 6px 0;white-space:nowrap;font-size:13px">${k}</td><td style="padding:6px 0;font-size:14px;font-weight:600">${v}</td></tr>`)
    .join('');

  const html = `
<div style="font-family:system-ui,sans-serif;max-width:520px">
  <div style="background:#1a2234;color:#fff;padding:20px 24px;border-radius:8px 8px 0 0">
    <strong style="font-size:16px">Новая заявка — ТМ Авто</strong>
  </div>
  <div style="background:#fff;border:1px solid #e4e7ed;border-top:none;padding:20px 24px;border-radius:0 0 8px 8px">
    <table style="border-collapse:collapse;width:100%">${rows}</table>
  </div>
</div>`;

  await transport.sendMail({
    from: `"ТМ Авто" <${from}>`,
    to: NOTIFY_EMAILS.join(', '),
    subject: `Новая заявка: ${lead.name} ${lead.phone}`,
    html,
    text: `Новая заявка\n\nИмя: ${lead.name}\nТелефон: ${lead.phone}${lead.email ? `\nEmail: ${lead.email}` : ''}${lead.message ? `\nСообщение: ${lead.message}` : ''}\nИсточник: ${lead.source}`,
  });
}
