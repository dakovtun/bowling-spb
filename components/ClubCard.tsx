import type { ReactNode } from 'react'
import Link from 'next/link'
import type { Club } from '../lib/clubs'
import { isClubOpenNow, isPromo, priceLabel } from '../lib/clubs'
import { BowlingIcon } from './BowlingIcon'

function Badges({ club }: { club: Club }) {
  return (
    <div className="mt-0.5 flex flex-wrap gap-1.5">
      {isClubOpenNow(club) && <span className="badge-pill bg-accent-soft text-accent-dark">Открыто сейчас</span>}
      <span className="badge-pill border border-ink/40">{priceLabel(club)}</span>
    </div>
  )
}

function ClubPhoto({ club, height }: { club: Club; height: number }) {
  const img = club.images[0]
  return (
    <div className="relative overflow-hidden bg-mapbg" style={{ height }}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img.url} alt={img.alt} loading="lazy" className="grayscale-photo h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <BowlingIcon className="h-12 w-12 text-ink/25" />
        </div>
      )}
    </div>
  )
}

export function ClubCard({
  club,
  number,
  footer,
  hidePromo = false
}: {
  club: Club
  number?: string
  footer?: ReactNode
  /** Показывать карточку как обычную, даже если клуб рекламный (например, в топе рейтинга). */
  hidePromo?: boolean
}) {
  const promo = !hidePromo && isPromo(club)

  return (
    <div className={`flex flex-col ${promo ? 'bg-promo shadow-[inset_0_0_0_2px_#ec3013]' : 'bg-paper'}`}>
      {promo && (
        <div className="flex justify-between gap-2 bg-accent px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-paper">
          <span>Реклама · партнёр</span>
          <span>Единый билет</span>
        </div>
      )}
      <Link href={`/clubs/${club.slug}`} className="flex flex-1 flex-col text-ink no-underline hover:text-ink">
        <div className="relative">
          <ClubPhoto club={club} height={170} />
          {number && (
            <span className="absolute left-0 top-0 bg-ink px-2 py-1 text-xs font-extrabold text-paper">{number}</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 px-4 pb-3 pt-4">
          <div className="flex items-baseline justify-between gap-2.5">
            <span className="eyebrow">{club.district}</span>
            <span className="text-[17px] font-extrabold">{club.rating.toFixed(1)}</span>
          </div>
          <div className="text-xl font-extrabold leading-tight tracking-tight">{club.name}</div>
          <div className="text-[13px] text-muted2">
            {club.address}
            {club.metro && <> · м. {club.metro}</>}
          </div>
          <div className="text-[13px] text-muted2">{club.hours}</div>
          <Badges club={club} />
        </div>
      </Link>
      {footer}
    </div>
  )
}

/** Простая карточка без фото — для блока «Ещё клубы поблизости». */
export function ClubCardCompact({ club }: { club: Club }) {
  return (
    <Link
      href={`/clubs/${club.slug}`}
      className="flex flex-col gap-1.5 bg-paper p-[18px] text-ink no-underline hover:text-ink"
    >
      <span className="eyebrow">{club.district}</span>
      <span className="text-[19px] font-extrabold leading-tight tracking-tight">{club.name}</span>
      <span className="text-[13px] text-muted2">{club.address}</span>
      <span className="mt-1.5 text-[13px] font-extrabold uppercase tracking-[0.04em] text-accent">Подробнее →</span>
    </Link>
  )
}
