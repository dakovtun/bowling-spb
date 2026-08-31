// Хелперы для генерации Schema.org / JSON-LD разметки.
import { SITE_NAME, SITE_URL } from './constants'
import type { Club } from './clubs'

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

function fmtHour(h: number): string {
  const hh = Math.floor(h) % 24
  const mm = Math.round((h % 1) * 60)
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}

function openingHoursSpecification(sched: Club['sched']) {
  if (!sched) return undefined
  const rows = sched
    .map((slot, i) => {
      if (!slot) return null
      const [start, end] = slot
      const opens = fmtHour(start)
      const closes = start === 0 && end === 24 ? '23:59' : fmtHour(end)
      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${DAY_NAMES[i]}`,
        opens,
        closes
      }
    })
    .filter((row): row is NonNullable<typeof row> => row !== null)
  return rows.length ? rows : undefined
}

function parseReviewCount(reviews: string): number | undefined {
  const m = reviews.match(/([\d]+(?:[.,]\d+)?)\s*(тыс\.?)?/i)
  if (!m) return undefined
  let n = parseFloat(m[1].replace(',', '.'))
  if (m[2]) n *= 1000
  return Math.round(n)
}

/** BowlingAlley-разметка карточки клуба. */
export function clubSchema(club: Club) {
  const url = `${SITE_URL}/clubs/${club.slug}`
  const reviewCount = parseReviewCount(club.reviews)
  const hours = openingHoursSpecification(club.sched)

  return {
    '@context': 'https://schema.org',
    '@type': 'BowlingAlley',
    name: club.name,
    url,
    ...(club.phone ? { telephone: club.phone } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: club.address,
      addressLocality: 'Санкт-Петербург',
      addressCountry: 'RU'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: club.lat,
      longitude: club.lng
    },
    ...(club.images[0] ? { image: club.images[0].url } : {}),
    ...(club.website ? { sameAs: [club.website] } : {}),
    ...(reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: club.rating,
            reviewCount,
            bestRating: 5,
            worstRating: 1
          }
        }
      : {}),
    ...(hours ? { openingHoursSpecification: hours } : {})
  }
}

/** ItemList для каталога клубов. */
export function clubsListSchema(clubs: Club[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: clubs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE_URL}/clubs/${c.slug}`,
      name: c.name
    }))
  }
}

/** Хлебные крошки. Последний пункт — без url (текущая страница). */
export function breadcrumbSchema(items: { name: string; path?: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {})
    }))
  }
}

/** Разметка сайта в целом — на главной. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL
  }
}
