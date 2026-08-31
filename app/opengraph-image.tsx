import { ImageResponse } from 'next/og'
import { SITE_DESCRIPTION, SITE_NAME } from '../lib/constants'

export const runtime = 'edge'
export const alt = SITE_NAME
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
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
          Независимый гид
        </div>
        <div style={{ display: 'flex', fontSize: 92, fontWeight: 800, lineHeight: 1.02, marginTop: 24 }}>{SITE_NAME}</div>
        <div style={{ display: 'flex', fontSize: 32, marginTop: 28, maxWidth: 920, color: '#605d5d' }}>{SITE_DESCRIPTION}</div>
      </div>
    ),
    { ...size }
  )
}
