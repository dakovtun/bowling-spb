import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CLUBS, districtLocative, districtSlug, getAllDistricts, getDistrictBySlug, pluralClubs } from '../../../../lib/clubs'
import { breadcrumbSchema, clubsListSchema } from '../../../../lib/schema'
import { ClubsExplorer } from '../../../../components/ClubsExplorer'
import { JsonLd } from '../../../../components/JsonLd'

export const revalidate = 300

export function generateStaticParams() {
  return getAllDistricts().map((d) => ({ slug: districtSlug(d.name) }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const district = getDistrictBySlug(params.slug)
  if (!district) return {}
  const loc = districtLocative(district.name)
  return {
    title: `Боулинг в ${loc}`,
    description: `Боулинг-клубы в ${loc} Санкт-Петербурга: адреса, цены на дорожки, часы работы и рейтинг. Всего ${pluralClubs(district.count)}.`,
    alternates: { canonical: `/clubs/rayon/${params.slug}` }
  }
}

export default function DistrictPage({ params }: { params: { slug: string } }) {
  const district = getDistrictBySlug(params.slug)
  if (!district) notFound()

  const loc = districtLocative(district.name)
  const districts = getAllDistricts()
  const districtClubs = CLUBS.filter((c) => c.district === district.name)

  return (
    <>
      <JsonLd data={clubsListSchema(districtClubs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Главная', path: '/' },
          { name: 'Клубы', path: '/clubs' },
          { name: district.name }
        ])}
      />
      <div>
        <section className="border-b-2 border-ink/40 px-6 pb-6 pt-9">
          <div className="eyebrow mb-3">Район</div>
          <h1 className="mb-3 text-[44px] font-extrabold leading-none tracking-tight">Боулинг в {loc}</h1>
          <p className="max-w-[60ch] text-muted2">
            {pluralClubs(district.count)} в {loc} Санкт-Петербурга — актуальные цены, часы работы и рейтинг.
          </p>
        </section>
        <ClubsExplorer clubs={CLUBS} districts={districts} initialDistrict={district.name} />
      </div>
    </>
  )
}
