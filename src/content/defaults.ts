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
  brandName: 'Sunservice',
  brandNote: 'Автотехцентр',
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

/** Телефоны подразделений — с текущего сайта. */
export const DEFAULT_CONTACTS = [
  { label: 'Подбор автомобилей', phone: '+7 (953) 558-89-99', isPrimary: true, sortOrder: 0 },
  { label: 'Сервис и запчасти', phone: '+7 (910) 100-13-00', isPrimary: false, sortOrder: 1 },
  { label: 'Автомойка и шиномонтаж', phone: '+7 (910) 382-22-38', isPrimary: false, sortOrder: 2 },
  { label: 'Эвакуатор', phone: '+7 (920) 066-05-00', isPrimary: false, sortOrder: 3 },
];

// ── Навигация ────────────────────────────────────────────────────────────

export const DEFAULT_NAVIGATION = [
  { group: 'HEADER' as const, label: 'Как работаем', href: '#process', sortOrder: 0 },
  { group: 'HEADER' as const, label: 'Что проверяем', href: '#inspection', sortOrder: 1 },
  { group: 'HEADER' as const, label: 'Услуги', href: '#services', sortOrder: 2 },
  { group: 'HEADER' as const, label: 'Автомобили', href: '#cars', sortOrder: 3 },
  { group: 'HEADER' as const, label: 'Рассчитать стоимость', href: '#calculator', sortOrder: 4 },
  { group: 'HEADER' as const, label: 'Контакты', href: '#contacts', sortOrder: 5 },

  { group: 'FOOTER' as const, label: 'Услуги', href: '#services', sortOrder: 0 },
  { group: 'FOOTER' as const, label: 'Что проверяем', href: '#inspection', sortOrder: 1 },
  { group: 'FOOTER' as const, label: 'Автомобили', href: '#cars', sortOrder: 2 },
  { group: 'FOOTER' as const, label: 'Как работаем', href: '#process', sortOrder: 3 },
  { group: 'FOOTER' as const, label: 'Вопросы и ответы', href: '#faq', sortOrder: 4 },
  { group: 'FOOTER' as const, label: 'Контакты', href: '#contacts', sortOrder: 5 },
  {
    group: 'FOOTER' as const,
    label: 'Основной сайт Sunservice',
    href: 'https://sunservice-auto.ru',
    sortOrder: 6,
    external: true,
  },

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
    title: 'Актуальные акции на авто из Китая и Южной Кореи',
    subtitle: null,
    sortOrder: 0,
  },
  {
    key: 'services',
    label: 'Услуги',
    eyebrow: null,
    title: 'Подключаемся на любом этапе покупки',
    subtitle:
      'Можно заказать один выезд на осмотр, а можно передать нам весь подбор — от поиска объявлений до сделки.',
    sortOrder: 1,
  },
  {
    key: 'inspection',
    label: 'Что мы проверяем',
    eyebrow: null,
    title: 'Проверка почти по сотне характеристик',
    subtitle:
      'Осмотр ведут специалисты действующего автотехцентра — на своём оборудовании и на своём подъёмнике.',
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
    label: 'Подобранные автомобили',
    eyebrow: null,
    title: 'Автомобили, которые мы подобрали в прошлом месяце',
    subtitle: 'Листайте карточки — внутри параметры автомобиля и срок, за который его нашли.',
    sortOrder: 4,
  },
  {
    key: 'process',
    label: 'Как мы работаем',
    eyebrow: null,
    title: 'Пять шагов от запроса до сделки',
    subtitle: null,
    sortOrder: 5,
  },
  {
    key: 'reasons',
    label: 'Почему можно доверить подбор',
    eyebrow: null,
    title: 'Почему нам можно доверить подбор',
    subtitle: null,
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
    eyebrow: null,
    title: 'Что говорят клиенты',
    subtitle: null,
    sortOrder: 8,
  },
  {
    key: 'faq',
    label: 'Вопросы и ответы',
    eyebrow: null,
    title: 'Коротко о главном',
    subtitle: null,
    sortOrder: 9,
  },
  {
    key: 'cta',
    label: 'Финальная заявка',
    eyebrow: null,
    title: 'Расскажите, какой автомобиль ищете',
    subtitle:
      'Опишите задачу в двух предложениях — перезвоним, уточним детали и предложим формат работы.',
    sortOrder: 10,
  },
  {
    key: 'contacts',
    label: 'Контакты',
    eyebrow: null,
    title: 'Приезжайте или позвоните',
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
    subtitle: 'для автомобилей из Китая и Южной Кореи',
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
  // titleLead — крупная строка главного экрана, titleAccent — подпись под ней
  // помельче. Третья строка (titleTail) необязательна и по умолчанию пуста.
  titleLead: 'ТМ Авто',
  titleAccent: 'Ваш надёжный подбор авто',
  titleTail: '',
  subtitle:
    'Находим автомобиль под ваш бюджет и задачи, проверяем кузов, двигатель, коробку и электрику на оборудовании автотехцентра, отдельно смотрим юридическую историю — угон, ограничения, залог.',
  trustLine: 'Дзержинск · поиск по области и по России',
  primaryLabel: 'Рассчитать стоимость',
  primaryHref: '#calculator',
  secondaryLabel: 'Как проходит подбор',
  secondaryHref: '#process',
  // Планы собраны из одного кадра скриптом scripts/build-hero-planes.mjs —
  // так же, как в reference разложена фотография горы.
  layerSkyUrl: '/hero/sky.webp',
  layerMidUrl: null as string | null,
  layerCarUrl: '/hero/car.webp',
  /** Плита уже с прозрачностью — маска не нужна. */
  layerCarIsCutout: true,
  layerForegroundUrl: null as string | null,
};

// ── Полоса доверия ───────────────────────────────────────────────────────

export const DEFAULT_TRUST_ITEMS = [
  {
    title: 'Техническая диагностика',
    text: 'Двигатель, коробка, ходовая и электрика — на оборудовании автотехцентра, а не «на глаз» во дворе.',
    sortOrder: 0,
  },
  {
    title: 'Проверка истории',
    text: 'Смотрим автомобиль на угон, ограничения и залог, сверяем документы и сопроводительные бумаги.',
    sortOrder: 1,
  },
  {
    title: 'Поиск автомобиля',
    text: 'Разбираем объявления, отсеиваем перекупов и битые варианты, выезжаем на осмотр.',
    sortOrder: 2,
  },
  {
    title: 'Сопровождение сделки',
    text: 'Помогаем с торгом, оформлением и передачей автомобиля — до момента, когда ключи у вас.',
    sortOrder: 3,
  },
];

// ── Что мы проверяем ─────────────────────────────────────────────────────

export const DEFAULT_INSPECTION = [
  {
    code: 'body',
    title: 'Кузов и ЛКП',
    summary:
      'Кузов — самый дорогой элемент автомобиля. Толщину лакокрасочного покрытия специалисты замеряют специализированным оборудованием, чтобы вы не купили автомобиль после аварии.',
    points: [
      'Замер толщины ЛКП по всем элементам',
      'Геометрия кузова и следы восстановления',
      'Скрытые полости, пороги, лонжероны',
      'Зазоры, следы окраски и шпатлёвки',
    ],
    imageUrl: IMAGES.bodyPaint,
    imageAlt: 'Замер толщины лакокрасочного покрытия кузова',
    sortOrder: 0,
  },
  {
    code: 'engine',
    title: 'Двигатель',
    summary:
      'Проверяем состояние мотора и всё, что влияет на его ресурс: технические жидкости, воздушный фильтр, ремень привода, посторонние шумы и звуки.',
    points: [
      'Состояние двигателя и подкапотного пространства',
      'Технические жидкости и следы подтёков',
      'Ремень привода, воздушный фильтр',
      'Посторонние шумы и звуки на работающем моторе',
    ],
    imageUrl: IMAGES.engineBelts,
    imageAlt: 'Ремённый привод двигателя',
    sortOrder: 1,
  },
  {
    code: 'transmission',
    title: 'Коробка передач',
    summary:
      'Определяем состояние коробки передач: как включаются передачи, есть ли рывки и задержки, что показывает диагностика по ошибкам.',
    points: [
      'Работа коробки на ходу и на месте',
      'Рывки, пинки, задержки при переключении',
      'Ошибки блока управления трансмиссией',
      'Следы подтёков и состояние масла',
    ],
    imageUrl: IMAGES.engineHands,
    imageAlt: 'Диагностика агрегатов автомобиля',
    sortOrder: 2,
  },
  {
    code: 'electric',
    title: 'Электрика и электроника',
    summary:
      'Наши специалисты проверяют электронику и электрику автомобиля с пробегом: генератор, аккумулятор, систему зажигания и работу оборудования салона.',
    points: [
      'Генератор, аккумулятор, система зажигания',
      'Компьютерная диагностика по блокам',
      'Электрооборудование салона и кузова',
      'Ошибки и следы их «скручивания»',
    ],
    imageUrl: IMAGES.cockpit,
    imageAlt: 'Приборная панель и электроника автомобиля',
    sortOrder: 3,
  },
  {
    code: 'chassis',
    title: 'Подвеска и ходовая',
    summary:
      'Диагностика ходовой части на подъёмнике: подшипники, опоры, элементы подвески и рулевого управления.',
    points: [
      'Осмотр на подъёмнике автотехцентра',
      'Подшипники и опоры',
      'Элементы подвески и рулевого управления',
      'Тормозная система и состояние дисков',
    ],
    imageUrl: IMAGES.serviceBay,
    imageAlt: 'Автомобиль на диагностике в сервисной зоне',
    sortOrder: 4,
  },
  {
    code: 'legal',
    title: 'Юридическая история',
    summary:
      'Автомобиль проверяется не только на неисправности: смотрим угон, ограничения и залог, а также сопроводительную документацию.',
    points: [
      'Проверка на угон',
      'Ограничения на регистрационные действия',
      'Залог и обременения',
      'Сверка документов и сопроводительных бумаг',
    ],
    imageUrl: IMAGES.highway,
    imageAlt: 'Автомобиль на дороге',
    sortOrder: 5,
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
  'Базовые выездные проверки авто в Дзержинске',
  'Комплексная проверка транспортного средства на СТО',
  'Подбор автомобиля по региону',
  'Подбор по территории всей страны с доставкой в Дзержинск',
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
    detail: 'При подборе по России помогаем с доставкой автомобиля в Дзержинск.',
    imageUrl: IMAGES.carQ5,
    sortOrder: 4,
  },
];

// ── Почему нам можно доверить подбор ─────────────────────────────────────

export const DEFAULT_REASONS = [
  {
    title: 'Мы автосервис, а не только подборщики',
    text: 'Подбор ведут специалисты действующего автотехцентра Sunservice. Тот же персонал, который каждый день ремонтирует такие автомобили, смотрит их и перед покупкой.',
    imageUrl: IMAGES.workshop,
    imageAlt: 'Ремонтная зона автотехцентра',
    size: 'LARGE' as const,
    sortOrder: 0,
  },
  {
    title: 'Собственная техническая база',
    text: 'Подъёмник, оборудование для замера ЛКП и компьютерная диагностика — на месте, а не «у знакомых».',
    imageUrl: IMAGES.serviceBay,
    imageAlt: 'Автомобиль на подъёмнике',
    size: 'MEDIUM' as const,
    sortOrder: 1,
  },
  {
    title: 'Проверяем не только внешне',
    text: 'Проверка автомобиля идёт почти по сотне характеристик — от геометрии кузова до ошибок в блоках управления.',
    imageUrl: null,
    imageAlt: null,
    size: 'SMALL' as const,
    sortOrder: 2,
  },
  {
    title: 'Юридическая проверка',
    text: 'Автомобиль смотрим на угон, ограничения и залог до того, как вы внесёте задаток.',
    imageUrl: null,
    imageAlt: null,
    size: 'SMALL' as const,
    sortOrder: 3,
  },
  {
    title: 'Поиск по региону и по России',
    text: 'Если подходящего варианта нет в Дзержинске — ищем по области и по стране, с доставкой автомобиля клиенту.',
    imageUrl: IMAGES.highway,
    imageAlt: 'Автомобиль на трассе',
    size: 'MEDIUM' as const,
    sortOrder: 4,
  },
  {
    title: 'Работаем вместе с ExpertAuto52',
    text: 'Услуги по подбору оказываем совместно с компанией ExpertAuto52, которая занимается этим не первый год.',
    imageUrl: null,
    imageAlt: null,
    size: 'SMALL' as const,
    sortOrder: 5,
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
    title: 'Audi Q5 quattro',
    brand: 'Audi',
    model: 'Q5',
    year: 2021,
    mileage: 68_000,
    engine: '2.0 TFSI',
    transmission: 'Автомат',
    drive: 'quattro',
    trim: 'S line',
    location: 'Нижний Новгород',
    searchDays: 12,
    price: 4_150_000,
    savings: 180_000,
    description: 'DEMO-карточка. Заменяется в админке на реальный подобранный автомобиль.',
    imageUrl: IMAGES.carQ5,
    imageAlt: 'Audi Q5 на зимней дороге',
    sortOrder: 0,
    featured: true,
  },
  {
    title: 'BMW 430i xDrive',
    brand: 'BMW',
    model: '4 series',
    year: 2020,
    mileage: 74_000,
    engine: '2.0 Бензин',
    transmission: 'Автомат',
    drive: 'xDrive',
    trim: 'M Sport',
    location: 'Москва',
    searchDays: 18,
    price: 3_890_000,
    savings: 120_000,
    description: 'DEMO-карточка. Заменяется в админке на реальный подобранный автомобиль.',
    imageUrl: IMAGES.carBlue,
    imageAlt: 'BMW 4 серии, вид сбоку',
    sortOrder: 1,
    featured: false,
  },
  {
    title: 'Volkswagen Polo',
    brand: 'Volkswagen',
    model: 'Polo',
    year: 2019,
    mileage: 62_000,
    engine: '1.6 Бензин',
    transmission: 'Автомат',
    drive: 'Передний',
    trim: 'Comfortline',
    location: 'Дзержинск',
    searchDays: 6,
    price: 1_240_000,
    savings: 60_000,
    description: 'DEMO-карточка. Заменяется в админке на реальный подобранный автомобиль.',
    imageUrl: IMAGES.carPolo,
    imageAlt: 'Volkswagen Polo',
    sortOrder: 2,
    featured: false,
  },
  {
    title: 'Porsche Panamera',
    brand: 'Porsche',
    model: 'Panamera',
    year: 2018,
    mileage: 97_000,
    engine: '3.0 Бензин',
    transmission: 'Автомат',
    drive: 'Задний',
    trim: 'Base',
    location: 'Казань',
    searchDays: 24,
    price: 5_250_000,
    savings: 240_000,
    description: 'DEMO-карточка. Заменяется в админке на реальный подобранный автомобиль.',
    imageUrl: IMAGES.highway,
    imageAlt: 'Porsche Panamera на трассе',
    sortOrder: 3,
    featured: false,
  },
  {
    title: 'Ford Mustang GT',
    brand: 'Ford',
    model: 'Mustang',
    year: 2019,
    mileage: 43_000,
    engine: '5.0 Бензин',
    transmission: 'Автомат',
    drive: 'Задний',
    trim: 'GT Premium',
    location: 'Санкт-Петербург',
    searchDays: 21,
    price: 3_450_000,
    savings: 150_000,
    description: 'DEMO-карточка. Заменяется в админке на реальный подобранный автомобиль.',
    imageUrl: IMAGES.carMustang,
    imageAlt: 'Ford Mustang GT',
    sortOrder: 4,
    featured: false,
  },
  {
    title: 'BMW M4 Competition',
    brand: 'BMW',
    model: 'M4',
    year: 2021,
    mileage: 38_000,
    engine: '3.0 Бензин',
    transmission: 'Автомат',
    drive: 'Задний',
    trim: 'Competition',
    location: 'Нижегородская область',
    searchDays: 27,
    price: 7_900_000,
    savings: 310_000,
    description: 'DEMO-карточка. Заменяется в админке на реальный подобранный автомобиль.',
    imageUrl: IMAGES.heroCar,
    imageAlt: 'BMW M4 на закате',
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
    question: 'Сколько времени занимает подбор?',
    answer:
      'Срок зависит от того, насколько узкие критерии и как часто появляются подходящие объявления. Разовый выезд на осмотр организуем в ближайшие дни, комплексный подбор — это работа на несколько недель. Точный срок обсуждаем на первом созвоне.',
    sortOrder: 0,
  },
  {
    question: 'Можно ли искать автомобиль в другом городе?',
    answer:
      'Да. Мы делаем подбор по региону и по территории всей страны с доставкой выбранного автомобиля клиенту в Дзержинск.',
    sortOrder: 1,
  },
  {
    question: 'Что именно проверяется?',
    answer:
      'Кузов и толщина лакокрасочного покрытия, двигатель, коробка передач, ходовая часть, электрика и электроника, а также юридическая история — угон, ограничения, залог. Проверка идёт почти по сотне характеристик.',
    sortOrder: 2,
  },
  {
    question: 'Можно ли заказать только один осмотр?',
    answer:
      'Да. Можно заказать разовую проверку конкретного автомобиля — например, только замер ЛКП или комплексную диагностику на СТО, без полного подбора.',
    sortOrder: 3,
  },
  {
    question: 'Проверяете ли юридическую историю автомобиля?',
    answer:
      'Да. Перед покупкой автомобиль проверяется не только на наличие неисправностей, но и на угон, ограничения или залог, а также сверяется сопроводительная документация.',
    sortOrder: 4,
  },
  {
    question: 'Можно ли отказаться от найденного варианта?',
    answer:
      'Да. Наша задача — дать объективное заключение по автомобилю. Если результаты проверки вас не устраивают, мы продолжаем поиск. Условия по количеству вариантов фиксируем на старте работы.',
    sortOrder: 5,
  },
  {
    question: 'Где вы находитесь и когда можно приехать?',
    answer:
      'Автотехцентр Sunservice находится по адресу: Дзержинск, ул. Самохвалова, д. 6Б. Работаем с 8:00 до 20:00 без выходных. По вопросам подбора звоните на +7 (953) 558-89-99.',
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
  successText: 'Свяжемся с вами в рабочее время: 8:00–20:00, без выходных.',
};

export const DEFAULT_BUDGET_TIERS = [
  { upTo: 800_000, label: 'до 800 тыс.', multiplier: 1, addend: 0, sortOrder: 0 },
  { upTo: 1_500_000, label: '0,8–1,5 млн', multiplier: 1.1, addend: 0, sortOrder: 1 },
  { upTo: 3_000_000, label: '1,5–3 млн', multiplier: 1.25, addend: 3_000, sortOrder: 2 },
  { upTo: 5_000_000, label: '3–5 млн', multiplier: 1.4, addend: 6_000, sortOrder: 3 },
  { upTo: null, label: 'от 5 млн', multiplier: 1.6, addend: 10_000, sortOrder: 4 },
];

export const DEFAULT_CALCULATOR_STEPS = [
  {
    key: 'budget',
    kind: 'RANGE' as const,
    title: 'Какой бюджет на автомобиль?',
    hint: 'Укажите вилку, в которой готовы рассматривать варианты.',
    searchable: false,
    required: true,
    rangeConfig: {
      min: 300_000,
      max: 10_000_000,
      step: 50_000,
      defaultFrom: 1_200_000,
      defaultTo: 2_500_000,
      unit: '₽',
      quick: [
        { label: 'до 1 млн', from: 300_000, to: 1_000_000 },
        { label: '1–2 млн', from: 1_000_000, to: 2_000_000 },
        { label: '2–3,5 млн', from: 2_000_000, to: 3_500_000 },
        { label: '3,5–6 млн', from: 3_500_000, to: 6_000_000 },
        { label: 'от 6 млн', from: 6_000_000, to: 10_000_000 },
      ],
    },
    sortOrder: 0,
    options: [],
  },
  {
    key: 'brand',
    kind: 'MULTI' as const,
    title: 'Какие марки рассматриваете?',
    hint: 'Можно выбрать несколько или пропустить, если ещё не определились.',
    searchable: true,
    required: false,
    rangeConfig: null,
    sortOrder: 1,
    options: [
      { label: 'Не определился', value: 'any', multiplier: 1.05, addend: 0, sortOrder: 0 },
      { label: 'Toyota', value: 'toyota', multiplier: 1, addend: 0, sortOrder: 1 },
      { label: 'Kia', value: 'kia', multiplier: 1, addend: 0, sortOrder: 2 },
      { label: 'Hyundai', value: 'hyundai', multiplier: 1, addend: 0, sortOrder: 3 },
      { label: 'Volkswagen', value: 'volkswagen', multiplier: 1, addend: 0, sortOrder: 4 },
      { label: 'Skoda', value: 'skoda', multiplier: 1, addend: 0, sortOrder: 5 },
      { label: 'Mazda', value: 'mazda', multiplier: 1, addend: 0, sortOrder: 6 },
      { label: 'Nissan', value: 'nissan', multiplier: 1, addend: 0, sortOrder: 7 },
      { label: 'Renault', value: 'renault', multiplier: 1, addend: 0, sortOrder: 8 },
      { label: 'Lada', value: 'lada', multiplier: 0.95, addend: 0, sortOrder: 9 },
      { label: 'BMW', value: 'bmw', multiplier: 1.15, addend: 0, sortOrder: 10 },
      { label: 'Mercedes-Benz', value: 'mercedes', multiplier: 1.15, addend: 0, sortOrder: 11 },
      { label: 'Audi', value: 'audi', multiplier: 1.15, addend: 0, sortOrder: 12 },
      { label: 'Land Rover', value: 'land-rover', multiplier: 1.2, addend: 0, sortOrder: 13 },
      { label: 'Chery', value: 'chery', multiplier: 1, addend: 0, sortOrder: 14 },
      { label: 'Geely', value: 'geely', multiplier: 1, addend: 0, sortOrder: 15 },
      { label: 'Haval', value: 'haval', multiplier: 1, addend: 0, sortOrder: 16 },
      { label: 'Exeed', value: 'exeed', multiplier: 1, addend: 0, sortOrder: 17 },
    ],
  },
  {
    key: 'year',
    kind: 'SINGLE' as const,
    title: 'Какой год выпуска рассматриваете?',
    hint: null,
    searchable: false,
    required: true,
    rangeConfig: null,
    sortOrder: 2,
    options: [
      { label: 'Не старше 3 лет', value: 'lt3', multiplier: 1, addend: 0, sortOrder: 0 },
      { label: 'От 3 до 5 лет', value: '3-5', multiplier: 1.05, addend: 0, sortOrder: 1 },
      { label: 'От 5 до 8 лет', value: '5-8', multiplier: 1.15, addend: 1_500, sortOrder: 2 },
      { label: 'Старше 8 лет', value: 'gt8', multiplier: 1.25, addend: 3_000, sortOrder: 3 },
      { label: 'Не принципиально', value: 'any', multiplier: 1.05, addend: 0, sortOrder: 4 },
    ],
  },
  {
    key: 'mileage',
    kind: 'SINGLE' as const,
    title: 'Максимальный пробег?',
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
  {
    key: 'geography',
    kind: 'SINGLE' as const,
    title: 'Где искать автомобиль?',
    hint: 'От географии зависит количество выездов и срок подбора.',
    searchable: false,
    required: true,
    rangeConfig: null,
    sortOrder: 4,
    options: [
      { label: 'Дзержинск', value: 'dzerzhinsk', multiplier: 1, addend: 0, sortOrder: 0 },
      {
        label: 'Нижегородская область',
        value: 'region',
        multiplier: 1.15,
        addend: 2_000,
        sortOrder: 1,
      },
      {
        label: 'Другие регионы России',
        value: 'russia',
        multiplier: 1.35,
        addend: 8_000,
        hint: 'С доставкой автомобиля в Дзержинск',
        sortOrder: 2,
      },
    ],
  },
  {
    key: 'format',
    kind: 'SINGLE' as const,
    title: 'Какой формат услуги нужен?',
    hint: null,
    searchable: false,
    required: true,
    rangeConfig: null,
    sortOrder: 5,
    options: [
      {
        label: 'Разовый осмотр',
        value: 'single',
        hint: 'Проверка одного автомобиля, который вы уже нашли',
        multiplier: 0.5,
        addend: 0,
        sortOrder: 0,
      },
      {
        label: 'Эксперт на день',
        value: 'expert-day',
        hint: 'Специалист смотрит несколько автомобилей за день',
        multiplier: 0.9,
        addend: 4_000,
        sortOrder: 1,
      },
      {
        label: 'Комплексный подбор',
        value: 'full',
        hint: 'От поиска объявлений до сопровождения сделки',
        multiplier: 1.6,
        addend: 12_000,
        sortOrder: 2,
      },
      {
        label: 'Пока не знаю',
        value: 'unsure',
        hint: 'Подберём формат на консультации',
        multiplier: 1,
        addend: 0,
        sortOrder: 3,
      },
    ],
  },
];

// ── SEO ──────────────────────────────────────────────────────────────────

export const DEFAULT_SEO = {
  id: 'seo',
  title: 'Подбор авто в Дзержинске — Sunservice | Проверка автомобиля перед покупкой',
  description:
    'Профессиональный подбор автомобиля в Дзержинске. Проверка ЛКП и кузова, комплексная диагностика, эксперт на день, юридическая проверка на угон, ограничения и залог. Автотехцентр Sunservice, ул. Самохвалова, 6Б.',
  h1: 'Подбор автомобилей в Дзержинске',
  keywords:
    'подбор авто Дзержинск, подбор автомобиля Дзержинск, проверка авто перед покупкой, автоподбор Дзержинск, диагностика перед покупкой',
  ogTitle: 'Подбор авто в Дзержинске — Sunservice',
  ogDescription:
    'Найдём автомобиль под ваш бюджет и проверим его на оборудовании автотехцентра: кузов, двигатель, коробка, электрика и юридическая история.',
  // Собирается тем же скриптом, что и слои главного экрана.
  ogImageUrl: '/hero/og.jpg',
  canonicalUrl: null as string | null,
  robots: 'index,follow',
  headScripts: null as string | null,
};
