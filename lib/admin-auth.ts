// Простая защита админки одним паролем (без пользователей/ролей — так и
// просили: "один аккаунт админа"). Сессия — подписанная HMAC-кука со сроком
// действия, без сервера сессий и без базы: секрет живёт в переменной
// окружения ADMIN_SESSION_SECRET, пароль — в ADMIN_PASSWORD.
//
// Всё это работает только в Node.js-рантайме (Server Components и Route
// Handlers по умолчанию именно в нём и выполняются), поэтому здесь можно
// спокойно использовать встроенный модуль node:crypto — не нужно возиться
// с Web Crypto ради совместимости с Edge-рантаймом Middleware.

import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE_NAME = 'admin_session'
const SESSION_TTL_MS = 1000 * 60 * 60 * 12 // 12 часов

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET не задан в переменных окружения')
  }
  return secret
}

function sign(value: string): string {
  return createHmac('sha256', getSecret()).update(value).digest('hex')
}

/** Проверяет пароль, введённый в форме логина, против ADMIN_PASSWORD. */
export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  // Сравнение постоянного времени, чтобы не утекала длина/содержимое через тайминг.
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/** Формирует значение куки сессии: "срокДействия.подпись". */
export function createSessionToken(): string {
  const expiresAt = Date.now() + SESSION_TTL_MS
  const payload = String(expiresAt)
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  const [payload, sig] = token.split('.')
  if (!payload || !sig) return false
  if (Number(payload) < Date.now()) return false
  const expectedSig = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expectedSig)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

/** Для использования в Server Components/страницах админки. */
export function isAdminAuthed(): boolean {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value
  return verifySessionToken(token)
}
