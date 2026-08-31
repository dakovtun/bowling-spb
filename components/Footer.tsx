import Link from 'next/link'

export function Footer() {
  return (
    <footer className="flex flex-wrap items-start justify-between gap-5 border-t-2 border-ink/40 bg-paper2 px-6 py-7">
      <div className="max-w-[52ch] text-[13px] text-muted2">
        © {new Date().getFullYear()} Боулинг СПб. Независимый гид. Цены, часы работы и контакты уточняйте на сайтах
        клубов — информация могла измениться.
      </div>
      <nav className="flex flex-wrap gap-4">
        <Link href="/clubs" className="text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline hover:text-accent">
          Клубы
        </Link>
        <Link href="/about" className="text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline hover:text-accent">
          О проекте
        </Link>
        <Link href="/contact" className="text-[13px] font-extrabold uppercase tracking-[0.04em] text-ink no-underline hover:text-accent">
          Контакты
        </Link>
      </nav>
    </footer>
  )
}
