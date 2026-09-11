import Link from 'next/link'
import { isAdminAuthed } from '../../lib/admin-auth'
import { LogoutButton } from '../../components/admin/LogoutButton'

export const metadata = { robots: { index: false, follow: false } }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = isAdminAuthed()

  return (
    <div className="min-h-screen bg-paper2">
      <header className="flex items-center justify-between border-b-2 border-ink/40 bg-paper px-6 py-3.5">
        <div className="flex items-center gap-5">
          <span className="text-sm font-extrabold uppercase tracking-[0.06em]">Админка «Боулинг СПб»</span>
          {authed && (
            <Link href="/admin/clubs" className="text-sm font-bold no-underline hover:underline">
              Клубы
            </Link>
          )}
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-muted2 no-underline hover:underline">
            ← На сайт
          </Link>
          {authed && <LogoutButton />}
        </div>
      </header>
      <main className="px-6 py-8">{children}</main>
    </div>
  )
}
