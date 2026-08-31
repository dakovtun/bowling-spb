import type { Metadata } from 'next'
import { CLUBS, getAllDistricts } from '../../lib/clubs'
import { breadcrumbSchema, clubsListSchema } from '../../lib/schema'
import { ClubsExplorer } from '../../components/ClubsExplorer'
import { JsonLd } from '../../components/JsonLd'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Все боулинг-клубы Санкт-Петербурга',
  description: 'Каталог боулинг-клубов Санкт-Петербурга с фильтром по району, времени и цене: адреса, часы, цены, рейтинг.',
  alternates: { canonical: '/clubs' }
}

const FILTER_KEYS = ['now', 'late', 'kids', 'bar', 'cheap'] as const

export default function ClubsPage({ searchParams }: { searchParams: { district?: string; filter?: string; view?: string } }) {
  const districts = getAllDistricts()
  const initialDistrict =
    searchParams.district && districts.some((d) => d.name === searchParams.district) ? searchParams.district : 'all'
  const initialFilter = FILTER_KEYS.find((f) => f === searchParams.filter)
  const initialView = searchParams.view === 'map' ? 'map' : 'list'

  return (
    <>
      <JsonLd data={clubsListSchema(CLUBS)} />
      <JsonLd data={breadcrumbSchema([{ name: 'Главная', path: '/' }, { name: 'Клубы' }])} />
      <div>
      <section className="border-b-2 border-ink/40 px-6 pb-6 pt-9">
        <div className="eyebrow mb-3">Каталог</div>
        <h1 className="mb-3 text-[44px] font-extrabold leading-none tracking-tight">Боулинг-клубы Петербурга</h1>
        <p className="max-w-[60ch] text-muted2">
          Фильтруйте по району, времени и цене — или переключитесь на карту, чтобы найти ближайший.
        </p>
      </section>
      <ClubsExplorer
        clubs={CLUBS}
        districts={districts}
        initialDistrict={initialDistrict}
        initialFilter={initialFilter}
        initialView={initialView}
      />
      </div>
    </>
  )
}
