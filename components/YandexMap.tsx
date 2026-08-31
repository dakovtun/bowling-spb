'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

declare global {
  interface Window {
    ymaps?: any
  }
}

export interface MapMarker {
  lat: number
  lng: number
  label: string
  href: string
  active?: boolean
}

const SPB_CENTER: [number, number] = [59.938, 30.315]

let loadPromise: Promise<void> | null = null

function loadYmaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.ymaps) return Promise.resolve()
  if (loadPromise) return loadPromise
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`
    script.async = true
    script.onload = () => window.ymaps!.ready(() => resolve())
    script.onerror = () => reject(new Error('Failed to load Yandex Maps JS API'))
    document.head.appendChild(script)
  })
  return loadPromise
}

/**
 * Настоящая карта Яндекс.Карт (JS API 2.1) с метками клубов.
 * Требует переменную окружения NEXT_PUBLIC_YANDEX_MAPS_API_KEY.
 * Если ключ не задан или загрузка не удалась, ничего не рендерит —
 * вызывающий компонент должен показать запасной вариант (см. MapFrame).
 */
export function YandexMap({ markers, className = '' }: { markers: MapMarker[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const router = useRouter()
  const [failed, setFailed] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY

  useEffect(() => {
    if (!apiKey || !containerRef.current) return
    let cancelled = false

    loadYmaps(apiKey)
      .then(() => {
        if (cancelled || !containerRef.current || !window.ymaps) return
        const ymaps = window.ymaps
        const map = new ymaps.Map(containerRef.current, {
          center: SPB_CENTER,
          zoom: 10,
          controls: ['zoomControl']
        })
        mapRef.current = map

        markers.forEach((m) => {
          const placemark = new ymaps.Placemark(
            [m.lat, m.lng],
            { hintContent: m.label, balloonContent: m.label },
            { preset: m.active ? 'islands#redIcon' : 'islands#darkGreenIcon' }
          )
          placemark.events.add('click', () => router.push(m.href))
          map.geoObjects.add(placemark)
        })

        const fitToMarkers = () => {
          if (!mapRef.current) return
          mapRef.current.container.fitToViewport()
          if (markers.length > 0) {
            mapRef.current.setBounds(mapRef.current.geoObjects.getBounds(), {
              checkZoomRange: true,
              zoomMargin: 40
            })
          }
        }

        fitToMarkers()

        // На мобильных контейнер часто меняет размер уже после первого рендера
        // (реальная высота блока «Все клубы на карте» под квадратный экран,
        // поворот экрана и т.д.) — пересчитываем зону показа карты при любом
        // изменении размеров контейнера, чтобы все метки оставались видны.
        if (containerRef.current && typeof ResizeObserver !== 'undefined') {
          resizeObserverRef.current = new ResizeObserver(() => {
            if (!cancelled) fitToMarkers()
          })
          resizeObserverRef.current.observe(containerRef.current)
        }
      })
      .catch(() => setFailed(true))

    return () => {
      cancelled = true
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
      if (mapRef.current) {
        mapRef.current.destroy()
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, markers])

  if (!apiKey || failed) return null

  return <div ref={containerRef} className={className} />
}
