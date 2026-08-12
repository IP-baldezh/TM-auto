import { z } from 'zod';
import type { AdminFieldDef } from '@/components/admin/ui';

/**
 * Описание редактируемых сущностей — общее для страницы и для server action.
 *
 * `fields` рисует форму, `schema` проверяет то, что пришло обратно. Второй
 * список — не дубль первого, а граница доверия: в Prisma попадают только
 * проверенные и явно перечисленные поля, что бы ни отправил браузер.
 */

const str = z.string().trim();
const optionalText = str.max(4000).optional().nullable();
const url = str.max(1000).optional().nullable();
const lines = z.array(str.max(500)).max(40).default([]);
const order = z.coerce.number().int().min(0).max(9999).default(0);
const flag = z.coerce.boolean().default(true);

export type EntityKey =
  | 'promotions'
  | 'trust'
  | 'services'
  | 'inspection'
  | 'cars'
  | 'process'
  | 'reasons'
  | 'cases'
  | 'testimonials'
  | 'faq'
  | 'contacts'
  | 'navigation'
  | 'sections'
  | 'calculatorSteps'
  | 'calculatorOptions'
  | 'budgetTiers';

export type SingletonKey = 'hero' | 'calculator' | 'settings' | 'seo';

export type EntityConfig = {
  title: string;
  singular: string;
  titleField: string;
  fields: AdminFieldDef[];
  schema: z.ZodType<Record<string, unknown>>;
  sortable: boolean;
  creatable: boolean;
  deletable: boolean;
};

const emptyToNull = (value: unknown) => (value === '' ? null : value);
const nullableText = z.preprocess(emptyToNull, optionalText);
const nullableUrl = z.preprocess(emptyToNull, url);
const nullableInt = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? null : v),
  z.coerce.number().int().nullable(),
);

export const ENTITIES: Record<EntityKey, EntityConfig> = {
  promotions: {
    title: 'Акции',
    singular: 'акцию',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Заголовок акции', type: 'text', required: true, wide: true },
      { name: 'subtitle', label: 'Подзаголовок', type: 'text', wide: true },
      { name: 'price', label: 'Цена по акции', type: 'text', required: true, placeholder: '0 руб.' },
      { name: 'oldPrice', label: 'Обычная цена (зачёркнутая)', type: 'text', placeholder: '30 000 руб.' },
      { name: 'ctaLabel', label: 'Текст кнопки', type: 'text' },
      {
        name: 'ctaHref',
        label: 'Ссылка кнопки',
        type: 'text',
        required: true,
        hint: 'Ссылка на WhatsApp или якорь на форму, например #cta',
      },
      {
        name: 'validUntil',
        label: 'Действует до',
        type: 'text',
        placeholder: '1 декабря 2026 года',
        hint: 'Текстом, как показывать на сайте. Пусто — срок не выводится.',
      },
      { name: 'imageUrl', label: 'Изображение автомобиля', type: 'image', wide: true },
      { name: 'imageAlt', label: 'Описание изображения (alt)', type: 'text' },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
      { name: 'isDemo', label: 'Демонстрационная акция', type: 'switch' },
    ],
    schema: z.object({
      title: str.min(1).max(200),
      subtitle: nullableText,
      price: str.min(1).max(60),
      oldPrice: nullableText,
      ctaLabel: str.min(1).max(80).default('написать в whatsapp'),
      ctaHref: str.min(1).max(500),
      validUntil: nullableText,
      imageUrl: nullableUrl,
      imageAlt: nullableText,
      enabled: flag,
      isDemo: z.coerce.boolean().default(false),
      sortOrder: order,
    }),
  },

  trust: {
    title: 'Полоса доверия',
    singular: 'тезис',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Заголовок', type: 'text', required: true },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
      { name: 'text', label: 'Описание', type: 'textarea', rows: 3, wide: true },
    ],
    schema: z.object({
      title: str.min(1).max(200),
      text: str.min(1).max(600),
      enabled: flag,
      sortOrder: order,
    }),
  },

  services: {
    title: 'Услуги',
    singular: 'услугу',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Название', type: 'text', required: true },
      { name: 'slug', label: 'Ключ (латиницей)', type: 'text', required: true, hint: 'Уникальный, например full-podbor' },
      { name: 'excerpt', label: 'Описание', type: 'textarea', rows: 6, wide: true },
      { name: 'outcomes', label: 'Что получает клиент', type: 'list', wide: true },
      { name: 'imageUrl', label: 'Изображение', type: 'image', wide: true },
      { name: 'imageAlt', label: 'Описание изображения (alt)', type: 'text' },
      { name: 'ctaLabel', label: 'Текст кнопки', type: 'text' },
      { name: 'ctaHref', label: 'Ссылка кнопки', type: 'text', placeholder: '#calculator' },
      { name: 'featured', label: 'Отметить как популярную', type: 'switch' },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
    ],
    schema: z.object({
      title: str.min(1).max(200),
      slug: str.min(1).max(80).regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
      excerpt: str.min(1).max(3000),
      outcomes: lines,
      imageUrl: nullableUrl,
      imageAlt: nullableText,
      ctaLabel: str.min(1).max(80).default('Оставить заявку'),
      ctaHref: str.min(1).max(300).default('#calculator'),
      featured: z.coerce.boolean().default(false),
      enabled: flag,
      sortOrder: order,
    }),
  },

  inspection: {
    title: 'Что мы проверяем',
    singular: 'категорию',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Название категории', type: 'text', required: true },
      { name: 'code', label: 'Ключ (латиницей)', type: 'text', required: true },
      { name: 'summary', label: 'Пояснение', type: 'textarea', rows: 4, wide: true },
      { name: 'points', label: 'Пункты проверки', type: 'list', wide: true },
      { name: 'imageUrl', label: 'Изображение', type: 'image', wide: true },
      { name: 'imageAlt', label: 'Описание изображения (alt)', type: 'text' },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
    ],
    schema: z.object({
      title: str.min(1).max(200),
      code: str.min(1).max(60).regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
      summary: str.min(1).max(2000),
      points: lines,
      imageUrl: nullableUrl,
      imageAlt: nullableText,
      enabled: flag,
      sortOrder: order,
    }),
  },

  cars: {
    title: 'Подобранные автомобили',
    singular: 'автомобиль',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Заголовок карточки', type: 'text', required: true, wide: true },
      { name: 'brand', label: 'Марка', type: 'text', required: true },
      { name: 'model', label: 'Модель', type: 'text', required: true },
      { name: 'year', label: 'Год выпуска', type: 'number', required: true },
      { name: 'mileage', label: 'Пробег, км', type: 'number' },
      { name: 'engine', label: 'Двигатель', type: 'text', placeholder: '3.0 Diesel' },
      { name: 'transmission', label: 'Коробка передач', type: 'text' },
      { name: 'drive', label: 'Привод', type: 'text', placeholder: 'xDrive' },
      { name: 'trim', label: 'Комплектация', type: 'text' },
      { name: 'location', label: 'Город поиска', type: 'text' },
      { name: 'searchDays', label: 'Срок поиска, дней', type: 'number' },
      { name: 'price', label: 'Цена автомобиля, ₽', type: 'number' },
      { name: 'savings', label: 'Экономия к цене объявления, ₽', type: 'number' },
      { name: 'imageUrl', label: 'Главное изображение', type: 'image', wide: true, required: true },
      { name: 'imageAlt', label: 'Описание изображения (alt)', type: 'text' },
      { name: 'videoUrl', label: 'Ссылка на видео', type: 'url' },
      { name: 'gallery', label: 'Галерея (ссылки)', type: 'list', wide: true },
      { name: 'description', label: 'Комментарий', type: 'textarea', rows: 3, wide: true },
      { name: 'handedOverAt', label: 'Дата передачи', type: 'date' },
      { name: 'featured', label: 'Показывать первым', type: 'switch' },
      { name: 'published', label: 'Опубликовано', type: 'switch' },
      { name: 'isDemo', label: 'Демонстрационная карточка', type: 'switch' },
    ],
    schema: z.object({
      title: str.min(1).max(200),
      brand: str.min(1).max(80),
      model: str.min(1).max(80),
      year: z.coerce.number().int().min(1950).max(2100),
      mileage: nullableInt,
      engine: nullableText,
      transmission: nullableText,
      drive: nullableText,
      trim: nullableText,
      location: nullableText,
      searchDays: nullableInt,
      price: nullableInt,
      savings: nullableInt,
      description: nullableText,
      imageUrl: str.min(1).max(1000),
      imageAlt: nullableText,
      gallery: lines,
      videoUrl: nullableUrl,
      handedOverAt: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? null : new Date(String(v))),
        z.date().nullable(),
      ),
      featured: z.coerce.boolean().default(false),
      published: flag,
      isDemo: z.coerce.boolean().default(false),
      sortOrder: order,
    }),
  },

  process: {
    title: 'Этапы работы',
    singular: 'этап',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Название этапа', type: 'text', required: true, wide: true },
      { name: 'text', label: 'Описание', type: 'textarea', rows: 3, wide: true },
      { name: 'detail', label: 'Уточнение', type: 'textarea', rows: 2, wide: true },
      { name: 'imageUrl', label: 'Изображение', type: 'image', wide: true },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
    ],
    schema: z.object({
      title: str.min(1).max(200),
      text: str.min(1).max(1000),
      detail: nullableText,
      imageUrl: nullableUrl,
      enabled: flag,
      sortOrder: order,
    }),
  },

  reasons: {
    title: 'Почему нам можно доверить подбор',
    singular: 'блок',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Заголовок', type: 'text', required: true, wide: true },
      { name: 'text', label: 'Описание', type: 'textarea', rows: 3, wide: true },
      {
        name: 'size',
        label: 'Размер плитки',
        type: 'select',
        options: [
          { value: 'LARGE', label: 'Большая' },
          { value: 'MEDIUM', label: 'Средняя' },
          { value: 'SMALL', label: 'Маленькая' },
        ],
      },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
      { name: 'imageUrl', label: 'Изображение', type: 'image', wide: true },
      { name: 'imageAlt', label: 'Описание изображения (alt)', type: 'text' },
    ],
    schema: z.object({
      title: str.min(1).max(200),
      text: str.min(1).max(1000),
      imageUrl: nullableUrl,
      imageAlt: nullableText,
      size: z.enum(['LARGE', 'MEDIUM', 'SMALL']).default('MEDIUM'),
      enabled: flag,
      sortOrder: order,
    }),
  },

  cases: {
    title: 'Разборы автомобилей',
    singular: 'разбор',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Заголовок', type: 'text', required: true, wide: true },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
      { name: 'listingTitle', label: 'Автомобиль из объявления', type: 'text', wide: true },
      { name: 'listingPrice', label: 'Цена в объявлении', type: 'text' },
      { name: 'isDemo', label: 'Демонстрационный кейс', type: 'switch' },
      { name: 'listingText', label: 'Что было написано в объявлении', type: 'textarea', rows: 3, wide: true },
      { name: 'findings', label: 'Что нашли при проверке', type: 'list', wide: true },
      { name: 'risks', label: 'Чем это грозило', type: 'list', wide: true },
      { name: 'decisionTitle', label: 'Заголовок решения', type: 'text', wide: true },
      { name: 'decisionText', label: 'Решение', type: 'textarea', rows: 3, wide: true },
      { name: 'images', label: 'Фотографии (ссылки)', type: 'list', wide: true },
      { name: 'imageAlt', label: 'Описание фотографий (alt)', type: 'text', wide: true },
    ],
    schema: z.object({
      title: str.min(1).max(200),
      listingTitle: str.min(1).max(300),
      listingPrice: nullableText,
      listingText: nullableText,
      findings: lines,
      risks: lines,
      decisionTitle: str.min(1).max(200),
      decisionText: str.min(1).max(3000),
      images: lines,
      imageAlt: nullableText,
      enabled: flag,
      isDemo: z.coerce.boolean().default(false),
      sortOrder: order,
    }),
  },

  testimonials: {
    title: 'Отзывы',
    singular: 'отзыв',
    titleField: 'author',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'author', label: 'Имя', type: 'text', required: true },
      { name: 'city', label: 'Город', type: 'text' },
      { name: 'carTitle', label: 'Подобранный автомобиль', type: 'text' },
      { name: 'rating', label: 'Оценка (1–5)', type: 'number' },
      { name: 'text', label: 'Текст отзыва', type: 'textarea', rows: 4, wide: true },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
      { name: 'isDemo', label: 'Демонстрационный отзыв', type: 'switch' },
    ],
    schema: z.object({
      author: str.min(1).max(120),
      city: nullableText,
      carTitle: nullableText,
      text: str.min(1).max(2000),
      rating: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? null : v),
        z.coerce.number().int().min(1).max(5).nullable(),
      ),
      enabled: flag,
      isDemo: z.coerce.boolean().default(false),
      sortOrder: order,
    }),
  },

  faq: {
    title: 'Вопросы и ответы',
    singular: 'вопрос',
    titleField: 'question',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'question', label: 'Вопрос', type: 'text', required: true, wide: true },
      { name: 'answer', label: 'Ответ', type: 'textarea', rows: 4, wide: true },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
    ],
    schema: z.object({
      question: str.min(1).max(300),
      answer: str.min(1).max(3000),
      enabled: flag,
      sortOrder: order,
    }),
  },

  contacts: {
    title: 'Телефоны подразделений',
    singular: 'телефон',
    titleField: 'label',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'label', label: 'Подразделение', type: 'text', required: true },
      { name: 'phone', label: 'Телефон', type: 'text', required: true, placeholder: '+7 (953) 558-89-99' },
      {
        name: 'isPrimary',
        label: 'Телефон автоподбора',
        type: 'switch',
        hint: 'Показывается в шапке и на главном экране',
      },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
    ],
    schema: z.object({
      label: str.min(1).max(120),
      phone: str.min(6).max(40),
      isPrimary: z.coerce.boolean().default(false),
      enabled: flag,
      sortOrder: order,
    }),
  },

  navigation: {
    title: 'Меню',
    singular: 'пункт',
    titleField: 'label',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'label', label: 'Название пункта', type: 'text', required: true },
      { name: 'href', label: 'Ссылка', type: 'text', required: true, placeholder: '#services' },
      {
        name: 'group',
        label: 'Расположение',
        type: 'select',
        options: [
          { value: 'HEADER', label: 'Шапка' },
          { value: 'FOOTER', label: 'Подвал' },
          { value: 'LEGAL', label: 'Документы' },
        ],
      },
      { name: 'external', label: 'Открывать в новой вкладке', type: 'switch' },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
    ],
    schema: z.object({
      label: str.min(1).max(120),
      href: str.min(1).max(500),
      group: z.enum(['HEADER', 'FOOTER', 'LEGAL']).default('HEADER'),
      external: z.coerce.boolean().default(false),
      enabled: flag,
      sortOrder: order,
    }),
  },

  sections: {
    title: 'Секции и заголовки',
    singular: 'секцию',
    titleField: 'label',
    sortable: false,
    creatable: false,
    deletable: false,
    fields: [
      { name: 'label', label: 'Секция', type: 'text', required: true },
      { name: 'enabled', label: 'Показывать секцию', type: 'switch' },
      { name: 'title', label: 'Заголовок', type: 'text', wide: true },
      { name: 'subtitle', label: 'Подзаголовок', type: 'textarea', rows: 2, wide: true },
    ],
    schema: z.object({
      label: str.min(1).max(120),
      title: nullableText,
      subtitle: nullableText,
      enabled: flag,
    }),
  },

  calculatorSteps: {
    title: 'Шаги калькулятора',
    singular: 'шаг',
    titleField: 'title',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'title', label: 'Вопрос', type: 'text', required: true, wide: true },
      { name: 'key', label: 'Ключ (латиницей)', type: 'text', required: true },
      {
        name: 'kind',
        label: 'Тип шага',
        type: 'select',
        options: [
          { value: 'SINGLE', label: 'Один вариант' },
          { value: 'MULTI', label: 'Несколько вариантов' },
          { value: 'RANGE', label: 'Диапазон (бюджет)' },
        ],
      },
      { name: 'hint', label: 'Подсказка', type: 'textarea', rows: 2, wide: true },
      { name: 'searchable', label: 'Поиск по вариантам', type: 'switch' },
      { name: 'required', label: 'Обязательный шаг', type: 'switch' },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
    ],
    schema: z.object({
      key: str.min(1).max(60).regex(/^[a-z0-9-]+$/, 'Только латиница, цифры и дефис'),
      kind: z.enum(['RANGE', 'SINGLE', 'MULTI']).default('SINGLE'),
      title: str.min(1).max(300),
      hint: nullableText,
      searchable: z.coerce.boolean().default(false),
      required: flag,
      enabled: flag,
      sortOrder: order,
    }),
  },

  calculatorOptions: {
    title: 'Варианты ответа',
    singular: 'вариант',
    titleField: 'label',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'label', label: 'Название варианта', type: 'text', required: true },
      { name: 'value', label: 'Значение (латиницей)', type: 'text', required: true },
      { name: 'hint', label: 'Пояснение', type: 'text', wide: true },
      {
        name: 'multiplier',
        label: 'Коэффициент (×)',
        type: 'number',
        hint: '1 — не влияет на итог',
      },
      { name: 'addend', label: 'Надбавка, ₽ (+)', type: 'number' },
      { name: 'enabled', label: 'Показывать', type: 'switch' },
    ],
    schema: z.object({
      label: str.min(1).max(200),
      value: str.min(1).max(60),
      hint: nullableText,
      multiplier: z.coerce.number().min(0).max(20).default(1),
      addend: z.coerce.number().int().min(-1_000_000).max(1_000_000).default(0),
      enabled: flag,
      sortOrder: order,
    }),
  },

  budgetTiers: {
    title: 'Пороги по бюджету',
    singular: 'порог',
    titleField: 'label',
    sortable: true,
    creatable: true,
    deletable: true,
    fields: [
      { name: 'label', label: 'Название', type: 'text', required: true },
      {
        name: 'upTo',
        label: 'Действует до суммы, ₽',
        type: 'number',
        hint: 'Пусто — «и выше». Порог выбирается по верхней границе бюджета.',
      },
      { name: 'multiplier', label: 'Коэффициент (×)', type: 'number' },
      { name: 'addend', label: 'Надбавка, ₽ (+)', type: 'number' },
    ],
    schema: z.object({
      label: str.min(1).max(120),
      upTo: nullableInt,
      multiplier: z.coerce.number().min(0).max(20).default(1),
      addend: z.coerce.number().int().min(-1_000_000).max(1_000_000).default(0),
      sortOrder: order,
    }),
  },
};

// ── Синглтоны ────────────────────────────────────────────────────────────

export const SINGLETONS: Record<
  SingletonKey,
  { title: string; description?: string; fields: AdminFieldDef[]; schema: z.ZodType<Record<string, unknown>> }
> = {
  hero: {
    title: 'Главный экран',
    description:
      'Параллакс собирается из слоёв: дальний фон, заголовок и автомобиль. Заголовок разбит на три строки, вторая выделяется красным.',
    fields: [
      {
        name: 'titleLead',
        label: 'Заголовок',
        type: 'text',
        required: true,
        wide: true,
        hint: 'Крупная строка в центре экрана. Держите её короткой — она набирается очень большим кеглем.',
      },
      {
        name: 'titleAccent',
        label: 'Подпись под заголовком',
        type: 'text',
        wide: true,
        hint: 'Мелкая строка вразрядку. Пусто — подписи не будет.',
      },
      {
        name: 'titleTail',
        label: 'Вторая строка заголовка',
        type: 'text',
        wide: true,
        hint: 'Необязательно. Заполните, если заголовок нужно разбить на две крупные строки.',
      },
      { name: 'subtitle', label: 'Подзаголовок', type: 'textarea', rows: 3, wide: true },
      { name: 'trustLine', label: 'Строка доверия', type: 'text', wide: true },
      { name: 'primaryLabel', label: 'Кнопка 1 — текст', type: 'text' },
      { name: 'primaryHref', label: 'Кнопка 1 — ссылка', type: 'text' },
      { name: 'secondaryLabel', label: 'Кнопка 2 — текст', type: 'text' },
      { name: 'secondaryHref', label: 'Кнопка 2 — ссылка', type: 'text' },
      {
        name: 'layerSkyUrl',
        label: 'Слой 1 — дальний фон',
        type: 'image',
        wide: true,
        hint: 'Изображение сильно размывается и затемняется — подойдёт атмосферный городской или дорожный кадр.',
      },
      {
        name: 'layerCarUrl',
        label: 'Слой 4 — автомобиль',
        type: 'image',
        wide: true,
        hint: 'Главный кадр сцены. Заголовок проходит за ним.',
      },
      {
        name: 'layerCarIsCutout',
        label: 'Автомобиль вырезан (PNG с прозрачностью)',
        type: 'switch',
        hint: 'Включите, если загрузили изображение без фона — тогда маска не применяется.',
      },
      { name: 'enabled', label: 'Показывать секцию', type: 'switch' },
    ],
    schema: z.object({
      titleLead: str.min(1).max(120),
      /** Подпись и вторая крупная строка необязательны. */
      titleAccent: str.max(120),
      titleTail: str.max(120),
      subtitle: str.min(1).max(1000),
      trustLine: nullableText,
      primaryLabel: str.min(1).max(80),
      primaryHref: str.min(1).max(300),
      secondaryLabel: str.min(1).max(80),
      secondaryHref: str.min(1).max(300),
      layerSkyUrl: str.min(1).max(1000),
      layerCarUrl: str.min(1).max(1000),
      layerCarIsCutout: z.coerce.boolean().default(false),
      enabled: flag,
    }),
  },

  calculator: {
    title: 'Калькулятор — параметры расчёта',
    description:
      'Итог = (базовая стоимость + сумма надбавок) × произведение коэффициентов, затем округление и ограничение минимумом и максимумом.',
    fields: [
      { name: 'title', label: 'Заголовок секции', type: 'text', required: true, wide: true },
      { name: 'enabled', label: 'Показывать секцию', type: 'switch' },
      { name: 'subtitle', label: 'Подзаголовок', type: 'textarea', rows: 2, wide: true },
      { name: 'baseFee', label: 'Базовая стоимость, ₽', type: 'number', required: true },
      { name: 'roundTo', label: 'Округление, ₽', type: 'number' },
      { name: 'minEstimate', label: 'Минимальная оценка, ₽', type: 'number' },
      { name: 'maxEstimate', label: 'Максимальная оценка, ₽', type: 'number' },
      {
        name: 'spread',
        label: 'Ширина вилки (доля)',
        type: 'number',
        hint: '0.15 — показывать ±15% вокруг оценки',
      },
      {
        name: 'reserveShare',
        label: 'Резерв на обслуживание (доля бюджета)',
        type: 'number',
        hint: '0.05 — 5% от верхней границы бюджета',
      },
      { name: 'resultTitle', label: 'Заголовок результата', type: 'text', wide: true },
      { name: 'resultNote', label: 'Пояснение к результату', type: 'textarea', rows: 2, wide: true },
      { name: 'ctaLabel', label: 'Текст кнопки отправки', type: 'text', wide: true },
      { name: 'successTitle', label: 'Заголовок после отправки', type: 'text' },
      { name: 'successText', label: 'Текст после отправки', type: 'text' },
      { name: 'disclaimer', label: 'Дисклеймер', type: 'textarea', rows: 3, wide: true },
    ],
    schema: z.object({
      title: str.min(1).max(300),
      subtitle: nullableText,
      baseFee: z.coerce.number().int().min(0).max(10_000_000),
      minEstimate: z.coerce.number().int().min(0).max(10_000_000).default(0),
      maxEstimate: z.coerce.number().int().min(0).max(10_000_000).default(1_000_000),
      roundTo: z.coerce.number().int().min(1).max(100_000).default(1000),
      spread: z.coerce.number().min(0).max(1).default(0.15),
      reserveShare: z.coerce.number().min(0).max(1).default(0.05),
      resultTitle: str.min(1).max(200),
      resultNote: nullableText,
      disclaimer: str.min(1).max(2000),
      ctaLabel: str.min(1).max(120),
      successTitle: str.min(1).max(200),
      successText: str.min(1).max(600),
      enabled: flag,
    }),
  },

  settings: {
    title: 'Настройки сайта',
    fields: [
      { name: 'brandName', label: 'Название', type: 'text', required: true },
      { name: 'brandNote', label: 'Подпись под названием', type: 'text' },
      { name: 'logoUrl', label: 'Логотип', type: 'image', wide: true },
      { name: 'city', label: 'Город', type: 'text' },
      { name: 'address', label: 'Адрес', type: 'text', required: true, wide: true },
      { name: 'hours', label: 'Режим работы', type: 'text', wide: true },
      { name: 'email', label: 'E-mail', type: 'text' },
      { name: 'routeUrl', label: 'Ссылка «Проложить маршрут»', type: 'url', wide: true },
      {
        name: 'mapEmbedUrl',
        label: 'Ссылка встраиваемой карты',
        type: 'url',
        wide: true,
        hint: 'Пусто — карта не показывается',
      },
      { name: 'mapLat', label: 'Широта', type: 'number' },
      { name: 'mapLng', label: 'Долгота', type: 'number' },
      { name: 'whatsappUrl', label: 'WhatsApp', type: 'url', hint: 'Пусто — кнопка не показывается' },
      { name: 'telegramUrl', label: 'Telegram', type: 'url', hint: 'Пусто — кнопка не показывается' },
      { name: 'maxUrl', label: 'MAX', type: 'url' },
      { name: 'vkUrl', label: 'ВКонтакте', type: 'url' },
      { name: 'legalName', label: 'Юридическое название', type: 'text' },
      { name: 'legalInn', label: 'ИНН', type: 'text' },
      { name: 'privacyUrl', label: 'Ссылка на политику', type: 'text' },
      { name: 'consentUrl', label: 'Ссылка на согласие', type: 'text' },
      {
        name: 'leadWebhookUrl',
        label: 'Webhook для заявок',
        type: 'url',
        wide: true,
        hint: 'На этот адрес уходит POST с JSON по каждой новой заявке. Пусто — отключено.',
      },
      {
        name: 'leadWebhookSecret',
        label: 'Секрет вебхука',
        type: 'text',
        wide: true,
        hint: 'Передаётся в заголовке X-Webhook-Secret',
      },
    ],
    schema: z.object({
      brandName: str.min(1).max(120),
      brandNote: str.max(120).default(''),
      logoUrl: nullableUrl,
      city: str.min(1).max(120),
      address: str.min(1).max(300),
      hours: str.min(1).max(200),
      email: nullableText,
      whatsappUrl: nullableUrl,
      telegramUrl: nullableUrl,
      vkUrl: nullableUrl,
      maxUrl: nullableUrl,
      routeUrl: nullableUrl,
      mapEmbedUrl: nullableUrl,
      mapLat: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? null : v),
        z.coerce.number().min(-90).max(90).nullable(),
      ),
      mapLng: z.preprocess(
        (v) => (v === '' || v === null || v === undefined ? null : v),
        z.coerce.number().min(-180).max(180).nullable(),
      ),
      legalName: nullableText,
      legalInn: nullableText,
      leadWebhookUrl: nullableUrl,
      leadWebhookSecret: nullableText,
      privacyUrl: str.min(1).max(300),
      consentUrl: str.min(1).max(300),
    }),
  },

  seo: {
    title: 'SEO',
    description: 'Основной запрос страницы — «подбор авто в Дзержинске».',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true, wide: true },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3, wide: true },
      { name: 'h1', label: 'H1', type: 'text', wide: true },
      { name: 'keywords', label: 'Ключевые слова', type: 'textarea', rows: 2, wide: true },
      { name: 'ogTitle', label: 'OG Title', type: 'text', wide: true },
      { name: 'ogDescription', label: 'OG Description', type: 'textarea', rows: 2, wide: true },
      { name: 'ogImageUrl', label: 'OG Image', type: 'image', wide: true },
      { name: 'canonicalUrl', label: 'Canonical', type: 'url', wide: true },
      {
        name: 'robots',
        label: 'Robots',
        type: 'select',
        options: [
          { value: 'index,follow', label: 'index, follow' },
          { value: 'noindex,follow', label: 'noindex, follow' },
          { value: 'noindex,nofollow', label: 'noindex, nofollow' },
        ],
      },
    ],
    schema: z.object({
      title: str.min(1).max(300),
      description: str.min(1).max(600),
      h1: str.min(1).max(300),
      keywords: nullableText,
      ogTitle: nullableText,
      ogDescription: nullableText,
      ogImageUrl: nullableUrl,
      canonicalUrl: nullableUrl,
      robots: str.min(1).max(60),
    }),
  },
};
