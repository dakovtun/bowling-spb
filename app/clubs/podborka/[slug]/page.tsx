import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CLUBS, SCENARIO_DEFS, clubsForScenario, getAllDistricts } from '../../../../lib/clubs'
import { breadcrumbSchema, clubsListSchema } from '../../../../lib/schema'
import { ClubsExplorer } from '../../../../components/ClubsExplorer'
import { JsonLd } from '../../../../components/JsonLd'

export const revalidate = 300

export function generateStaticParams() {
  return SCENARIO_DEFS.map((s) => ({ slug: s.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const scenario = SCENARIO_DEFS.find((s) => s.slug === params.slug)
  if (!scenario) return {}
  return {
    title: scenario.title,
    description: scenario.description,
    alternates: { canonical: `/clubs/podborka/${scenario.slug}` }
  }
}

export default function ScenarioPage({ params }: { params: { slug: string } }) {
  const scenario = SCENARIO_DEFS.find((s) => s.slug === params.slug)
  if (!scenario) notFound()

  const districts = getAllDistricts()
  const scenarioClubs = clubsForScenario(scenario.filter)

  return (
    <>
      <JsonLd data={clubsListSchema(scenarioClubs)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Главная', path: '/' },
          { name: 'Клубы', path: '/clubs' },
          { name: scenario.h1 }
        ])}
      />
      <div>
        <section className="border-b-2 border-ink/40 px-6 pb-6 pt-9">
          <div className="eyebrow mb-3">Подборка</div>
          <h1 className="mb-3 text-[44px] font-extrabold leading-none tracking-tight">{scenario.h1}</h1>
          <p className="max-w-[60ch] text-muted2">{scenario.intro}</p>
        </section>
        <ClubsExplorer clubs={CLUBS} districts={districts} initialFilter={scenario.filter} />
      </div>
    </>
  )
}
