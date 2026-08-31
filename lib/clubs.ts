// Каталог боулинг-клубов Санкт-Петербурга.
// Данные проверены по официальным сайтам клубов и картам (Google/Yandex), актуализация — 2026.

export interface PriceRow {
  label: string
  price: string
}

export interface PriceTableData {
  title: string
  rows: PriceRow[]
}

export interface ClubImage {
  url: string
  alt: string
}

export type DaySchedule = [number, number] | null // [openHour, closeHour), closeHour может быть >24 для ночных клубов

export interface Club {
  slug: string
  name: string
  district: string
  metro?: string
  address: string
  phone?: string
  rating: number
  reviews: string
  website?: string
  hours: string
  priceFrom: number | null
  /** Пн..Вс */
  sched: DaySchedule[] | null
  lat: number
  lng: number
  tags: Array<'kids' | 'bar' | 'late' | '24'>
  amenities: string[]
  description: string
  longDescription: string
  priceNote: string
  priceTables: PriceTableData[]
  quote: string
  mapUrl: string
  images: ClubImage[]
}

export const CLUBS: Club[] = [
  {
    slug: 'almak',
    name: 'Альмак',
    district: 'Выборгский район',
    metro: 'Лесная',
    address: 'Новолитовская ул., 15а',
    phone: '+7 (812) 327-47-07',
    rating: 4.4,
    reviews: '1,1 тыс. отзывов',
    website: 'http://almakclub.ru/',
    hours: 'Круглосуточно',
    priceFrom: null,
    sched: [[0, 24], [0, 24], [0, 24], [0, 24], [0, 24], [0, 24], [0, 24]],
    lat: 59.984,
    lng: 30.348,
    tags: ['24', 'bar'],
    amenities: ['Боулинг', 'Бар и кухня', 'Круглосуточно', 'Несколько залов'],
    description: 'Один из старейших и самых крупных клубов города, работает круглосуточно.',
    longDescription:
      'Боулинг-центр «Альмак» на Новолитовской работает без выходных и перерывов — можно приехать сыграть даже глубокой ночью. В комплексе несколько игровых залов на разных этажах, кухня и бар с закусками и коктейлями. Часто выбирают для дней рождения и корпоративов благодаря гибкому графику.',
    priceNote: 'Стоимость дорожки зависит от дня недели и времени — актуальный прайс уточняйте по телефону клуба.',
    priceTables: [],
    quote: 'Мохито безалкогольный — вода, мята, лёд, лимон и капля спрайта.',
    mapUrl: 'https://www.google.com/maps/dir//Альмак,+Новолитовская+ул.,+15а,+Санкт-Петербург',
    images: [{ url: '/images/clubs/almak-1.webp', alt: 'Дорожки «Альмак»' }]
  },
  {
    slug: 'pitergame-sennaya',
    name: 'ПитерГейм на Сенной',
    district: 'Адмиралтейский район',
    metro: 'Сенная площадь',
    address: 'ул. Ефимова, 3 (ТК «Сенная»)',
    phone: '+7 812 380-30-90',
    rating: 3.8,
    reviews: '1,3 тыс. отзывов',
    website: 'https://pitergame.ru/',
    hours: 'Пн–Пт 11:00–23:00 · Сб–Вс 10:00–23:00',
    priceFrom: 900,
    sched: [[11, 23], [11, 23], [11, 23], [11, 23], [11, 23], [10, 23], [10, 23]],
    lat: 59.9243,
    lng: 30.3187,
    tags: ['bar'],
    amenities: ['Боулинг', 'Американский пул', 'Русский бильярд', 'Ресторан'],
    description: 'Сетевой клуб в самом центре, у Сенной площади.',
    longDescription:
      'Клуб сети PiterGame на Сенной — один из двух городских залов сети. Здесь дорожки для боулинга, столы для американского пула и русского бильярда, ресторан с меню и барной картой. Действуют акции: бесплатная игра при внесении депозита, скидка 50% в день рождения, третий час игры в подарок при оплате двух.',
    priceNote: '',
    priceTables: [
      {
        title: 'Боулинг, 1 дорожка / час',
        rows: [
          { label: 'Пн–Чт, до 16:00', price: '900 ₽' },
          { label: 'Пн–Чт, после 16:00', price: '1 500 ₽' },
          { label: 'Пт, до 16:00', price: '1 020 ₽' },
          { label: 'Пт, после 16:00', price: '1 800 ₽' },
          { label: 'Сб–Вс, до 16:00', price: '1 380 ₽' },
          { label: 'Сб–Вс, после 16:00', price: '1 800 ₽' }
        ]
      },
      {
        title: 'Бильярд и пул, час',
        rows: [
          { label: 'Пн–Чт', price: '780 ₽' },
          { label: 'Пт–Вс', price: '900 ₽' }
        ]
      }
    ],
    quote: '',
    mapUrl: 'https://www.google.com/maps/dir//Боулинг+на+Сенной,+ул.+Ефимова,+3,+Санкт-Петербург',
    images: [
      { url: '/images/clubs/pitergame-main.jpg', alt: 'Боулинг PiterGame' },
      { url: '/images/clubs/pitergame-event.jpg', alt: 'Мероприятия в PiterGame' }
    ]
  },
  {
    slug: 'pitergame-tipanova',
    name: 'ПитерГейм на Типанова',
    district: 'Московский район',
    metro: 'Московская',
    address: 'ул. Типанова, 21 (ТК «Питер»)',
    phone: '+7 812 335-68-35',
    rating: 3.7,
    reviews: '926 отзывов',
    website: 'https://pitergame.ru/price/piter',
    hours: 'Пн–Пт 11:00–23:00 · Сб–Вс 10:00–23:00',
    priceFrom: 900,
    sched: [[11, 23], [11, 23], [11, 23], [11, 23], [11, 23], [10, 23], [10, 23]],
    lat: 59.8515,
    lng: 30.348,
    tags: ['kids', 'bar'],
    amenities: ['Боулинг', 'VIP-дорожки', 'Детская горка', 'Пул и бильярд'],
    description: 'Второй зал сети — с VIP-дорожками и детской горкой.',
    longDescription:
      'Клуб на Типанова — второй адрес сети PiterGame, в ТК «Питер». Помимо стандартных дорожек здесь есть отдельные VIP-дорожки, а для детей — горка, чтобы запускать шар без сложных бросков. Также работают столы американского пула и русского бильярда, ресторан и бар.',
    priceNote: '',
    priceTables: [
      {
        title: 'Обычная дорожка, час',
        rows: [
          { label: 'Пн–Чт, до 16:00', price: '900 ₽' },
          { label: 'Пн–Чт, после 16:00', price: '1 500 ₽' },
          { label: 'Пт, после 16:00', price: '1 800 ₽' },
          { label: 'Сб–Вс, после 16:00', price: '1 800 ₽' }
        ]
      },
      {
        title: 'VIP-дорожка, час',
        rows: [
          { label: 'Пн–Чт, до 16:00', price: '1 200 ₽' },
          { label: 'Пн–Чт, после 16:00', price: '2 100 ₽' },
          { label: 'Пт–Вс, после 16:00', price: '2 100 ₽' }
        ]
      }
    ],
    quote: 'Есть специальная горка для маленьких детей, чтобы пускать шарики.',
    mapUrl: 'https://www.google.com/maps/dir//Боулинг+на+Типанова,+ул.+Типанова,+21,+Санкт-Петербург',
    images: [
      { url: '/images/clubs/pitergame-event.jpg', alt: 'Боулинг на Типанова' },
      { url: '/images/clubs/pitergame-main.jpg', alt: 'Зал PiterGame' }
    ]
  },
  {
    slug: 'golden-strike',
    name: 'Golden Strike',
    district: 'Приморский район',
    metro: 'Старая Деревня',
    address: 'Торфяная дор., 7, ТРК «Гулливер»',
    phone: '+7 (812) 441-24-24',
    rating: 4.0,
    reviews: '200 отзывов',
    website: '',
    hours: 'Ежедневно 11:00–23:00',
    priceFrom: null,
    sched: [[11, 23], [11, 23], [11, 23], [11, 23], [11, 23], [11, 23], [11, 23]],
    lat: 59.988,
    lng: 30.256,
    tags: [],
    amenities: ['Боулинг', 'Внутри ТРК «Гулливер»', 'Кинотеатр рядом', 'Парковка'],
    description: 'Боулинг внутри ТРК «Гулливер» — можно совместить с кино и шопингом.',
    longDescription:
      '«Golden Strike» занимает отдельную зону в ТРК «Гулливер» рядом со станцией «Старая Деревня». Работает как часть большого комплекса, где также есть гипермаркет, кинотеатр «Мираж Синема» и арена виртуальной реальности — можно совместить несколько активностей за один визит.',
    priceNote: 'Актуальные тарифы уточняйте на стойке клуба или по телефону — собственный сайт клуба сейчас недоступен.',
    priceTables: [],
    quote: 'Официанты и сотрудники боулинга все приветливые.',
    mapUrl: 'https://www.google.com/maps/dir//Голден+Страйк,+Торфяная+дор.,+7,+Санкт-Петербург',
    images: []
  },
  {
    slug: 'neptun',
    name: 'Боулинг «Нептун»',
    district: 'Московский район',
    metro: 'Балтийская',
    address: 'наб. Обводного канала, 93-а',
    phone: '+7 (812) 324-46-93',
    rating: 3.8,
    reviews: '24 отзыва',
    website: 'https://bowl.neptun.spb.ru/',
    hours: 'Пн, Вт — выходной · Ср–Пт 15:00–23:00 · Сб 12:00–23:00 · Вс 12:00–22:00',
    priceFrom: 2100,
    sched: [null, null, [15, 23], [15, 23], [15, 23], [12, 23], [12, 22]],
    lat: 59.913,
    lng: 30.301,
    tags: ['bar'],
    amenities: ['Боулинг', 'Бильярдная', 'Банкетные залы', 'Ресторан'],
    description: 'Боулинг в деловом центре «Нептун»: бильярд, банкеты, ресторан.',
    longDescription:
      'Боулинг «Нептун» — часть МДЦ «Нептун» на Обводном канале, куда также входят отель, спорткомплекс и конференц-залы. При клубе своя бильярдная (стол русского бильярда и два пула) до 15 гостей, несколько банкетных залов и полноценное меню. Именинникам — скидка 30% на игру за три дня до и после дня рождения.',
    priceNote: '',
    priceTables: [
      {
        title: 'Боулинг, 1 дорожка / час',
        rows: [
          { label: 'Ср–Пт 15:00–23:00', price: '2 100 ₽' },
          { label: 'Сб 12:00–23:00', price: '2 100 ₽' },
          { label: 'Вс 12:00–22:00', price: '2 100 ₽' }
        ]
      },
      {
        title: 'Бильярд, час',
        rows: [
          { label: 'Пул', price: '400 ₽' },
          { label: 'Пирамида', price: '600 ₽' }
        ]
      }
    ],
    quote: 'Нам понравилось, но хотели ещё и не можем дозвониться.',
    mapUrl: 'https://www.google.com/maps/dir//Боулинг+Нептун,+набережная+Обводного+канала,+93-а,+Санкт-Петербург',
    images: [
      { url: '/images/clubs/neptun-1.jpg', alt: 'Дорожки «Нептун»' },
      { url: '/images/clubs/neptun-2.jpg', alt: 'Зал «Нептун»' }
    ]
  },
  {
    slug: 'bowling-hall',
    name: 'Боулинг Холл',
    district: 'Красногвардейский район',
    metro: 'Ладожская',
    address: 'Индустриальный пр., 24 (ТК «Июнь»)',
    phone: '+7 (931) 581-67-47',
    rating: 3.7,
    reviews: '681 отзыв',
    website: '',
    hours: 'Уточняйте по телефону',
    priceFrom: null,
    sched: null,
    lat: 59.943,
    lng: 30.472,
    tags: ['kids'],
    amenities: ['Боулинг', 'Детская горка', 'Внутри ТК «Июнь»'],
    description: 'Семейный клуб в ТК «Июнь» с зоной для маленьких гостей.',
    longDescription:
      '«Боулинг Холл» расположен на территории ТК «Июнь» на Индустриальном проспекте. По отзывам гостей, здесь есть специальная горка для маленьких детей, чтобы запускать шар без сложного броска — удобно для семей. Актуальный прайс и расписание уточняйте по телефону.',
    priceNote: 'Сайт клуба не найден — цены и бронирование уточняйте по телефону.',
    priceTables: [],
    quote: 'Когда приходили маленькой компанией — было нормально.',
    mapUrl: 'https://www.google.com/maps/dir//Боулинг+Холл,+Индустриальный+пр.,+24,+Санкт-Петербург',
    images: []
  },
  {
    slug: 'mazapark-buharestskaya',
    name: 'MazaPark на Бухарестской',
    district: 'Фрунзенский район',
    metro: 'Бухарестская',
    address: 'Бухарестская ул., 30/32, ТРК «Континент»',
    phone: '8 (812) 643-33-33',
    rating: 4.3,
    reviews: '10 тыс. отзывов',
    website: 'https://mazapark.ru/spb-bukharestskaya/',
    hours: 'Пн–Пт 12:00–06:00 · Сб–Вс 10:00–06:00',
    priceFrom: null,
    sched: [[12, 30], [12, 30], [12, 30], [12, 30], [12, 30], [10, 30], [10, 30]],
    lat: 59.872,
    lng: 30.39,
    tags: ['kids', 'bar', 'late'],
    amenities: ['Боулинг', 'Единый билет', 'Роллердром', 'Лазертаг', 'Кафе и бары'],
    description: 'Парк развлечений: боулинг входит в единый билет вместе с 20 зонами.',
    longDescription:
      'MazaPark на Бухарестской — двухэтажный парк аттракционов, где боулинг лишь одна из более чем 20 зон: роллердром, лазертаг, автодром, VR, тир, игровые автоматы, кафе и бары. Единый входной билет даёт безлимитный доступ ко всем зонам.',
    priceNote: 'Игра в боулинг включена в единый входной билет парка — отдельная оплата за дорожку не требуется.',
    priceTables: [],
    quote: 'Посещали парк вчера с друзьями, вкусно поели, классно поиграли.',
    mapUrl: 'https://mazapark.ru/spb-bukharestskaya/',
    images: [
      { url: '/images/clubs/mazapark-1.jpg', alt: 'Зона боулинга в MazaPark' },
      { url: '/images/clubs/mazapark-2.jpg', alt: 'MazaPark' }
    ]
  },
  {
    slug: 'mazapark-baykonurskaya',
    name: 'MazaPark на Байконурской',
    district: 'Приморский район',
    metro: 'Комендантский пр.',
    address: 'Байконурская ул., 14, ТРК «Континент»',
    phone: '8 (812) 643-33-33',
    rating: 4.3,
    reviews: '6,1 тыс. отзывов',
    website: 'https://mazapark.ru/spb-baykonurskaya/',
    hours: 'Пн–Пт 12:00–06:00 · Сб–Вс 10:00–06:00',
    priceFrom: null,
    sched: [[12, 30], [12, 30], [12, 30], [12, 30], [12, 30], [10, 30], [10, 30]],
    lat: 60.009,
    lng: 30.256,
    tags: ['kids', 'bar', 'late'],
    amenities: ['Боулинг', 'Единый билет', 'Картинг', 'Верёвочный парк', 'Ресторан'],
    description: 'Северный парк сети: боулинг, картинг и верёвочный парк по единому билету.',
    longDescription:
      'Второй петербургский парк сети MazaPark — на Байконурской, в ТРК «Континент». Кроме боулинга здесь картинг, верёвочный парк, роллердром, лазертаг, VR-зона и ресторан «Орбитальный». Действует единый билет на все аттракционы парка.',
    priceNote: 'Игра в боулинг включена в единый входной билет парка — отдельная оплата за дорожку не требуется.',
    priceTables: [],
    quote: 'Цены адекватные, особенно приятно, что работают до 23:00.',
    mapUrl: 'https://mazapark.ru/spb-baykonurskaya/',
    images: [
      { url: '/images/clubs/mazapark-2.jpg', alt: 'MazaPark на Байконурской' },
      { url: '/images/clubs/mazapark-1.jpg', alt: 'Зона боулинга' }
    ]
  }
]

// ---------- Производные значения ----------

/** Границы карты СПб для перевода координат клубов в проценты x/y. */
const MAP_BOUNDS = { w: 30.1, e: 30.62, s: 59.83, n: 60.03 }

export function clubIndex(slug: string): number {
  return CLUBS.findIndex((c) => c.slug === slug)
}

export function clubNumber(slug: string): string {
  const i = clubIndex(slug)
  return String(i + 1).padStart(2, '0')
}

/** Текущее время в СПб (МСК) в виде {day: 0..6 (Пн..Вс), hour: 0..24 дробное}. */
export function getSpbNow(): { day: number; hour: number } {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Moscow',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }).formatToParts(now)
  const map: Record<string, string> = {}
  for (const p of parts) map[p.type] = p.value
  const weekdayIdx: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }
  const day = weekdayIdx[map.weekday] ?? 0
  const hour = (parseInt(map.hour || '0', 10) % 24) + parseInt(map.minute || '0', 10) / 60
  return { day, hour }
}

export function isClubOpenNow(club: Club, now = getSpbNow()): boolean {
  if (!club.sched) return false
  const t = club.sched[now.day]
  if (t && now.hour >= t[0] && now.hour < Math.min(t[1], 24)) return true
  const prev = club.sched[(now.day + 6) % 7]
  return !!(prev && prev[1] > 24 && now.hour < prev[1] - 24)
}

export function priceLabel(club: Club): string {
  if (club.priceFrom) return `от ${club.priceFrom.toLocaleString('ru-RU')} ₽/час`
  if (club.tags.includes('late')) return 'единый билет'
  return 'цена по звонку'
}

export function isPromo(club: Club): boolean {
  return club.slug.startsWith('mazapark')
}

/**
 * Цвет метки клуба на карте: партнёрские площадки (MazaPark) всегда красные,
 * все остальные клубы — всегда обычные зелёные метки.
 */
export function markerIsRed(club: Club): boolean {
  return isPromo(club)
}

export function clubMapPin(club: Club): { x: number; y: number } {
  const x = ((club.lng - MAP_BOUNDS.w) / (MAP_BOUNDS.e - MAP_BOUNDS.w)) * 100
  const y = ((MAP_BOUNDS.n - club.lat) / (MAP_BOUNDS.n - MAP_BOUNDS.s)) * 100
  return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) }
}

/** Позиция пина для декоративной обзорной карты на главной (с отступами от края). */
export function homeMapPin(club: Club): { x: number; y: number } {
  const raw = clubMapPin(club)
  return { x: 14 + (raw.x / 100) * 72, y: 26 + (raw.y / 100) * 60 }
}

function clubWord(n: number): string {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'клуб'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'клуба'
  return 'клубов'
}

export function pluralClubs(n: number): string {
  return `${n} ${clubWord(n)}`
}

export function getAllDistricts(): { name: string; count: number }[] {
  const map: Record<string, number> = {}
  CLUBS.forEach((c) => {
    map[c.district] = (map[c.district] || 0) + 1
  })
  return Object.keys(map)
    .sort((a, b) => a.localeCompare(b, 'ru'))
    .map((name) => ({ name, count: map[name] }))
}

// ---------- Страницы районов ----------

const DISTRICT_SLUGS: Record<string, string> = {
  'Адмиралтейский район': 'admiralteysky',
  'Выборгский район': 'vyborgsky',
  'Красногвардейский район': 'krasnogvardeysky',
  'Московский район': 'moskovsky',
  'Приморский район': 'primorsky',
  'Фрунзенский район': 'frunzensky'
}

export function districtSlug(name: string): string {
  return DISTRICT_SLUGS[name] ?? name.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, '-')
}

/**
 * "Выборгский район" -> "Выборгском районе" (предложный падеж).
 * Работает для всех районов СПб в текущей базе — они все оканчиваются на "-ский район".
 */
export function districtLocative(name: string): string {
  return name.replace(/ский район$/, 'ском районе')
}

export function getDistrictBySlug(slug: string): { name: string; count: number } | undefined {
  return getAllDistricts().find((d) => districtSlug(d.name) === slug)
}

// ---------- Подборки (сценарии) ----------

export type ScenarioFilter = 'now' | 'kids' | 'late' | 'cheap'

export interface ScenarioDef {
  slug: string
  filter: ScenarioFilter
  homeLabel: string
  h1: string
  title: string
  description: string
  intro: string
}

export const SCENARIO_DEFS: ScenarioDef[] = [
  {
    slug: 'otkryto-seychas',
    filter: 'now',
    homeLabel: 'Открыто прямо сейчас',
    h1: 'Боулинг в Петербурге, где открыто прямо сейчас',
    title: 'Боулинг в Петербурге, где открыто сейчас',
    description: 'Список открытых сейчас боулинг-клубов Петербурга — обновляется автоматически по расписанию каждого клуба.',
    intro: 'Список актуален на момент открытия страницы и учитывает расписание каждого клуба по петербургскому времени.'
  },
  {
    slug: 'dlya-detey',
    filter: 'kids',
    homeLabel: 'С детьми',
    h1: 'Боулинг для детей в Петербурге',
    title: 'Боулинг для детей в Петербурге',
    description: 'Боулинг-клубы Петербурга с горкой и условиями для маленьких игроков: адреса, цены, часы работы.',
    intro: 'Клубы, где есть горка для запуска шара без сложного броска и в целом спокойно относятся к детям на дорожках.'
  },
  {
    slug: 'posle-polunochi',
    filter: 'late',
    homeLabel: 'После полуночи',
    h1: 'Боулинг ночью и после полуночи в Петербурге',
    title: 'Боулинг ночью в Петербурге',
    description: 'Боулинг-клубы Петербурга, которые работают глубоко за полночь или круглосуточно.',
    intro: 'Если хочется поиграть после полуночи или ищете круглосуточный клуб — вот кто в Петербурге работает допоздна.'
  },
  {
    slug: 'nedorogo',
    filter: 'cheap',
    homeLabel: 'До 1500 ₽ за дорожку',
    h1: 'Недорогой боулинг в Петербурге до 1500 ₽/час',
    title: 'Недорогой боулинг в Петербурге',
    description: 'Боулинг-клубы Петербурга с ценой дорожки до 1500 ₽ в час — по будням и в дневное время.',
    intro: 'Цена дорожки в боулинге сильно зависит от дня недели и времени — здесь клубы, где даже пиковый тариф укладывается в 1500 ₽ за час.'
  }
]

export function clubsForScenario(filter: ScenarioFilter, now = getSpbNow()): Club[] {
  switch (filter) {
    case 'now':
      return CLUBS.filter((c) => isClubOpenNow(c, now))
    case 'kids':
      return CLUBS.filter((c) => c.tags.includes('kids'))
    case 'late':
      return CLUBS.filter((c) => c.tags.includes('late') || !!(c.sched && c.sched[0] && c.sched[0][1] >= 24))
    case 'cheap':
      return CLUBS.filter((c) => !!(c.priceFrom && c.priceFrom <= 1500))
  }
}

export function getClubBySlug(slug: string): Club | undefined {
  return CLUBS.find((c) => c.slug === slug)
}

export function getTopRatedClubs(limit = 3): Club[] {
  return [...CLUBS].sort((a, b) => b.rating - a.rating).slice(0, limit)
}

export interface Scenario {
  title: string
  count: string
  href: string
}

export function getScenarios(): Scenario[] {
  const now = getSpbNow()
  return SCENARIO_DEFS.map((s) => ({
    title: s.homeLabel,
    count: pluralClubs(clubsForScenario(s.filter, now).length),
    href: `/clubs/podborka/${s.slug}`
  }))
}
