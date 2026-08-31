import type { ReactNode } from 'react'
import Link from 'next/link'

// Декоративная заглушка карты (Яндекс.Карты ещё не подключены) — сетка + подпись,
// пины передаются через children абсолютным позиционированием (см. MapPin).
export function MapFrame({
  children,
  className = '',
  footnote
}: {
  children: ReactNode
  className?: string
  footnote?: string
}) {
  return (
    <div className={`map-grid-bg relative overflow-hidden border-2 border-ink ${className}`}>
      <div className="absolute inset-x-0 top-0 z-10 flex items-baseline justify-between gap-2.5 bg-ink px-3 py-2 text-paper">
        <span className="text-[11px] font-extrabold uppercase tracking-[0.1em]">Яндекс.Карты · заглушка</span>
        <span className="font-mono text-[11px] opacity-75">apikey=&lt;ВСТАВИТЬ_КЛЮЧ&gt;</span>
      </div>
      {footnote && (
        <div className="pointer-events-none absolute bottom-3 left-3 right-3 text-[11px] text-muted2">{footnote}</div>
      )}
      {children}
    </div>
  )
}

export function MapPin({
  x,
  y,
  label,
  active,
  href,
  onClick,
  className = ''
}: {
  x: number
  y: number
  label: string
  active?: boolean
  href?: string
  onClick?: () => void
  className?: string
}) {
  const cls = `absolute -translate-x-1/2 -translate-y-full whitespace-nowrap border-2 border-ink px-2 py-1 text-xs font-extrabold no-underline cursor-pointer ${
    active ? 'bg-accent text-paper' : 'bg-paper text-ink'
  } ${className}`
  const style = { left: `${x}%`, top: `${y}%` }

  if (href) {
    return (
      <Link href={href} title={label} style={style} className={cls}>
        {label}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} title={label} style={style} className={cls}>
      {label}
    </button>
  )
}
