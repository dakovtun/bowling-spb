'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Club } from '../../lib/clubs'

export function AdminClubsTable({ clubs }: { clubs: Club[] }) {
  const router = useRouter()
  const [pendingSlug, setPendingSlug] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function handleDelete(slug: string, name: string) {
    if (!confirm(`Удалить клуб «${name}»? Это необратимо.`)) return
    setPendingSlug(slug)
    setError('')
    try {
      const res = await fetch(`/api/admin/clubs/${slug}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Не удалось удалить клуб')
        return
      }
      router.refresh()
    } catch {
      setError('Ошибка сети')
    } finally {
      setPendingSlug(null)
    }
  }

  if (clubs.length === 0) {
    return <p className="text-muted2">Клубов пока нет — добавьте первый.</p>
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b-2 border-ink/40">
            <th className="py-2 pr-4 font-extrabold">Клуб</th>
            <th className="py-2 pr-4 font-extrabold">Район</th>
            <th className="py-2 pr-4 font-extrabold">Адрес</th>
            <th className="py-2 pr-4 font-extrabold">Рейтинг</th>
            <th className="py-2 pr-4 font-extrabold"></th>
          </tr>
        </thead>
        <tbody>
          {clubs.map((c) => (
            <tr key={c.slug} className="border-b border-ink/20">
              <td className="py-2.5 pr-4 font-bold">{c.name}</td>
              <td className="py-2.5 pr-4 text-muted2">{c.district}</td>
              <td className="py-2.5 pr-4 text-muted2">{c.address}</td>
              <td className="py-2.5 pr-4">{c.rating.toFixed(1)}</td>
              <td className="py-2.5 pr-4 whitespace-nowrap">
                <Link href={`/admin/clubs/${c.slug}/edit`} className="mr-4 font-bold text-accent hover:underline">
                  Редактировать
                </Link>
                <button
                  onClick={() => handleDelete(c.slug, c.name)}
                  disabled={pendingSlug === c.slug}
                  className="font-bold text-red-600 hover:underline disabled:opacity-50"
                >
                  {pendingSlug === c.slug ? 'Удаляю…' : 'Удалить'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
