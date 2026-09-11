import type { MetadataRoute } from 'next'
import { SCENARIO_DEFS, districtSlug, getAllDistricts } from '../lib/clubs'
import { fetchClubs } from '../lib/db'
import { SITE_URL } from '../lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const clubs = await fetchClubs()
  const staticPages = ['', '/clubs', '/about', '/contact'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date()
  }))
  const clubPages = clubs.map((club) => ({
    url: `${SITE_URL}/clubs/${club.slug}`,
    lastModified: new Date()
  }))
  const districtPages = getAllDistricts(clubs).map((d) => ({
    url: `${SITE_URL}/clubs/rayon/${districtSlug(d.name)}`,
    lastModified: new Date()
  }))
  const scenarioPages = SCENARIO_DEFS.map((s) => ({
    url: `${SITE_URL}/clubs/podborka/${s.slug}`,
    lastModified: new Date()
  }))
  return [...staticPages, ...clubPages, ...districtPages, ...scenarioPages]
}
