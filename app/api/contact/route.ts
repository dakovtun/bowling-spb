import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface ContactPayload {
  topic?: string
  email?: string
  message?: string
  website?: string // honeypot
}

export async function POST(request: Request) {
  let body: ContactPayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_request' }, { status: 400 })
  }

  // Honeypot: боты обычно заполняют все поля, включая скрытые. Людям это поле не видно.
  if (body.website) {
    return NextResponse.json({ ok: true })
  }

  const message = (body.message ?? '').trim()
  if (message.length < 3) {
    return NextResponse.json({ ok: false, error: 'empty_message' }, { status: 400 })
  }

  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!webhookUrl) {
    console.error('GOOGLE_SHEETS_WEBHOOK_URL не задан в переменных окружения')
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 500 })
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic: body.topic ?? '',
        email: (body.email ?? '').trim(),
        message
      })
    })
    if (!upstream.ok) throw new Error(`upstream responded ${upstream.status}`)
  } catch (err) {
    console.error('Не удалось переслать обращение в Google Таблицу:', err)
    return NextResponse.json({ ok: false, error: 'upstream_error' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
