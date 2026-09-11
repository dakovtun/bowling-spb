// Слой доступа к данным о клубах. Реальные данные хранятся в Redis
// (через маркетплейс-интеграцию Vercel — Upstash Redis; исторически такие
// хранилища назывались "Vercel KV", но сам пакет @vercel/kv теперь
// deprecated, поэтому используется актуальный @upstash/redis напрямую).
// Каталог небольшой (десяток-другой клубов), поэтому нет смысла заводить
// полноценную реляционную схему: проще и надёжнее хранить и читать/писать
// весь массив целиком под одним ключом.
//
// Поддерживаются оба варианта названий переменных окружения, потому что
// разные интеграции подставляют их по-разному:
//   - KV_REST_API_URL / KV_REST_API_TOKEN (старое название от Vercel KV)
//   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (нативный Upstash)
//
// Если ни одна из пар не задана (например, локальная разработка без
// подключённого хранилища), функции ниже прозрачно откатываются на
// SEED_CLUBS, чтобы сайт и админка не падали.

import { Redis } from '@upstash/redis'
import { SEED_CLUBS, type Club } from './clubs'

const CLUBS_KEY = 'clubs:data'

function redisUrl(): string | undefined {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
}

function redisToken(): string | undefined {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
}

function kvConfigured(): boolean {
  return !!redisUrl() && !!redisToken()
}

let client: Redis | null = null
function getClient(): Redis {
  if (!client) {
    client = new Redis({ url: redisUrl()!, token: redisToken()! })
  }
  return client
}

/** Возвращает актуальный список клубов из Redis, либо SEED_CLUBS как запасной вариант. */
export async function fetchClubs(): Promise<Club[]> {
  if (!kvConfigured()) return SEED_CLUBS
  try {
    const data = await getClient().get<Club[]>(CLUBS_KEY)
    if (Array.isArray(data) && data.length > 0) return data
    return SEED_CLUBS
  } catch (err) {
    console.error('fetchClubs: хранилище недоступно, отдаю SEED_CLUBS', err)
    return SEED_CLUBS
  }
}

export async function fetchClub(slug: string): Promise<Club | undefined> {
  const clubs = await fetchClubs()
  return clubs.find((c) => c.slug === slug)
}

/** Полностью перезаписывает список клубов в хранилище. */
export async function saveClubs(clubs: Club[]): Promise<void> {
  if (!kvConfigured()) {
    throw new Error(
      'Хранилище не настроено: заданы ли KV_REST_API_URL/KV_REST_API_TOKEN (или UPSTASH_REDIS_REST_URL/TOKEN)?'
    )
  }
  await getClient().set(CLUBS_KEY, clubs)
}

/** Создаёт клуб или обновляет существующий (по slug). */
export async function upsertClub(club: Club, originalSlug?: string): Promise<void> {
  const clubs = await fetchClubs()
  const matchSlug = originalSlug ?? club.slug
  const idx = clubs.findIndex((c) => c.slug === matchSlug)
  if (idx >= 0) {
    clubs[idx] = club
  } else {
    clubs.push(club)
  }
  await saveClubs(clubs)
}

export async function deleteClubBySlug(slug: string): Promise<void> {
  const clubs = await fetchClubs()
  await saveClubs(clubs.filter((c) => c.slug !== slug))
}
