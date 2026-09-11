import { redirect } from 'next/navigation'
import { isAdminAuthed } from '../../lib/admin-auth'

export default function AdminIndexPage() {
  redirect(isAdminAuthed() ? '/admin/clubs' : '/admin/login')
}
