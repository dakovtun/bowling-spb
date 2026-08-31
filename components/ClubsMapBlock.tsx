import { MapFrame, MapPin } from './MapFrame'
import { YandexMap, type MapMarker } from './YandexMap'

interface StubPin {
  x: number
  y: number
  label: string
  href: string
  active?: boolean
}

/**
 * Показывает настоящую карту Яндекс.Карт, если задан NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
 * иначе — прежнюю декоративную заглушку с сеткой и пинами.
 */
export function ClubsMapBlock({
  markers,
  stubPins,
  className = '',
  footnote
}: {
  markers: MapMarker[]
  stubPins: StubPin[]
  className?: string
  footnote?: string
}) {
  const hasKey = !!process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY

  if (hasKey) {
    return <YandexMap markers={markers} className={`border-2 border-ink ${className}`} />
  }

  return (
    <MapFrame className={className} footnote={footnote}>
      {stubPins.map((p) => (
        <MapPin key={p.label} x={p.x} y={p.y} label={p.label} href={p.href} active={p.active} />
      ))}
    </MapFrame>
  )
}
