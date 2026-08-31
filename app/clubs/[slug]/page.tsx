import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CLUBS, clubMapPin, getClubBySlug, isClubOpenNow } from '../../../lib/clubs'
import { breadcrumbSchema, clubSchema } from '../../../lib/schema'
import { PriceTable } from '../../../components/PriceTable'
import { BowlingIcon } from '../../../components/BowlingIcon'
import { ClubCardCompact } from '../../../components/ClubCard'
import { ClubsMapBlock } from '../../../components/ClubsMapBlock'
import { JsonLd } from '../../../components/JsonLd'

export const revalidate = 300

export function generateStaticParams() {
  return CLUBS.map((club) => ({ slug: club.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const club = getClubBySlug(params.slug)
  if (!club) return {}
  return {
    title: club.name,
    description: club.description,
    alternates: { canonical: `/clubs/${club.slug}` }
  }
}

export default function ClubPage({ params }: { params: { slug: string } }) {
  const club = getClubBySlug(params.slug)
  if (!club) notFound()

  const openNow = isClubOpenNow(club)
  const pin = clubMapPin(club)
  const nearby = CLUBS.filter((c) => c.slug !== club.slug).slice(0, 3)
  const images = club.images.length ? club.images : [{ url: '', alt: 'Фото клуба' }]
  const telHref = club.phone ? `tel:${club.phone.replace(/[^+\d]/g, '')}` : undefined

  return (
    <>
      <JsonLd data={clubSchema(club)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Главная', path: '/' },
          { name: 'Клубы', path: '/clubs' },
          { name: club.name }
        ])}
      />
      <div>
      <div className="border-b border-ink/20 px-6 py-3.5">
        <Link href="/clubs" className="text-[13px] font-extrabold uppercase tracking-[0.04em] no-underline">
          ← Ко всем клубам
        </Link>
      </div>

      <section className="border-b-2 border-ink/40 px-6 pb-6 pt-8">
        <div className="eyebrow mb-3">
          {club.district}
          {club.metro && <> · м. {club.metro}</>}
        </div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-[40px] font-extrabold leading-[1.02] tracking-tight">{club.name}</h1>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[28px] font-extrabold leading-[1.02] tracking-tight text-accent">{club.rating.toFixed(1)}</span>
            <span className="text-[13px] text-muted">{club.reviews}</span>
          </div>
        </div>
        <div className="mt-4.5 mt-[18px] flex flex-wrap gap-1.5">
          {openNow && <span className="badge-pill bg-accent-soft text-accent-dark">Открыто сейчас</span>}
          {club.amenities.map((a) => (
            <span key={a} className="badge-pill border border-ink/40">
              {a}
            </span>
          ))}
        </div>
      </section>

      <section className={`grid grid-cols-1 gap-0.5 border-b-2 border-ink/40 bg-ink/40 ${images.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {images.slice(0, 2).map((im, i) => (
          <figure key={i} className="relative m-0 h-[300px] overflow-hidden bg-mapbg">
            {im.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={im.url} alt={im.alt} className="grayscale-photo h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <BowlingIcon className="h-16 w-16 text-ink/25" />
              </div>
            )}
          </figure>
        ))}
      </section>

      <section className="grid grid-cols-1 border-b-2 border-ink/40 sm:grid-cols-2">
        <div className="border-r-0 border-ink/20 px-6 py-8 sm:border-r">
          <p className="mb-6 text-[17px] leading-relaxed">{club.longDescription}</p>

          {club.priceTables.length > 0 && (
            <>
              <h2 className="mb-3 text-2xl font-extrabold tracking-tight">Цены</h2>
              {club.priceTables.map((t) => (
                <PriceTable key={t.title} title={t.title} rows={t.rows} />
              ))}
            </>
          )}

          {club.priceNote && <p className="mb-6 border-l-2 border-accent pl-3 text-sm text-muted2">{club.priceNote}</p>}

          {club.quote && (
            <blockquote className="mt-5 border-t-2 border-ink/40 pt-5">
              <p className="mb-2 text-[22px] font-extrabold leading-snug tracking-tight">«{club.quote}»</p>
              <footer className="text-xs text-muted">Из отзыва на Google Картах</footer>
            </blockquote>
          )}
        </div>

        <div className="bg-paper2 px-6 py-8">
          <ClubsMapBlock
            className="mb-5 h-[220px]"
            markers={[{ lat: club.lat, lng: club.lng, label: club.name, href: `/clubs/${club.slug}`, active: true }]}
            stubPins={[{ x: pin.x, y: pin.y, label: club.name, href: `/clubs/${club.slug}`, active: true }]}
            footnote={`${club.metro ? `м. ${club.metro} · ` : ''}${club.address}`}
          />

          <div className="border-2 border-ink bg-paper p-5">
            <div className="eyebrow mb-3.5">Как добраться и записаться</div>
            <div className="flex flex-col gap-3 text-[15px]">
              <div>
                <div className="text-[11px] uppercase tracking-[0.08em] text-muted">Адрес</div>
                <div className="font-extrabold">{club.address}</div>
              </div>
              {club.metro && (
                <div>
                  <div className="text-[11px] uppercase tracking-[0.08em] text-muted">Метро</div>
                  <div className="font-extrabold">{club.metro}</div>
                </div>
              )}
              <div>
                <div className="text-[11px] uppercase tracking-[0.08em] text-muted">Часы</div>
                <div className="font-extrabold">{club.hours}</div>
              </div>
              {club.phone && (
                <div>
                  <div className="text-[11px] uppercase tracking-[0.08em] text-muted">Телефон</div>
                  <a href={telHref} className="font-extrabold no-underline">
                    {club.phone}
                  </a>
                </div>
              )}
            </div>
            <a
              href={club.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4.5 mt-[18px] block bg-accent px-4 py-3.5 text-center text-sm font-extrabold text-paper no-underline hover:bg-accent-dark"
            >
              Построить маршрут →
            </a>
            {club.website && (
              <a
                href={club.website}
                target="_blank"
                rel="noreferrer"
                className="mt-0.5 block border border-ink/40 px-4 py-3.5 text-center text-sm font-extrabold text-ink no-underline"
              >
                Официальный сайт клуба
              </a>
            )}
            <p className="mt-3.5 text-xs text-muted">Бронирование — напрямую в клубе. Мы не берём комиссию и не продаём места.</p>
          </div>
        </div>
      </section>

      <section className="px-6 py-9">
        <h2 className="mb-4.5 mb-[18px] text-2xl font-extrabold tracking-tight">Ещё клубы поблизости</h2>
        <div className="grid grid-cols-1 gap-0.5 border-2 border-ink/40 bg-ink/40 sm:grid-cols-2 lg:grid-cols-3">
          {nearby.map((c) => (
            <ClubCardCompact key={c.slug} club={c} />
          ))}
        </div>
      </section>
      </div>
    </>
  )
}
