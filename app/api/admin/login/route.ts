import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE_NAME, checkPassword, createSessionToken } from '../../../../lib/admin-auth'

export async function POST(req: NextRequest) {
  let password = ''
  try {
    const body = await req.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: 'Админка не настроена: заданы ли ADMIN_PASSWORD и ADMIN_SESSION_SECRET на сервере?' },
      { status: 500 }
    )
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Неверный пароль' }, { status: 401 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12
  })
  return res
}
