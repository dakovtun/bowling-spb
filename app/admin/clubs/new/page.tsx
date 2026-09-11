import { redirect } from 'next/navigation'
import { isAdminAuthed } from '../../../../lib/admin-auth'
import { ClubForm } from '../../../../components/admin/ClubForm'

export default function NewClubPage() {
  if (!isAdminAuthed()) redirect('/admin/login')

  return (
    <div>
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight">Новый клуб</h1>
      <ClubForm />
    </div>
  )
}
