import type { MetadataRoute } from 'next'
import { CLUBS } from '../lib/clubs'
import { SITE_URL } from '../lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ['', '/clubs', '/about', '/contact'].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date()
  }))
  const clubPages = CLUBS.map((club) => ({
    url: `${SITE_URL}/clubs/${club.slug}`,
    lastModified: new Date()
  }))
  return [...staticPages, ...clubPages]
}
