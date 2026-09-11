import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthed } from '../../../../../lib/admin-auth'
import { deleteClubBySlug, fetchClubs, upsertClub } from '../../../../../lib/db'
import type { Club } from '../../../../../lib/clubs'

function unauthorized() {
  return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
}

const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAdminAuthed()) return unauthorized()

  let club: Club
  try {
    club = await req.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный JSON' }, { status: 400 })
  }

  if (!club.slug || !SLUG_RE.test(club.slug)) {
    return NextResponse.json(
      { error: 'slug обязателен и должен состоять из латинских букв, цифр и дефисов' },
      { status: 400 }
    )
  }
  if (!club.name?.trim()) {
    return NextResponse.json({ error: 'Название клуба обязательно' }, { status: 400 })
  }

  const clubs = await fetchClubs()
  const original = clubs.find((c) => c.slug === params.slug)
  if (!original) {
    return NextResponse.json({ error: `Клуб "${params.slug}" не найден` }, { status: 404 })
  }
  // Если slug меняется, убедимся, что новый не занят другим клубом.
  if (club.slug !== params.slug && clubs.some((c) => c.slug === club.slug)) {
    return NextResponse.json({ error: `Клуб со slug "${club.slug}" уже существует` }, { status: 409 })
  }

  await upsertClub(club, params.slug)
  return NextResponse.json({ ok: true, club })
}

export async function DELETE(_req: NextRequest, { params }: { params: { slug: string } }) {
  if (!isAdminAuthed()) return unauthorized()
  const clubs = await fetchClubs()
  if (!clubs.some((c) => c.slug === params.slug)) {
    return NextResponse.json({ error: `Клуб "${params.slug}" не найден` }, { status: 404 })
  }
  await deleteClubBySlug(params.slug)
  return NextResponse.json({ ok: true })
}
