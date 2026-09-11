import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthed } from '../../../../lib/admin-auth'
import { fetchClubs, upsertClub } from '../../../../lib/db'
import type { Club } from '../../../../lib/clubs'

function unauthorized() {
  return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
}

export async function GET() {
  if (!isAdminAuthed()) return unauthorized()
  const clubs = await fetchClubs()
  return NextResponse.json({ clubs })
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) return unauthorized()

  let club: Club
  try {
    club = await req.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
  }

  if (!club.slug || !SLUG_RE.test(club.slug)) {
    return NextResponse.json(
      { error: 'slug обязателен и должен состоять из латинских букв, цифр и дефисов (например: my-club)' },
      { status: 400 }
    )
  }
  if (!club.name?.trim()) {
    return NextResponse.json({ error: 'Название клуба обязательно' }, { status: 400 })
  }

  const existing = await fetchClubs()
  if (existing.some((c) => c.slug === club.slug)) {
    return NextResponse.json({ error: `Клуб со slug "${club.slug}" уже существует` }, { status: 409 })
  }

  await upsertClub(club)
  return NextResponse.json({ ok: true, club }, { status: 201 })
}
