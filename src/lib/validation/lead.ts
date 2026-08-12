import { z } from 'zod';

/** Российский номер в свободном формате: +7, 8, скобки, дефисы, пробелы. */
const phoneRegex = /^[+()\-\s\d]{10,25}$/;

export const LEAD_SOURCES = [
  'CALCULATOR',
  'FINAL_CTA',
  'HEADER',
  'SERVICE',
  'CONTACTS',
  'OTHER',
] as const;

export const calculatorPayloadSchema = z.object({
  budget: z.object({ from: z.number(), to: z.number() }).nullable(),
  choices: z.record(z.string(), z.array(z.string())),
});

export const leadInputSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Укажите имя')
    .max(80, 'Слишком длинное имя'),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Проверьте номер телефона')
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Проверьте номер телефона'),
  email: z
    .string()
    .trim()
    .max(120)
    .email('Проверьте адрес почты')
    .optional()
    .or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  consent: z.literal(true, { message: 'Требуется согласие на обработку данных' }),
  source: z.enum(LEAD_SOURCES).default('OTHER'),

  calculator: calculatorPayloadSchema.optional(),

  utmSource: z.string().max(200).optional(),
  utmMedium: z.string().max(200).optional(),
  utmCampaign: z.string().max(200).optional(),
  utmContent: z.string().max(200).optional(),
  utmTerm: z.string().max(200).optional(),
  pageUrl: z.string().max(500).optional(),
  referrer: z.string().max(500).optional(),

  /** Приманка для ботов: поле скрыто от людей и должно остаться пустым. */
  company: z.string().max(0, 'Ошибка отправки').optional(),
  /** Время открытия формы, мс. Мгновенная отправка — почти наверняка бот. */
  startedAt: z.number().int().nonnegative().optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

/** Минимальное время заполнения формы, мс. */
export const MIN_FILL_MS = 2500;

export function looksAutomated(input: LeadInput): boolean {
  if (input.company) return true;
  if (input.startedAt && Date.now() - input.startedAt < MIN_FILL_MS) return true;
  return false;
}
