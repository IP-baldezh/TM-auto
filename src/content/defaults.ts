/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Единственный источник содержимого «из коробки».
 *
 *  Используется дважды:
 *    1. prisma/seed.ts   — первичное наполнение базы;
 *    2. lib/content.ts   — значения по умолчанию, когда база недоступна,
 *                          чтобы сборка и сайт не падали без Postgres.
 *
 *  ⚠️  МАРКИРОВКА ДАННЫХ
 *  Тексты услуг, контакты, адрес и телефоны взяты с действующего сайта
 *  https://sunservice-auto.ru/podbor и являются реальными.
 *
 *  Всё, что помечено `isDemo: true` или комментарием DEMO — придумано для
 *  наполнения макета и ДОЛЖНО быть заменено до публикации.
 *  Полный список — в README, раздел «Данные, которые необходимо заменить
 *  перед production».
 * ─────────────────────────────────────────────────────────────────────────
 */

/** Unsplash (Unsplash License). DEMO-изображения, заменяются через админку. */
const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;

export const IMAGES = {
  heroSky: img('1493238792000-8113da705763', 2000),
  heroCar: img('1580273916550-e323be2ae537', 1800),
  bodyPaint: img('1558618666-fcd25c85cd64', 1400),
  engineBelts: img('1487754180451-c456f719a1fc', 1400),
  engineHands: img('1619642751034-765dfdf7c58e', 1400),
  cockpit: img('1449965408869-eaa3f722e40d', 1400),
  serviceBay: img('1625047509168-a7026f36de04', 1400),
  highway: img('1503376780353-7e6692767b70', 1400),
  workshop: img('1530046339160-ce3e530c7d2f', 1400),
  fluids: img('1492144534655-ae79c964c9d7', 1400),
  darkGarage: img('1541899481282-d53bffe3c35d', 1400),
  carBlue: img('1568605117036-5fe5e7bab0b7', 1400),
  carPolo: img('1494976388531-d1058494cdd8', 1400),
  carQ5: img('1517524008697-84bbe3c3fd98', 1400),
  carMustang: img('1547744152-14d985cb937f', 1400),
} as const;

// ── Настройки сайта (реальные данные Sunservice) ─────────────────────────

export const DEFAULT_SITE = {
  id: 'site',
  brandName: 'ТМ Авто',
  brandNote: 'В автобизнесе с 2012 года',
  logoUrl: null as string | null,
  city: 'Дзержинск',
  address: 'Дзержинск, ул. Самохвалова, д. 6Б',
  hours: '8:00–20:00, без выходных',
  email: null as string | null,
  whatsappUrl: null as string | null,
  telegramUrl: null as string | null,
  vkUrl: null as string | null,
  maxUrl: null as string | null,
  routeUrl: 'https://yandex.ru/maps/?text=Дзержинск, улица Самохвалова, 6Б',
  mapEmbedUrl:
    'https://yandex.ru/map-widget/v1/?text=Дзержинск%2C%20улица%20Самохвалова%2C%206Б&z=16',
  mapLat: null as number | null,
  mapLng: null as number | null,
  legalName: null as string | null,
  legalInn: null as string | null,
  leadWebhookUrl: null as string | null,
  leadWebhookSecret: null as string | null,
  privacyUrl: '/privacy',
  consentUrl: '/consent',
};

export const DEFAULT_CONTACTS = [
  { label: 'Авто под заказ и подбор', phone: '+7 (000) 000-00-00', isPrimary: true, sortOrder: 0 },
];

// ── Навигация ────────────────────────────────────────────────────────────

export const DEFAULT_NAVIGATION = [
  { group: 'HEADER' as const, label: 'Услуги', href: '#directions', sortOrder: 0 },
  { group: 'HEADER' as const, label: 'Как работаем', href: '#services', sortOrder: 1 },
  { group: 'HEADER' as const, label: 'Автомобили', href: '#cars', sortOrder: 3 },
  { group: 'HEADER' as const, label: 'Рассчитать стоимость', href: '#calculator', sortOrder: 4 },
  { group: 'HEADER' as const, label: 'Контакты', href: '#contacts', sortOrder: 5 },

  { group: 'FOOTER' as const, label: 'Услуги', href: '#directions', sortOrder: 0 },
  { group: 'FOOTER' as const, label: 'Автомобили', href: '#cars', sortOrder: 1 },
  { group: 'FOOTER' as const, label: 'Как работаем', href: '#services', sortOrder: 2 },
  { group: 'FOOTER' as const, label: 'Вопросы и ответы', href: '#faq', sortOrder: 4 },
  { group: 'FOOTER' as const, label: 'Контакты', href: '#contacts', sortOrder: 5 },

  { group: 'LEGAL' as const, label: 'Политика конфиденциальности', href: '/privacy', sortOrder: 0 },
  {
    group: 'LEGAL' as const,
    label: 'Согласие на обработку персональных данных',
    href: '/consent',
    sortOrder: 1,
  },
];

// ── Заголовки и видимость секций ─────────────────────────────────────────

/**
 * Надзаголовки (eyebrow) на сайте не выводятся — секции представляет только
 * крупный заголовок. Поле оставлено в модели ради совместимости с базой.
 */
export const DEFAULT_SECTIONS = [
  {
    key: 'promotions',
    label: 'Акции',
    eyebrow: null,
    title: 'Актуальные акции на авто из-за рубежа',
    subtitle: null,
    sortOrder: 0,
  },
  {
    key: 'services',
    label: 'Услуги',
    eyebrow: null,
    title: 'Как мы работаем',
    subtitle: 'Пять шагов от заявки до ключей в руках — берём на себя всё.',
    sortOrder: 1,
  },
  {
    key: 'inspection',
    label: 'Предотгрузочная инспекция',
    eyebrow: null,
    title: 'Проверяем авто до оплаты',
    subtitle:
      'Наш агент осматривает автомобиль на месте — вы видите реальное состояние, а не слова продавца.',
    sortOrder: 2,
  },
  {
    key: 'calculator',
    label: 'Калькулятор',
    eyebrow: null,
    title: null,
    subtitle: null,
    sortOrder: 3,
  },
  {
    key: 'cars',
    label: 'Пригнанные автомобили',
    eyebrow: null,
    title: 'Автомобили, которые мы уже привезли',
    subtitle: null,
    sortOrder: 4,
  },
  {
    key: 'process',
    label: 'Как мы работаем',
    eyebrow: null,
    title: 'От заявки до ключей — шаг за шагом',
    subtitle: null,
    enabled: false,
    sortOrder: 5,
  },
  {
    key: 'reasons',
    label: 'Почему выбирают нас',
    eyebrow: null,
    title: 'Почему выбирают нас',
    subtitle: null,
    enabled: false,
    sortOrder: 6,
  },
  {
    key: 'case',
    label: 'Разбор автомобиля',
    eyebrow: null,
    title: null,
    subtitle: null,
    sortOrder: 7,
  },
  {
    key: 'testimonials',
    label: 'Отзывы',
    eyebrow: 'Реальные истории',
    title: 'Отзывы клиентов',
    subtitle: null,
    enabled: false,
    sortOrder: 8,
  },
  {
    key: 'faq',
    label: 'Вопросы и ответы',
    eyebrow: null,
    title: 'Ответы на частые вопросы',
    subtitle: null,
    sortOrder: 9,
  },
  {
    key: 'cta',
    label: 'Финальная заявка',
    eyebrow: null,
    title: 'Расскажите, какой автомобиль Вас интересует',
    subtitle:
      'Марка, модель, бюджет — оставьте заявку, и мы подберём варианты с ценами и сроками доставки.',
    sortOrder: 10,
  },
  {
    key: 'contacts',
    label: 'Контакты',
    eyebrow: null,
    title: 'Свяжитесь с нами',
    subtitle: null,
    sortOrder: 11,
  },
];

// ── Акции ────────────────────────────────────────────────────────────────

/**
 * DEMO. Реальных акций Sunservice у меня нет — это заглушки, чтобы блок было
 * видно и можно было оценить вёрстку. Заменить в админке до публикации:
 * формулировки, цены, сроки и ссылку на мессенджер.
 */
export const DEFAULT_PROMOTIONS = [
  {
    title: 'Подбор под ключ',
    subtitle: 'и диагностика перед покупкой в подарок',
    price: '0 руб.',
    oldPrice: '15 000 руб.',
    ctaLabel: 'написать в whatsapp',
    ctaHref: '#cta',
    validUntil: '1 декабря 2026 года',
    imageUrl: IMAGES.carBlue,
    imageAlt: 'Автомобиль, подобранный под ключ',
    sortOrder: 0,
    isDemo: true,
  },
  {
    title: 'Проверка перед покупкой',
    subtitle: 'для автомобилей из-за рубежа',
    price: '0 руб.',
    oldPrice: '8 000 руб.',
    ctaLabel: 'написать в whatsapp',
    ctaHref: '#cta',
    validUntil: '1 декабря 2026 года',
    imageUrl: IMAGES.carQ5,
    imageAlt: 'Автомобиль на проверке перед покупкой',
    sortOrder: 1,
    isDemo: true,
  },
];

// ── Hero ─────────────────────────────────────────────────────────────────

export const DEFAULT_HERO = {
  id: 'hero',
  eyebrow: null as string | null,
  titleLead: 'ТМ Авто',
  titleAccent: 'Авто под заказ из-за рубежа',
  titleTail: '',
  subtitle: '',
  trustLine: 'Работаем по всей России · таможня включена в стоимость',
  primaryLabel: 'Рассчитать стоимость',
  primaryHref: '#calculator',
  secondaryLabel: 'Подобрать авто',
  secondaryHref: '#modal',
  // Планы собраны из одного кадра скриптом scripts/build-hero-planes.mjs —
  // так же, как в reference разложена фотография горы.
  layerSkyUrl: '/hero/sky.webp',
  layerMidUrl: null as string | null,
  layerCarUrl: '/hero/audi.png',
  /** Плита уже с прозрачностью — маска не нужна. */
  layerCarIsCutout: true,
  layerForegroundUrl: null as string | null,
};

// ── Полоса доверия ───────────────────────────────────────────────────────

export const DEFAULT_TRUST_ITEMS = [
  {
    title: 'Инспекция на месте',
    text: 'Наш агент осматривает автомобиль на месте — кузов, агрегаты, документы. Вы видите реальный автомобиль.',
    sortOrder: 0,
  },
  {
    title: 'Таможня и СБКТС',
    text: 'Оформляем растаможку, получаем СБКТС и ПТС — полный пакет документов для постановки на учёт.',
    sortOrder: 1,
  },
  {
    title: 'Доставка по России',
    text: 'Транспортируем автомобиль от завода до вашего города. Страхование груза включено.',
    sortOrder: 2,
  },
  {
    title: 'Прозрачная стоимость',
    text: 'Цена фиксируется в договоре до оплаты — никаких доплат по дороге и сюрпризов на таможне.',
    sortOrder: 3,
  },
];

// ── Предотгрузочная инспекция ─────────────────────────────────────────────

export const DEFAULT_INSPECTION = [
  {
    code: 'body',
    title: 'Кузов и ЛКП',
    summary:
      'Наш агент осматривает кузов на месте: замеряет толщину покрытия, проверяет геометрию и наличие следов восстановления — до того, как вы переведёте деньги.',
    points: [
      'Замер толщины ЛКП по всем элементам',
      'Геометрия кузова и следы ударов',
      'Пороги, лонжероны, скрытые полости',
      'Зазоры дверей, капота, крышки багажника',
    ],
    imageUrl: IMAGES.bodyPaint,
    imageAlt: 'Осмотр кузова автомобиля перед отправкой',
    sortOrder: 0,
  },
  {
    code: 'engine',
    title: 'Двигатель и агрегаты',
    summary:
      'Проверяем работу двигателя на холодном и прогретом моторе, смотрим подтёки и состояние технических жидкостей — несоответствие хотя бы одному пункту останавливает отправку.',
    points: [
      'Запуск на холодном и горячем двигателе',
      'Технические жидкости и следы подтёков',
      'Воздушный фильтр, ремень привода',
      'Посторонние звуки при работе мотора',
    ],
    imageUrl: IMAGES.engineBelts,
    imageAlt: 'Осмотр двигателя автомобиля',
    sortOrder: 1,
  },
  {
    code: 'transmission',
    title: 'Трансмиссия',
    summary:
      'Тест-драйв перед отправкой — проверяем работу коробки передач в движении. Особое внимание уделяем DSG и вариаторам, которые часто скрывают проблемы.',
    points: [
      'Тест-драйв на разных режимах',
      'Переключения, рывки, задержки',
      'Подтёки масла из коробки',
      'Состояние сцепления и приводов',
    ],
    imageUrl: IMAGES.engineHands,
    imageAlt: 'Тест-драйв перед отправкой',
    sortOrder: 2,
  },
  {
    code: 'electric',
    title: 'Электрика и электроника',
    summary:
      'Современные автомобили насыщены электроникой — проверяем все системы: мультимедиа, адаптивный круиз, камеры, датчики и климат-контроль.',
    points: [
      'Мультимедийная система и дисплей',
      'Камеры и парктроники',
      'Климат-контроль и подогревы',
      'Диагностика по ошибкам блоков управления',
    ],
    imageUrl: IMAGES.cockpit,
    imageAlt: 'Проверка электроники автомобиля',
    sortOrder: 3,
  },
  {
    code: 'documents',
    title: 'Документы и соответствие',
    summary:
      'Сверяем VIN, номер кузова и двигателя с документами — это критично для таможни. Также проверяем соответствие комплектации заявленной в объявлении.',
    points: [
      'Сверка VIN и номера кузова',
      'Соответствие комплектации объявлению',
      'Пробег по диагностике vs по одометру',
      'Оригинальные документы на авто',
    ],
    imageUrl: IMAGES.highway,
    imageAlt: 'Проверка документов автомобиля',
    sortOrder: 4,
  },
];

// ── Услуги (тексты с действующего сайта Sunservice) ──────────────────────

export const DEFAULT_SERVICES = [
  {
    slug: 'lkp',
    title: 'Проверка лакокрасочного покрытия',
    excerpt:
      'Кузов является самым дорогим элементом транспортного средства, от которого зависит его общая функциональность. Если вы приобрели авто после аварии, есть риск, что придётся столкнуться с серьёзными сложностями и неоправданными финансовыми затратами. Для предотвращения подобных последствий специалисты проверяют толщину слоя краски при помощи специализированного оборудования.',
    outcomes: [
      'Карта замеров толщины ЛКП по кузову',
      'Следы окраски, шпатлёвки и восстановления',
      'Оценка геометрии кузова',
    ],
    imageUrl: IMAGES.bodyPaint,
    imageAlt: 'Проверка лакокрасочного покрытия кузова',
    ctaLabel: 'Заказать проверку',
    sortOrder: 0,
    featured: false,
  },
  {
    slug: 'diagnostics',
    title: 'Комплексная диагностика',
    excerpt:
      'Услуга, помогающая проверить сразу несколько элементов транспортного средства, включая генератор, аккумулятор, систему зажигания, технические жидкости, воздушный фильтр, ремень привода, подшипники и опоры. Также в ходе работ специалисты проверяют авто на наличие шумов и различных посторонних звуков.',
    outcomes: [
      'Компьютерная диагностика по блокам',
      'Осмотр ходовой части на подъёмнике',
      'Список неисправностей и предстоящих работ',
    ],
    imageUrl: IMAGES.serviceBay,
    imageAlt: 'Комплексная диагностика автомобиля в сервисе',
    ctaLabel: 'Записаться на диагностику',
    sortOrder: 1,
    featured: false,
  },
  {
    slug: 'expert-day',
    title: 'Эксперт по подбору на день',
    excerpt:
      'Услуга специалиста, предоставляемая на целый день. Эксперт проверит сразу несколько транспортных средств на наличие повреждений и юридических аспектов правомерности приобретения авто. В итоге вы избежите переплат за диагностику и увеличите свои шансы найти оптимальный вариант всего за день.',
    outcomes: [
      'Несколько автомобилей за один день',
      'Проверка повреждений и юридической чистоты',
      'Заключение по каждому осмотренному варианту',
    ],
    imageUrl: IMAGES.cockpit,
    imageAlt: 'Эксперт по подбору автомобиля за рулём',
    ctaLabel: 'Забронировать эксперта',
    sortOrder: 2,
    featured: false,
  },
  {
    slug: 'full',
    title: 'Комплексный автоподбор',
    excerpt:
      'Услуга, включающая в себя целый комплекс работ по подбору надёжного и качественного автомобиля. Специалисты определяют модель авто, просматривают объявления, выезжают на осмотр, производят компьютерную диагностику, выбирают оптимальный по соотношению цена/качество вариант и составляют приблизительную смету основных расходов на техобслуживание и ремонт.',
    outcomes: [
      'Подбор модели под задачу и бюджет',
      'Работа с объявлениями и выезды на осмотр',
      'Смета предстоящих расходов на обслуживание',
      'Сопровождение до передачи автомобиля',
    ],
    imageUrl: IMAGES.carQ5,
    imageAlt: 'Подобранный автомобиль передан клиенту',
    ctaLabel: 'Начать подбор',
    sortOrder: 3,
    featured: true,
  },
];

/** Дополнительные направления — списком с сайта Sunservice. */
export const DEFAULT_EXTRA_SERVICES = [
  'Базовые выездные проверки авто',
  'Комплексная проверка транспортного средства на СТО',
  'Подбор автомобиля по региону',
  'Подбор по территории всей страны с доставкой клиенту',
  'Предоставление эксперта на день',
  'Тщательная проверка автомобильного кузова',
];

// ── Как мы работаем ──────────────────────────────────────────────────────

export const DEFAULT_PROCESS = [
  {
    title: 'Получаем запрос',
    text: 'Вы оставляете заявку или звоните. Уточняем, какой автомобиль ищете и для каких задач.',
    detail: 'Консультация ничего не стоит и ни к чему не обязывает.',
    imageUrl: IMAGES.cockpit,
    sortOrder: 0,
  },
  {
    title: 'Фиксируем критерии и бюджет',
    text: 'Согласуем бюджет, марки и модели, год, пробег, географию поиска и формат работы.',
    detail: 'На этом же шаге отсекаем варианты, которые заведомо не подойдут.',
    imageUrl: IMAGES.workshop,
    sortOrder: 1,
  },
  {
    title: 'Ищем и проверяем варианты',
    text: 'Разбираем объявления, прозваниваем продавцов, отсеиваем перекупов и восстановленные после аварии автомобили.',
    detail: 'Выезжаем на первичный осмотр к подходящим вариантам.',
    imageUrl: IMAGES.highway,
    sortOrder: 2,
  },
  {
    title: 'Проводим диагностику и проверяем документы',
    text: 'Замеряем ЛКП, поднимаем на подъёмник, делаем компьютерную диагностику, проверяем угон, ограничения и залог.',
    detail: 'По результатам даём заключение: брать, торговаться или отказаться.',
    imageUrl: IMAGES.fluids,
    sortOrder: 3,
  },
  {
    title: 'Помогаем оформить покупку',
    text: 'Сопровождаем сделку: помогаем с торгом, оформлением документов и передачей автомобиля.',
    detail: 'Помогаем с доставкой автомобиля клиенту — в любую точку России.',
    imageUrl: IMAGES.carQ5,
    sortOrder: 4,
  },
];

// ── Почему нам можно доверить подбор ─────────────────────────────────────

export const DEFAULT_REASONS = [
  {
    title: 'Выгодные цены',
    text: 'Предлагаем конкурентные цены на автомобили из-за рубежа — вы платите ровно столько, сколько стоит авто, без скрытых наценок.',
    imageUrl: '/reasons-price.png',
    imageAlt: 'Выгодные цены',
    size: 'LARGE' as const,
    sortOrder: 0,
  },
  {
    title: 'Без посредников',
    text: 'Работаем напрямую с поставщиками и аукционами за рубежом — никаких лишних звеньев в цепочке и никаких дополнительных комиссий.',
    imageUrl: '/reasons-direct.png',
    imageAlt: 'Без посредников',
    size: 'MEDIUM' as const,
    sortOrder: 1,
  },
  {
    title: 'Большой выбор авто',
    text: 'Тысячи автомобилей разных марок, моделей и комплектаций — подберём именно то, что вам нужно.',
    imageUrl: null,
    imageAlt: null,
    size: 'SMALL' as const,
    sortOrder: 2,
  },
  {
    title: 'Прозрачность в покупке',
    text: 'Вы получаете полную информацию об истории автомобиля, его техническом состоянии и предыдущих владельцах — без утайки.',
    imageUrl: null,
    imageAlt: null,
    size: 'SMALL' as const,
    sortOrder: 3,
  },
  {
    title: 'Авто с аукционов',
    text: 'Прямой доступ к международным аукционам: широкий выбор брендов, актуальные лоты и честные стартовые цены.',
    imageUrl: '/reasons-auction.png',
    imageAlt: 'Авто с аукционов',
    size: 'MEDIUM' as const,
    sortOrder: 4,
  },
  {
    title: 'Быстрая доставка',
    text: 'Берём на себя всю логистику — от выкупа до передачи ключей — и доставляем автомобиль в максимально короткие сроки.',
    imageUrl: '/reasons-delivery.png',
    imageAlt: 'Доставка автомобиля',
    size: 'SMALL' as const,
    sortOrder: 5,
  },
  {
    title: 'Полное сопровождение',
    text: 'Наша команда ведёт вас от выбора автомобиля до его получения: отвечаем на вопросы, решаем вопросы, держим в курсе на каждом этапе.',
    imageUrl: null,
    imageAlt: null,
    size: 'SMALL' as const,
    sortOrder: 6,
  },
  {
    title: 'Гарантия качества',
    text: 'Каждый автомобиль проходит проверку перед отправкой — мы уверены в том, что передаём вам, и готовы это подтвердить.',
    imageUrl: '/reasons-quality.png',
    imageAlt: 'Гарантия качества',
    size: 'SMALL' as const,
    sortOrder: 7,
  },
];

// ── Разбор автомобиля · DEMO ─────────────────────────────────────────────

export const DEFAULT_CASE = {
  eyebrow: null as string | null,
  title: 'Почему мы отказались от этого автомобиля',
  listingTitle: 'DEMO · Кроссовер, 2019 год, 96 000 км',
  listingPrice: 'DEMO · 2 350 000 ₽',
  listingText:
    'DEMO. В объявлении: один владелец, обслуживание у дилера, «не бит, не крашен», пробег подтверждён сервисной книжкой. Фотографии сделаны вечером, кузов мокрый.',
  findings: [
    'DEMO · Толщина ЛКП на двух дверях и крыле выше заводской в несколько раз',
    'DEMO · Следы восстановления в районе передней стойки',
    'DEMO · Ошибки в блоке управления двигателем, стёртые незадолго до осмотра',
    'DEMO · Пробег в блоках не совпадает с сервисной книжкой',
  ],
  risks: [
    'DEMO · Скрытый ремонт после серьёзного удара',
    'DEMO · Непредсказуемые расходы на двигатель в ближайший год',
    'DEMO · Потеря части стоимости при последующей продаже',
  ],
  decisionTitle: 'Решение: отказались',
  decisionText:
    'DEMO. Мы не рекомендовали автомобиль к покупке и продолжили поиск. Через несколько дней клиент купил другой вариант — с прозрачной историей и без следов кузовного ремонта. Этот блок целиком заполняется в админке реальным кейсом.',
  images: [IMAGES.fluids, IMAGES.engineHands, IMAGES.engineBelts],
  imageAlt: 'Осмотр автомобиля перед покупкой',
  isDemo: true,
};

// ── Подобранные автомобили · DEMO ────────────────────────────────────────

export const DEFAULT_CARS = [
  {
    title: 'Volkswagen Golf',
    brand: 'Volkswagen',
    model: 'Golf',
    year: 2025,
    mileage: 0,
    engine: '1.5 TSI',
    transmission: 'Автомат',
    drive: 'Передний',
    trim: 'Style',
    location: null,
    searchDays: null,
    price: 2_850_000,
    savings: null,
    description: null,
    reviewAuthor: 'Алексей, Москва',
    reviewText: 'Golf 2025 под заказ — всё прошло быстро и чисто. Документы в порядке, машина без пробега, пригнали в срок. Очень доволен, рекомендую.',
    imageUrl: '/cars/golf.png',
    imageAlt: 'Volkswagen Golf 2025',
    sortOrder: 0,
    featured: true,
  },
  {
    title: 'Geely Coolray',
    brand: 'Geely',
    model: 'Coolray',
    year: 2024,
    mileage: 0,
    engine: '1.5T Бензин',
    transmission: 'Автомат',
    drive: 'Передний',
    trim: 'Premium',
    location: null,
    searchDays: null,
    price: 1_990_000,
    savings: null,
    description: null,
    reviewAuthor: 'Сергей, Дзержинск',
    reviewText: 'Coolray взял для жены — отличный выбор за свои деньги. Всё оформили под ключ, никаких лишних хлопот. Ездим уже полгода, никаких проблем.',
    imageUrl: '/cars/coolray.png',
    imageAlt: 'Geely Coolray 2024',
    sortOrder: 1,
    featured: false,
  },
  {
    title: 'Geely Monjaro',
    brand: 'Geely',
    model: 'Monjaro',
    year: 2025,
    mileage: 0,
    engine: '2.0T Бензин',
    transmission: 'Автомат',
    drive: 'Полный',
    trim: 'Top',
    location: null,
    searchDays: null,
    price: 3_150_000,
    savings: null,
    description: null,
    reviewAuthor: 'Дмитрий, Нижний Новгород',
    reviewText: 'Monjaro — это уровень. Полный привод, просторный салон, всё по цене ниже российских дилеров. Отчёт с фото прислали до оплаты, машина пришла в идеальном состоянии.',
    imageUrl: '/cars/monjaro.png',
    imageAlt: 'Geely Monjaro 2025',
    sortOrder: 2,
    featured: false,
  },
  {
    title: 'Audi Q3',
    brand: 'Audi',
    model: 'Q3',
    year: 2025,
    mileage: 0,
    engine: '1.5 TFSI',
    transmission: 'Автомат',
    drive: 'Передний',
    trim: 'S line',
    location: null,
    searchDays: null,
    price: 3_750_000,
    savings: null,
    description: null,
    reviewAuthor: 'Анна, Казань',
    reviewText: 'Q3 — мечта стала реальностью. Всё оформили за 6 недель, растаможка, СБКТС — взяли на себя. Машина пришла идеальная, ни царапины.',
    imageUrl: '/cars/q3.png',
    imageAlt: 'Audi Q3 2025',
    sortOrder: 3,
    featured: false,
  },
  {
    title: 'Volkswagen Tiguan',
    brand: 'Volkswagen',
    model: 'Tiguan',
    year: 2025,
    mileage: 0,
    engine: '2.0 TSI',
    transmission: 'Автомат',
    drive: 'Полный',
    trim: 'R-Line',
    location: null,
    searchDays: null,
    price: 3_490_000,
    savings: null,
    description: null,
    reviewAuthor: 'Роман, Санкт-Петербург',
    reviewText: 'Tiguan R-Line 2025 — брал новый под заказ. Сэкономил около 400 000 относительно официалов. Команда на связи 24/7, всё чётко и в срок.',
    imageUrl: '/cars/tiguan.png',
    imageAlt: 'Volkswagen Tiguan 2025',
    sortOrder: 4,
    featured: false,
  },
  {
    title: 'Toyota Corolla',
    brand: 'Toyota',
    model: 'Corolla',
    year: 2022,
    mileage: 28_000,
    engine: '1.8 Гибрид',
    transmission: 'Автомат',
    drive: 'Передний',
    trim: 'Comfort',
    location: null,
    searchDays: null,
    price: 2_250_000,
    savings: null,
    description: null,
    reviewAuthor: 'Елена, Самара',
    reviewText: 'Corolla с реальным пробегом и полной историей обслуживания. Проверили по всем базам, привезли быстро. Очень рада, что обратилась именно сюда.',
    imageUrl: '/cars/corolla.png',
    imageAlt: 'Toyota Corolla 2022',
    sortOrder: 5,
    featured: false,
  },
];

// ── Отзывы · DEMO ────────────────────────────────────────────────────────

export const DEFAULT_TESTIMONIALS = [
  {
    author: 'DEMO · Алексей',
    city: 'Дзержинск',
    carTitle: 'DEMO · кроссовер, 2019',
    text: 'DEMO-отзыв для наполнения макета. Замените реальными отзывами в админке или отключите секцию целиком.',
    rating: 5,
    sortOrder: 0,
  },
  {
    author: 'DEMO · Мария',
    city: 'Нижний Новгород',
    carTitle: 'DEMO · седан, 2020',
    text: 'DEMO-отзыв для наполнения макета. Замените реальными отзывами в админке или отключите секцию целиком.',
    rating: 5,
    sortOrder: 1,
  },
  {
    author: 'DEMO · Сергей',
    city: 'Дзержинск',
    carTitle: 'DEMO · универсал, 2018',
    text: 'DEMO-отзыв для наполнения макета. Замените реальными отзывами в админке или отключите секцию целиком.',
    rating: 4,
    sortOrder: 2,
  },
];

// ── FAQ ──────────────────────────────────────────────────────────────────

export const DEFAULT_FAQ = [
  {
    question: 'Из каких стран вы привозите автомобили?',
    answer:
      'Мы привозим автомобили из любой страны мира — Китай, Корея, Германия, США, ОАЭ и другие. Подберём нужный вариант под ваш бюджет и требования, организуем проверку, таможню и доставку до вашего города.',
    sortOrder: 0,
  },
  {
    question: 'Сколько стоит авто под заказ?',
    answer:
      'Итоговая стоимость складывается из цены авто на рынке, конвертации валюты, растаможки, утилизационного сбора, лабораторных испытаний (СБКТС), доставки и нашей комиссии. Например, Mazda CX-5 из Китая обходится около 3 000 000 ₽ под ключ. Рассчитываем точную стоимость по вашей модели бесплатно — до подписания договора.',
    sortOrder: 1,
  },
  {
    question: 'Что входит в услугу «под ключ»?',
    answer:
      'Подбор и проверка автомобиля на месте, выкуп, все таможенные процедуры, получение СБКТС и ЭПТС, доставка до вас. Вы получаете готовый к езде автомобиль с российскими документами — без лишних хлопот.',
    sortOrder: 2,
  },
  {
    question: 'Как вы проверяете автомобиль перед покупкой?',
    answer:
      'Наш специалист осматривает автомобиль на месте: кузов и ЛКП, двигатель, трансмиссию, электронику и документы. Вы получаете подробный отчёт с фото до того, как деньги уходят продавцу. Покупаем только после вашего одобрения.',
    sortOrder: 3,
  },
  {
    question: 'Сколько времени занимает доставка?',
    answer:
      'В среднем 3–8 недель с момента подбора автомобиля до получения в России. Сроки зависят от страны, маршрута доставки и скорости прохождения таможни. Точные сроки обсуждаем под конкретный автомобиль.',
    sortOrder: 4,
  },
  {
    question: 'Какие гарантии, что я не потеряю деньги?',
    answer:
      'Все условия фиксируются в договоре с указанием конкретного автомобиля и итоговой суммы. Деньги за авто переводятся только после вашего одобрения результатов осмотра. Мы работаем в автобизнесе с 2012 года и дорожим репутацией.',
    sortOrder: 5,
  },
  {
    question: 'Доставляете ли в другие города России?',
    answer:
      'Да, доставляем в любой город России. Стоимость и способ доставки (автовоз или своим ходом) обсуждаем индивидуально.',
    sortOrder: 6,
  },
];

// ── Калькулятор · ДЕМОНСТРАЦИОННАЯ КОНФИГУРАЦИЯ ──────────────────────────
//
//  ⚠️ Формула и коэффициенты НЕ согласованы с заказчиком.
//     Все значения редактируются в админке: Калькулятор → Шаги и Параметры.
//
//     Итог = clamp( round( (baseFee + Σ addend) × Π multiplier ) )

export const DEFAULT_CALCULATOR = {
  id: 'calculator',
  eyebrow: null as string | null,
  title: 'Рассчитайте стоимость подбора',
  subtitle:
    'Шесть коротких шагов. В конце — ориентир по стоимости услуги и по бюджету, в котором реально искать автомобиль.',
  baseFee: 12_000,
  minEstimate: 5_000,
  maxEstimate: 150_000,
  roundTo: 500,
  spread: 0.15,
  reserveShare: 0.05,
  resultTitle: 'Предварительный расчёт',
  resultNote:
    'Резерв на первичное обслуживание — это ориентир на замену расходников и устранение мелких замечаний сразу после покупки.',
  disclaimer:
    'Расчёт носит предварительный характер, не является офертой и уточняется после разговора со специалистом. Итоговая стоимость зависит от количества выездов, географии поиска и состояния конкретных автомобилей.',
  ctaLabel: 'Получить варианты автомобилей',
  successTitle: 'Заявка отправлена',
  successText: 'Перезвоним в течение часа и пришлём варианты с ценами и сроками доставки.',
};

export const DEFAULT_BUDGET_TIERS = [
  { upTo: 800_000, label: 'до 800 тыс.', multiplier: 1, addend: 0, sortOrder: 0 },
  { upTo: 1_500_000, label: '0,8–1,5 млн', multiplier: 1.1, addend: 0, sortOrder: 1 },
  { upTo: 3_000_000, label: '1,5–3 млн', multiplier: 1.25, addend: 3_000, sortOrder: 2 },
  { upTo: 5_000_000, label: '3–5 млн', multiplier: 1.4, addend: 6_000, sortOrder: 3 },
  { upTo: null, label: 'от 5 млн', multiplier: 1.6, addend: 10_000, sortOrder: 4 },
];

export const DEFAULT_CALCULATOR_STEPS = [
  // Шаг 1 — Бюджет
  {
    key: 'budget',
    kind: 'SINGLE' as const,
    title: 'Какой у Вас бюджет на авто?',
    hint: null,
    searchable: false,
    required: true,
    rangeConfig: null,
    sortOrder: 0,
    options: [
      { label: '1–2 млн ₽', value: '1-2', multiplier: 1, addend: 0, sortOrder: 0 },
      { label: '2–3 млн ₽', value: '2-3', multiplier: 1.25, addend: 3_000, sortOrder: 1 },
      { label: '3–4 млн ₽', value: '3-4', multiplier: 1.4, addend: 6_000, sortOrder: 2 },
      { label: 'Более 4 млн ₽', value: '4+', multiplier: 1.6, addend: 10_000, sortOrder: 3 },
    ],
  },

  // Шаг 2 — Марки
  {
    key: 'brand',
    kind: 'MULTI' as const,
    title: 'Какие марки авто вы рассматриваете?',
    hint: 'Можно выбрать несколько',
    searchable: false,
    required: false,
    rangeConfig: null,
    sortOrder: 1,
    options: [
      { label: 'KIA', value: 'kia', multiplier: 1, addend: 0, sortOrder: 0 },
      { label: 'Hyundai', value: 'hyundai', multiplier: 1, addend: 0, sortOrder: 1 },
      { label: 'Genesis', value: 'genesis', multiplier: 1.15, addend: 0, sortOrder: 2 },
      { label: 'Changan', value: 'changan', multiplier: 1, addend: 0, sortOrder: 3 },
      { label: 'BMW', value: 'bmw', multiplier: 1.15, addend: 0, sortOrder: 4 },
      { label: 'Audi', value: 'audi', multiplier: 1.15, addend: 0, sortOrder: 5 },
      { label: 'Mercedes', value: 'mercedes', multiplier: 1.15, addend: 0, sortOrder: 6 },
      { label: 'Geely', value: 'geely', multiplier: 1, addend: 0, sortOrder: 7 },
      { label: 'Другой', value: 'other', multiplier: 1.05, addend: 0, sortOrder: 8 },
    ],
  },

  // Шаг 3 — Возраст
  {
    key: 'age',
    kind: 'SINGLE' as const,
    title: 'Какой максимальный возраст автомобиля вас интересует?',
    hint: null,
    searchable: false,
    required: true,
    rangeConfig: null,
    sortOrder: 2,
    options: [
      { label: 'До 3 лет', value: 'lt3', multiplier: 1, addend: 0, sortOrder: 0 },
      { label: 'От 3 до 5 лет', value: '3-5', multiplier: 1.05, addend: 0, sortOrder: 1 },
      { label: 'От 5 до 7 лет', value: '5-7', multiplier: 1.15, addend: 1_500, sortOrder: 2 },
      { label: 'Старше 7 лет', value: 'gt7', multiplier: 1.25, addend: 3_000, sortOrder: 3 },
    ],
  },

  // Шаг 4 — Пробег
  {
    key: 'mileage',
    kind: 'SINGLE' as const,
    title: 'Какой должен быть пробег на автомобиле?',
    hint: null,
    searchable: false,
    required: true,
    rangeConfig: null,
    sortOrder: 3,
    options: [
      { label: 'До 50 тыс. км', value: 'lt50', multiplier: 1, addend: 0, sortOrder: 0 },
      { label: '50–100 тыс. км', value: '50-100', multiplier: 1.05, addend: 0, sortOrder: 1 },
      { label: '100–150 тыс. км', value: '100-150', multiplier: 1.15, addend: 1_500, sortOrder: 2 },
      { label: 'Более 150 тыс. км', value: 'gt150', multiplier: 1.25, addend: 3_000, sortOrder: 3 },
      { label: 'Любой', value: 'any', multiplier: 1.05, addend: 0, sortOrder: 4 },
    ],
  },
];

// ── SEO ──────────────────────────────────────────────────────────────────

export const DEFAULT_SEO = {
  id: 'seo',
  title: 'Авто под заказ из-за рубежа — ТМ Авто',
  description:
    'Подбор и доставка автомобилей из любой страны: предотгрузочная инспекция, таможня, СБКТС и доставка по России. Фиксированная цена в договоре.',
  h1: 'Автомобили под заказ из-за рубежа',
  keywords:
    'авто под заказ из-за рубежа, авто под заказ под ключ, растаможка авто, доставка авто из-за рубежа, авто на заказ из любой страны',
  ogTitle: 'Авто под заказ из-за рубежа — ТМ Авто',
  ogDescription:
    'Подбираем, проверяем на месте, растамаживаем и доставляем авто из любой страны. Таможня и СБКТС включены. Работаем по всей России.',
  // Собирается тем же скриптом, что и слои главного экрана.
  ogImageUrl: '/hero/og.jpg',
  canonicalUrl: null as string | null,
  robots: 'index,follow',
  headScripts: null as string | null,
};
