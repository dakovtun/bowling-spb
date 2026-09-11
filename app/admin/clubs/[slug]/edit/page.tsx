import { notFound, redirect } from 'next/navigation'
import { isAdminAuthed } from '../../../../../lib/admin-auth'
import { fetchClub } from '../../../../../lib/db'
import { ClubForm } from '../../../../../components/admin/ClubForm'

export const dynamic = 'force-dynamic'

export default async function EditClubPage({ params }: { params: { slug: string } }) {
  if (!isAdminAuthed()) redirect('/admin/login')

  const club = await fetchClub(params.slug)
  if (!club) notFound()

  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Редактировать: {club.name}</h1>
      <ClubForm initialClub={club} />
    </div>
  )
}
