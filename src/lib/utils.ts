import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 5250000 → «5 250 000 ₽» */
export function formatMoney(value: number, withCurrency = true): string {
  const n = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.round(value));
  return withCurrency ? `${n} ₽` : n;
}

/** 74000 → «74 000 км» */
export function formatMileage(value: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(value)} км`;
}

/** 1250000 → «1,25 млн ₽» — для компактных подписей слайдера. */
export function formatMoneyShort(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    const text = millions >= 10 ? millions.toFixed(0) : millions.toFixed(millions % 1 === 0 ? 0 : 1);
    return `${text.replace('.', ',')} млн ₽`;
  }
  if (value >= 1000) return `${Math.round(value / 1000)} тыс. ₽`;
  return `${value} ₽`;
}

/** «+7(953) 558-89-99» → «+79535588999» для href="tel:" */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('8')) return `+7${digits.slice(1)}`;
  if (digits.length === 11) return `+${digits}`;
  if (digits.length === 10) return `+7${digits}`;
  return `+${digits}`;
}

/** «+7(953) 558-89-99» → «+7 953 558-89-99» — единый вид на всём сайте. */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 11) return phone;
  const d = digits.startsWith('8') ? `7${digits.slice(1)}` : digits;
  return `+${d[0]} ${d.slice(1, 4)} ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9, 11)}`;
}

export function pluralRu(count: number, forms: [string, string, string]): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return forms[2];
  if (n1 > 1 && n1 < 5) return forms[1];
  if (n1 === 1) return forms[0];
  return forms[2];
}

export function formatDateTimeRu(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function absoluteUrl(path: string): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
  return path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
