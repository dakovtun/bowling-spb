import { ImageResponse } from 'next/og'
import { getClubBySlug, priceLabel } from '../../../lib/clubs'
import { fetchClubs } from '../../../lib/db'
import { SITE_NAME } from '../../../lib/constants'

// ВНИМАНИЕ: этот файл раньше работал в edge-рантайме. lib/db.ts использует
// @upstash/redis, который в edge-рантайме тоже поддерживается (это HTTP REST
// клиент, не завязанный на Node.js API), так что runtime='edge' оставлен как есть.
export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export async function generateImageMetadata({ params }: { params: { slug: string } }) {
  const clubs = await fetchClubs()
  const club = getClubBySlug(params.slug, clubs)
  return [{ id: 'default', alt: club ? `${club.name} — ${SITE_NAME}` : SITE_NAME, size, contentType }]
}

export default async function Image({ params }: { params: { slug: string } }) {
  const clubs = await fetchClubs()
  const club = getClubBySlug(params.slug, clubs)
  const title = club?.name ?? SITE_NAME
  const meta = club ? [club.district, priceLabel(club)].filter(Boolean).join(' · ') : ''

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#f3f2f2',
          color: '#201e1d',
          fontFamily: 'sans-serif'
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, fontWeight: 800, letterSpacing: 4, textTransform: 'uppercase', color: '#ec3013' }}>
          {SITE_NAME}
        </div>
        <div style={{ display: 'flex', fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 24, maxWidth: 1000 }}>{title}</div>
        {meta && <div style={{ display: 'flex', fontSize: 32, marginTop: 28, color: '#605d5d' }}>{meta}</div>}
        {club && (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 40 }}>
            <div style={{ display: 'flex', fontSize: 48, fontWeight: 800, color: '#ec3013' }}>{club.rating.toFixed(1)}</div>
            <div style={{ display: 'flex', fontSize: 24, color: '#605d5d' }}>{club.reviews}</div>
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
