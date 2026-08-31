'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SITE_NAME } from '../lib/constants'
import { LogoMark } from './LogoMark'

const NAV = [
  { href: '/', label: 'Главная' },
  { href: '/clubs', label: 'Клубы' },
  { href: '/about', label: 'О проекте' },
  { href: '/contact', label: 'Контакты' }
]

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(href + '/')
}

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="border-b-2 border-ink/40 bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3.5">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-2.5 text-ink no-underline hover:text-ink"
        >
          <LogoMark />
          <span className="text-[17px] font-extrabold tracking-tight">{SITE_NAME}</span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
          <nav className="mr-2 hidden flex-1 flex-wrap gap-1 sm:flex" aria-label="Основная навигация">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-[13px] font-extrabold uppercase tracking-[0.04em] no-underline ${
                  isActive(pathname, item.href) ? 'text-accent' : 'text-ink hover:text-accent'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/clubs"
            className="flex-shrink-0 whitespace-nowrap bg-accent px-4 py-2.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-paper no-underline hover:bg-accent-dark"
          >
            Найти клуб
          </Link>
          <button
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
            className={`flex h-[42px] w-[42px] flex-col items-center justify-center gap-1 border border-ink/40 sm:hidden ${
              open ? 'bg-ink' : 'bg-transparent'
            }`}
          >
            <span className={`block h-0.5 w-5 ${open ? 'bg-paper' : 'bg-ink'}`} />
            <span className={`block h-0.5 w-5 ${open ? 'bg-paper' : 'bg-ink'}`} />
            <span className={`block h-0.5 w-5 ${open ? 'bg-paper' : 'bg-ink'}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col border-t-2 border-ink/40 bg-paper2 px-6 pb-5 pt-2 sm:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`border-b border-ink/20 py-3 text-[28px] font-extrabold tracking-tight no-underline last:border-b-0 ${
                isActive(pathname, item.href) ? 'text-accent' : 'text-ink'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
