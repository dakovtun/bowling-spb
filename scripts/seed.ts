// Одноразовый скрипт первичного наполнения Redis-хранилища данными каталога.
//
// Запуск (после того, как в .env.local прописаны переменные окружения от
// вашей интеграции Redis — см. .env.example):
//
//   npm run db:seed
//
// По умолчанию скрипт НЕ перезаписывает уже существующие данные, чтобы
// случайный повторный запуск не затёр правки, сделанные через админку.
// Передайте флаг --force, чтобы перезаписать принудительно:
//
//   npm run db:seed -- --force

import { Redis } from '@upstash/redis'
import { SEED_CLUBS } from '../lib/clubs'

const CLUBS_KEY = 'clubs:data'

function redisUrl(): string | undefined {
  return process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
}

function redisToken(): string | undefined {
  return process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
}

async function main() {
  const url = redisUrl()
  const token = redisToken()

  if (!url || !token) {
    console.error(
      '✗ Не заданы переменные окружения хранилища.\n' +
        '  Подключите Redis-интеграцию (Vercel Marketplace → Upstash Redis, или KV) к проекту,\n' +
        '  затем добавьте KV_REST_API_URL/KV_REST_API_TOKEN (или UPSTASH_REDIS_REST_URL/TOKEN) в .env.local\n' +
        '  (обычно это делается кнопкой "Copy Snippet" на странице базы данных в Vercel Dashboard).'
    )
    process.exit(1)
  }

  const redis = new Redis({ url, token })
  const force = process.argv.includes('--force')
  const existing = await redis.get(CLUBS_KEY)

  if (existing && Array.isArray(existing) && existing.length > 0 && !force) {
    console.log(
      `Хранилище уже содержит ${existing.length} клуб(ов). Ничего не делаю.\n` +
        'Если точно хотите перезаписать данными из lib/clubs.ts, запустите: npm run db:seed -- --force'
    )
    return
  }

  await redis.set(CLUBS_KEY, SEED_CLUBS)
  console.log(`✓ Записано ${SEED_CLUBS.length} клуб(ов) в хранилище под ключом "${CLUBS_KEY}".`)
}

main().catch((err) => {
  console.error('Ошибка при заполнении хранилища:', err)
  process.exit(1)
})
