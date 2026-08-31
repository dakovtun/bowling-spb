import type { Metadata } from 'next'
import Link from 'next/link'
import { CLUBS, getAllDistricts, getScenarios, getTopRatedClubs, homeMapPin, markerIsRed } from '../lib/clubs'
import { ClubCard } from '../components/ClubCard'
import { ClubsMapBlock } from '../components/ClubsMapBlock'

export const metadata: Metadata = { alternates: { canonical: '/' } }
  
export const revalidate = 300

export default function HomePage() {
  const districts = getAllDistricts()
  const topRated = getTopRatedClubs(3)
  const scenarios = getScenarios()
  const minPrice = Math.min(...CLUBS.map((c) => c.priceFrom ?? Infinity))

  return (
    <div>
      {/* Hero */}
      <section className="grid grid-cols-1 border-b-2 border-ink/40 [grid-template-columns:repeat(auto-fit,minmax(320px,1fr))]">
        <div className="border-r-0 border-ink/20 px-6 pb-10 pt-14 sm:border-r">
          <div className="eyebrow mb-5">Независимый гид</div>
          <h1 className="mb-5 text-[46px] font-extrabold leading-none tracking-tight">
            Восемь мест
            <br />в Петербурге,
            <br />где катают
            <br />
            <span className="text-accent">страйк</span>
          </h1>
          <p className="mb-6 max-w-[44ch] text-[17px] leading-relaxed">
            Адреса, часы, реальные цены за дорожку и то, что не пишут на сайтах клубов. Без рекламы и без бронирования
            через посредников.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/clubs" className="btn-accent">
              Открыть каталог →
            </Link>
            <Link href="/clubs?view=map" className="btn-outline">
              Показать на карте
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="grid grid-cols-3 gap-4 bg-accent px-6 py-7 text-paper">
            <div>
              <div className="text-[44px] font-extrabold leading-none">{CLUBS.length}</div>
              <div className="text-xs uppercase tracking-[0.06em] opacity-85">клубов</div>
            </div>
            <div>
              <div className="text-[44px] font-extrabold leading-none">{districts.length}</div>
              <div className="text-xs uppercase tracking-[0.06em] opacity-85">районов</div>
            </div>
            <div>
              <div className="text-[44px] font-extrabold leading-none">{minPrice}₽</div>
              <div className="text-xs uppercase tracking-[0.06em] opacity-85">от, за час</div>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-0.5 bg-paper2 p-6">
            <div className="eyebrow mb-2.5">Выбрать по ситуации</div>
            {scenarios.map((s) => (
              <Link
                key={s.title}
                href={s.href}
                className="flex w-full items-baseline justify-between gap-3 border-b border-ink/20 bg-paper px-3 py-3.5 text-ink no-underline hover:text-ink"
              >
                <span className="text-base font-extrabold">{s.title}</span>
                <span className="whitespace-nowrap text-xs text-muted">{s.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top rated */}
      <section className="border-b-2 border-ink/40 px-6 py-11">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[32px] font-extrabold tracking-tight">Клубы с лучшим рейтингом</h2>
          <Link href="/clubs" className="text-[13px] font-extrabold uppercase tracking-[0.04em] no-underline">
            Весь каталог →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-0.5 border-2 border-ink/40 bg-ink/40 sm:grid-cols-2 lg:grid-cols-3">
          {topRated.map((c) => (
            <ClubCard key={c.slug} club={c} hidePromo />
          ))}
        </div>
      </section>

      {/* Overview map */}
      <section className="border-b-2 border-ink/40 px-6 py-11">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="text-[32px] font-extrabold tracking-tight">Все клубы на карте</h2>
          <Link href="/clubs?view=map" className="text-[13px] font-extrabold uppercase tracking-[0.04em] no-underline">
            Открыть карту целиком →
          </Link>
        </div>
        <ClubsMapBlock
          className="aspect-square min-h-[280px] sm:aspect-[2.4]"
          markers={CLUBS.map((c) => ({ lat: c.lat, lng: c.lng, label: c.name, href: `/clubs/${c.slug}`, active: markerIsRed(c) }))}
          stubPins={CLUBS.map((c) => {
            const pin = homeMapPin(c)
            return { x: pin.x, y: pin.y, label: c.name, href: `/clubs/${c.slug}`, active: markerIsRed(c) }
          })}
        />
      </section>

      {/* Districts */}
      <section className="border-b-2 border-ink/40 px-6 py-11">
        <h2 className="mb-5 text-[32px] font-extrabold tracking-tight">По районам города</h2>
        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d) => (
            <Link
              key={d.name}
              href={`/clubs?district=${encodeURIComponent(d.name)}`}
              className="flex items-baseline justify-between gap-3 border-b border-ink/20 py-3.5 text-ink no-underline hover:text-ink"
            >
              <span className="text-base font-extrabold">{d.name}</span>
              <span className="text-[13px] text-muted">
                {d.count} {d.count === 1 ? 'клуб' : d.count >= 2 && d.count <= 4 ? 'клуба' : 'клубов'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* How to choose */}
      <section className="border-b-2 border-ink/40 px-6 py-11">
        <h2 className="mb-5 text-[32px] font-extrabold tracking-tight">Как выбрать клуб</h2>
        <div className="grid max-w-[1000px] grid-cols-1 gap-8 sm:grid-cols-2">
          <p className="text-base leading-relaxed">
            В Петербурге боулинг есть и в отдельных клубах, живущих только этой игрой, и внутри торгово-развлекательных
            комплексов и парков аттракционов вроде MazaPark. Первые удобнее, когда вы едете именно играть или
            заказывать банкет; вторые — если планируете провести в одном месте весь день с семьёй.
          </p>
          <p className="text-base leading-relaxed">
            Тарифы почти везде плавающие: до 16:00 по будням дорожка стоит в полтора-два раза дешевле, чем вечером в
            выходные. Мы указываем нижнюю границу прайса там, где клуб публикует его открыто, и честно пишем
            «уточняйте», где нет.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-wrap items-end justify-between gap-6 bg-accent px-6 py-[52px] text-paper">
        <div>
          <div className="mb-3 text-[11px] uppercase tracking-[0.1em] opacity-80">Владельцам клубов</div>
          <h2 className="max-w-[20ch] text-[40px] font-extrabold leading-none tracking-tight">
            Нашли неточность в прайсе или часах?
          </h2>
        </div>
        <Link href="/contact" className="bg-paper px-[22px] py-4 text-[15px] font-extrabold text-ink no-underline hover:bg-paper2">
          Написать нам →
        </Link>
      </section>
    </div>
  )
}
