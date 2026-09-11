import Link from 'next/link'
import { redirect } from 'next/navigation'
import { isAdminAuthed } from '../../../lib/admin-auth'
import { fetchClubs } from '../../../lib/db'
import { AdminClubsTable } from '../../../components/admin/AdminClubsTable'

export const dynamic = 'force-dynamic'

export default async function AdminClubsPage() {
  if (!isAdminAuthed()) redirect('/admin/login')

  const clubs = await fetchClubs()

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold tracking-tight">Клубы ({clubs.length})</h1>
        <Link href="/admin/clubs/new" className="btn-accent">
          + Добавить клуб
        </Link>
      </div>
      <AdminClubsTable clubs={clubs} />
    </div>
  )
}
