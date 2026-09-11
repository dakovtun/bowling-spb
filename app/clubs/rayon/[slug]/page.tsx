import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { districtLocative, districtSlug, getAllDistricts, getDistrictBySlug, pluralClubs } from '../../../../lib/clubs'
import { fetchClubs } from '../../../../lib/db'
import { breadcrumbSchema, clubsListSchema } from '../../../../lib/schema'
import { ClubsExplorer } from '../../../../components/ClubsExplorer'
import { JsonLd } from '../../../../components/JsonLd'

export const revalidate = 300

export async function generateStaticParams() {
  const clubs = await fetchClubs()
  return getAllDistricts(clubs).map((d) => ({ slug: districtSlug(d.name) }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const clubs = await fetchClubs()
  const district = getDistrictBySlug(params.slug, clubs)
  if (!district) return {}
  const loc = districtLocative(district.name)
  return {
    title: `Боулинг в ${loc}`,
    description: `Боулинг-клубы в ${loc} Санкт-Петербурга: адреса, цены на дорожки, часы работы и рейтинг. Всего ${pluralClubs(district.count)}.`,
    alternates: { canonical: `/clubs/rayon/${params.slug}` }
  }
}

export default async function DistrictPage({ params }: { params: { slug: string } }) {
  const clubs = await fetchClubs()
  const district = getDistrictBySlug(params.slug, clubs)
  if (!district) notFound()

  const loc = districtLocative(district.name)
  const districts = getAllDistricts(clubs)
  const districtClubs = clubs.filter((c) => c.district === district.name)

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
        <ClubsExplorer clubs={clubs} districts={districts} initialDistrict={district.name} />
      </div>
    </>
  )
}
