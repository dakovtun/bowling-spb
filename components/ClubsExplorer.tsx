'use client'

import { useMemo, useState } from 'react'
import type { Club } from '../lib/clubs'
import { clubMapPin, clubNumber, isClubOpenNow, markerIsRed, pluralClubs, priceLabel } from '../lib/clubs'
import { ClubCard } from './ClubCard'
import { ClubsMapBlock } from './ClubsMapBlock'

type SortMode = 'rating' | 'price' | 'name'
type ViewMode = 'list' | 'map'
type FilterKey = 'now' | 'late' | 'kids' | 'bar' | 'cheap'

const FILTER_DEFS: { key: FilterKey; label: string }[] = [
  { key: 'now', label: 'Открыто сейчас' },
  { key: 'late', label: 'Работает ночью' },
  { key: 'kids', label: 'С детьми' },
  { key: 'bar', label: 'Бар и кухня' },
  { key: 'cheap', label: 'До 1500 ₽/час' }
]

export function ClubsExplorer({
  clubs,
  districts,
  initialDistrict = 'all',
  initialFilter,
  initialView = 'list'
}: {
  clubs: Club[]
  districts: { name: string; count: number }[]
  initialDistrict?: string
  initialFilter?: FilterKey
  initialView?: ViewMode
}) {
  const [query, setQuery] = useState('')
  const [district, setDistrict] = useState(initialDistrict)
  const [sort, setSort] = useState<SortMode>('rating')
  const [view, setView] = useState<ViewMode>(initialView)
  const [flags, setFlags] = useState<Partial<Record<FilterKey, boolean>>>(
    initialFilter ? { [initialFilter]: true } : {}
  )
  const [compare, setCompare] = useState<string[]>([])
  const [showCompareTable, setShowCompareTable] = useState(false)

  const toggleFlag = (key: FilterKey) => setFlags((f) => ({ ...f, [key]: !f[key] }))

  const toggleCompare = (slug: string) => {
    setCompare((list) => {
      if (list.includes(slug)) return list.filter((s) => s !== slug)
      if (list.length >= 3) return list
      return [...list, slug]
    })
  }

  const matches = (c: Club) => {
    const q = query.trim().toLowerCase()
    if (q && !`${c.name} ${c.address} ${c.metro ?? ''} ${c.district}`.toLowerCase().includes(q)) return false
    if (district !== 'all' && c.district !== district) return false
    if (flags.now && !isClubOpenNow(c)) return false
    if (flags.late && !c.tags.includes('late') && !(c.sched && c.sched[0] && c.sched[0][1] >= 24)) return false
    if (flags.kids && !c.tags.includes('kids')) return false
    if (flags.bar && !c.tags.includes('bar')) return false
    if (flags.cheap && !(c.priceFrom && c.priceFrom <= 1500)) return false
    return true
  }

  const filtered = useMemo(() => {
    const result = clubs.filter(matches)
    return [...result].sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'ru')
      if (sort === 'price') return (a.priceFrom || 99999) - (b.priceFrom || 99999)
      return b.rating - a.rating
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubs, query, district, sort, flags])

  const compareClubs = compare.map((slug) => clubs.find((c) => c.slug === slug)).filter(Boolean) as Club[]
  const compareRows = compareClubs.length
    ? [
        { label: 'Клуб', cells: compareClubs.map((c) => c.name) },
        { label: 'Район', cells: compareClubs.map((c) => `${c.district}${c.metro ? ' · м. ' + c.metro : ''}`) },
        { label: 'Рейтинг', cells: compareClubs.map((c) => `${c.rating.toFixed(1)} (${c.reviews})`) },
        { label: 'Часы', cells: compareClubs.map((c) => c.hours) },
        { label: 'Цена', cells: compareClubs.map((c) => priceLabel(c)) },
        { label: 'Сейчас', cells: compareClubs.map((c) => (isClubOpenNow(c) ? 'Открыто' : 'Закрыто')) },
        { label: 'Особенности', cells: compareClubs.map((c) => c.amenities.join(', ')) }
      ]
    : []

  const resultLabel = `${pluralClubs(filtered.length)} из ${clubs.length}`

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 border-b border-ink/20 bg-paper2 px-6 py-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Название, адрес или метро"
          className="min-w-[220px] flex-1 border border-ink/40 bg-paper px-3 py-2.5 text-sm outline-none"
        />
        <div className="flex">
          <button
            onClick={() => setView('list')}
            className={`border border-ink/40 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.04em] ${
              view === 'list' ? 'bg-ink text-paper' : 'bg-transparent text-ink'
            }`}
          >
            Список
          </button>
          <button
            onClick={() => setView('map')}
            className={`border border-l-0 border-ink/40 px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.04em] ${
              view === 'map' ? 'bg-ink text-paper' : 'bg-transparent text-ink'
            }`}
          >
            Карта
          </button>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortMode)}
          className="border border-ink/40 bg-paper px-3 py-2.5 text-sm font-extrabold"
        >
          <option value="rating">Сначала по рейтингу</option>
          <option value="price">Сначала дешевле</option>
          <option value="name">По названию</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-ink/20 px-6 py-3.5">
        <span className="eyebrow mr-1">Фильтры</span>
        {FILTER_DEFS.map((f) => (
          <button key={f.key} onClick={() => toggleFlag(f.key)} className={`chip ${flags[f.key] ? 'bg-ink text-paper' : 'text-ink'}`}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b-2 border-ink/40 px-6 py-3.5">
        <span className="eyebrow mr-1">Район</span>
        <button onClick={() => setDistrict('all')} className={`chip ${district === 'all' ? 'bg-ink text-paper' : 'text-ink'}`}>
          Все районы
        </button>
        {districts.map((d) => (
          <button
            key={d.name}
            onClick={() => setDistrict(d.name)}
            className={`chip ${district === d.name ? 'bg-ink text-paper' : 'text-ink'}`}
          >
            {d.name.replace(' район', '')}
          </button>
        ))}
      </div>

      {compareClubs.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 bg-ink px-6 py-3 text-paper">
          <span className="text-[11px] uppercase tracking-[0.1em] opacity-70">Сравнение</span>
          {compareClubs.map((c) => (
            <span key={c.slug} className="text-sm font-extrabold">
              {c.name}{' '}
              <button onClick={() => toggleCompare(c.slug)} className="px-0.5 text-sm font-extrabold text-[#ff9783]">
                ✕
              </button>
            </span>
          ))}
          <button
            onClick={() => setShowCompareTable((v) => !v)}
            className="ml-auto bg-accent px-3.5 py-2 text-[13px] font-extrabold uppercase tracking-[0.04em] text-paper"
          >
            {showCompareTable ? 'Скрыть таблицу' : `Сравнить ${compareClubs.length}`}
          </button>
        </div>
      )}

      {showCompareTable && compareRows.length > 0 && (
        <section className="overflow-x-auto border-b-2 border-ink/40 p-6">
          <table className="w-full min-w-[520px] border-collapse text-sm">
            <tbody>
              {compareRows.map((r) => (
                <tr key={r.label}>
                  <th className="whitespace-nowrap border-b border-ink/20 py-2.5 pr-3 text-left text-[11px] font-extrabold uppercase tracking-[0.1em] text-muted">
                    {r.label}
                  </th>
                  {r.cells.map((cell, i) => (
                    <td key={i} className="border-b border-l border-ink/20 px-3 py-2.5 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {view === 'map' ? (
        <section className="grid grid-cols-1 gap-6 border-b-2 border-ink/40 p-6 sm:grid-cols-2">
          <ClubsMapBlock
            className="aspect-square sm:aspect-[1.3]"
            footnote="Метки расставлены по реальным координатам клубов — после подключения Яндекс.Карт JS API лягут на тайлы города."
            markers={filtered.map((c) => ({ lat: c.lat, lng: c.lng, label: c.name, href: `/clubs/${c.slug}`, active: markerIsRed(c) }))}
            stubPins={filtered.map((c) => {
              const pin = clubMapPin(c)
              return { x: pin.x, y: pin.y, label: clubNumber(c.slug), href: `/clubs/${c.slug}`, active: markerIsRed(c) }
            })}
          />
          <div>
            <div className="eyebrow mb-2.5">{resultLabel}</div>
            {filtered.map((c) => (
              <a
                key={c.slug}
                href={`/clubs/${c.slug}`}
                className="grid grid-cols-[28px_1fr_auto] items-baseline gap-3 border-b border-ink/20 py-3 text-ink no-underline hover:text-ink"
              >
                <span className="text-xs text-muted">{clubNumber(c.slug)}</span>
                <span>
                  <span className="text-base font-extrabold">{c.name}</span>
                  <br />
                  <span className="text-[13px] text-muted">{c.address}</span>
                </span>
                <span className="text-[15px] font-extrabold">{c.rating.toFixed(1)}</span>
              </a>
            ))}
          </div>
        </section>
      ) : (
        <section className="p-6">
          <div className="eyebrow mb-3.5">{resultLabel}</div>
          <div className="grid grid-cols-1 gap-0.5 bg-ink/40 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <ClubCard
                key={c.slug}
                club={c}
                number={clubNumber(c.slug)}
                hidePromo
                footer={
                  <button
                    onClick={() => toggleCompare(c.slug)}
                    className={`border-t border-ink/20 px-4 py-3 text-left text-xs font-extrabold uppercase tracking-[0.06em] ${
                      compare.includes(c.slug) ? 'bg-accent-soft text-accent-dark' : 'text-muted2'
                    }`}
                  >
                    {compare.includes(c.slug) ? '✓ В сравнении' : '+ Сравнить'}
                  </button>
                }
              />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="mt-0.5 border-2 border-dashed border-ink/40 p-10">
              <div className="mb-1.5 text-xl font-extrabold">Ничего не нашлось</div>
              <p className="mb-4 text-muted2">Попробуйте снять часть фильтров — например, «Открыто сейчас».</p>
              <button
                onClick={() => {
                  setFlags({})
                  setDistrict('all')
                  setQuery('')
                }}
                className="btn-accent"
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
