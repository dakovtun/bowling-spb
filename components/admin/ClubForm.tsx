'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Club, ClubImage, DaySchedule, PriceTableData } from '../../lib/clubs'

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const TAG_OPTIONS: { key: Club['tags'][number]; label: string }[] = [
  { key: 'kids', label: 'С детьми (горка)' },
  { key: 'bar', label: 'Бар и кухня' },
  { key: 'late', label: 'Работает допоздна / ночью' },
  { key: '24', label: 'Круглосуточно' }
]

function emptyClub(): Club {
  return {
    slug: '',
    name: '',
    district: '',
    metro: '',
    address: '',
    phone: '',
    rating: 0,
    reviews: '',
    website: '',
    hours: '',
    priceFrom: null,
    sched: [null, null, null, null, null, null, null],
    lat: 59.93,
    lng: 30.33,
    tags: [],
    amenities: [],
    description: '',
    longDescription: '',
    priceNote: '',
    priceTables: [],
    quote: '',
    mapUrl: '',
    images: []
  }
}

export function ClubForm({ initialClub }: { initialClub?: Club }) {
  const router = useRouter()
  const isEdit = !!initialClub
  const [club, setClub] = useState<Club>(initialClub ?? emptyClub())
  const [amenitiesText, setAmenitiesText] = useState((initialClub?.amenities ?? []).join('\n'))
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function set<K extends keyof Club>(key: K, value: Club[K]) {
    setClub((c) => ({ ...c, [key]: value }))
  }

  function toggleTag(tag: Club['tags'][number]) {
    setClub((c) => ({
      ...c,
      tags: c.tags.includes(tag) ? c.tags.filter((t) => t !== tag) : [...c.tags, tag]
    }))
  }

  function setDay(dayIdx: number, value: DaySchedule) {
    setClub((c) => {
      const sched = [...(c.sched ?? [null, null, null, null, null, null, null])] as DaySchedule[]
      sched[dayIdx] = value
      return { ...c, sched }
    })
  }

  function addImage() {
    setClub((c) => ({ ...c, images: [...c.images, { url: '', alt: '' }] }))
  }
  function updateImage(i: number, patch: Partial<ClubImage>) {
    setClub((c) => ({ ...c, images: c.images.map((im, idx) => (idx === i ? { ...im, ...patch } : im)) }))
  }
  function removeImage(i: number) {
    setClub((c) => ({ ...c, images: c.images.filter((_, idx) => idx !== i) }))
  }

  function addPriceTable() {
    setClub((c) => ({ ...c, priceTables: [...c.priceTables, { title: '', rows: [] }] }))
  }
  function updatePriceTable(i: number, patch: Partial<PriceTableData>) {
    setClub((c) => ({ ...c, priceTables: c.priceTables.map((t, idx) => (idx === i ? { ...t, ...patch } : t)) }))
  }
  function removePriceTable(i: number) {
    setClub((c) => ({ ...c, priceTables: c.priceTables.filter((_, idx) => idx !== i) }))
  }
  function addPriceRow(tableIdx: number) {
    setClub((c) => ({
      ...c,
      priceTables: c.priceTables.map((t, idx) =>
        idx === tableIdx ? { ...t, rows: [...t.rows, { label: '', price: '' }] } : t
      )
    }))
  }
  function updatePriceRow(tableIdx: number, rowIdx: number, patch: { label?: string; price?: string }) {
    setClub((c) => ({
      ...c,
      priceTables: c.priceTables.map((t, idx) =>
        idx === tableIdx
          ? { ...t, rows: t.rows.map((r, ri) => (ri === rowIdx ? { ...r, ...patch } : r)) }
          : t
      )
    }))
  }
  function removePriceRow(tableIdx: number, rowIdx: number) {
    setClub((c) => ({
      ...c,
      priceTables: c.priceTables.map((t, idx) =>
        idx === tableIdx ? { ...t, rows: t.rows.filter((_, ri) => ri !== rowIdx) } : t
      )
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const payload: Club = {
      ...club,
      amenities: amenitiesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
    }

    if (!payload.slug.trim() || !payload.name.trim() || !payload.district.trim()) {
      setError('Заполните обязательные поля: slug, название, район')
      return
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/admin/clubs/${initialClub!.slug}` : '/api/admin/clubs'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Не удалось сохранить')
        return
      }
      router.push('/admin/clubs')
      router.refresh()
    } catch {
      setError('Ошибка сети')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full border-2 border-ink/40 px-2.5 py-2 text-sm outline-none focus:border-ink'
  const labelCls = 'mb-1 block text-xs font-extrabold uppercase tracking-[0.04em] text-muted'

  return (
    <form onSubmit={handleSubmit} className="flex max-w-3xl flex-col gap-8">
      {error && <p className="border-2 border-red-600 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

      {/* Основное */}
      <section className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Slug (латиницей, для URL) *</label>
          <input
            className={inputCls}
            value={club.slug}
            onChange={(e) => set('slug', e.target.value.trim().toLowerCase())}
            placeholder="my-club"
          />
        </div>
        <div>
          <label className={labelCls}>Название *</label>
          <input className={inputCls} value={club.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Район *</label>
          <input
            className={inputCls}
            value={club.district}
            onChange={(e) => set('district', e.target.value)}
            placeholder="Московский район"
          />
        </div>
        <div>
          <label className={labelCls}>Метро</label>
          <input className={inputCls} value={club.metro ?? ''} onChange={(e) => set('metro', e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Адрес</label>
          <input className={inputCls} value={club.address} onChange={(e) => set('address', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Телефон</label>
          <input className={inputCls} value={club.phone ?? ''} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Сайт</label>
          <input className={inputCls} value={club.website ?? ''} onChange={(e) => set('website', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Рейтинг (0–5)</label>
          <input
            type="number"
            step="0.1"
            min={0}
            max={5}
            className={inputCls}
            value={club.rating}
            onChange={(e) => set('rating', Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Отзывы (текстом, например «124 отзыва»)</label>
          <input className={inputCls} value={club.reviews} onChange={(e) => set('reviews', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Часы работы (текстом для отображения)</label>
          <input className={inputCls} value={club.hours} onChange={(e) => set('hours', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Цена от, ₽/час (пусто — «цена по звонку»)</label>
          <input
            type="number"
            className={inputCls}
            value={club.priceFrom ?? ''}
            onChange={(e) => set('priceFrom', e.target.value === '' ? null : Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Широта (lat)</label>
          <input
            type="number"
            step="0.0001"
            className={inputCls}
            value={club.lat}
            onChange={(e) => set('lat', Number(e.target.value))}
          />
        </div>
        <div>
          <label className={labelCls}>Долгота (lng)</label>
          <input
            type="number"
            step="0.0001"
            className={inputCls}
            value={club.lng}
            onChange={(e) => set('lng', Number(e.target.value))}
          />
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Ссылка «Построить маршрут» (Google/Yandex Maps URL)</label>
          <input className={inputCls} value={club.mapUrl} onChange={(e) => set('mapUrl', e.target.value)} />
        </div>
      </section>

      {/* Расписание по дням */}
      <section>
        <div className="mb-2 text-sm font-extrabold uppercase tracking-[0.04em]">Расписание по дням</div>
        <div className="flex flex-col gap-1.5">
          {DAY_LABELS.map((label, i) => {
            const day = club.sched?.[i] ?? null
            const closed = day === null
            return (
              <div key={label} className="flex items-center gap-3">
                <span className="w-8 text-sm font-bold">{label}</span>
                <label className="flex items-center gap-1.5 text-sm">
                  <input type="checkbox" checked={closed} onChange={(e) => setDay(i, e.target.checked ? null : [11, 23])} />
                  Выходной
                </label>
                {!closed && (
                  <>
                    <input
                      type="number"
                      className="w-20 border-2 border-ink/40 px-2 py-1 text-sm"
                      value={day![0]}
                      onChange={(e) => setDay(i, [Number(e.target.value), day![1]])}
                    />
                    <span className="text-sm">до</span>
                    <input
                      type="number"
                      className="w-20 border-2 border-ink/40 px-2 py-1 text-sm"
                      value={day![1]}
                      onChange={(e) => setDay(i, [day![0], Number(e.target.value)])}
                    />
                    <span className="text-xs text-muted2">(&gt;24 — переход за полночь)</span>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Теги и удобства */}
      <section className="grid grid-cols-2 gap-6">
        <div>
          <div className="mb-2 text-sm font-extrabold uppercase tracking-[0.04em]">Теги</div>
          <div className="flex flex-col gap-1.5">
            {TAG_OPTIONS.map((t) => (
              <label key={t.key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={club.tags.includes(t.key)} onChange={() => toggleTag(t.key)} />
                {t.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className={labelCls}>Удобства (по одному на строку)</label>
          <textarea
            className={`${inputCls} h-32`}
            value={amenitiesText}
            onChange={(e) => setAmenitiesText(e.target.value)}
            placeholder={'Боулинг\nБар и кухня\nБильярд'}
          />
        </div>
      </section>

      {/* Тексты */}
      <section className="flex flex-col gap-4">
        <div>
          <label className={labelCls}>Короткое описание (для карточки)</label>
          <input className={inputCls} value={club.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Подробное описание</label>
          <textarea
            className={`${inputCls} h-28`}
            value={club.longDescription}
            onChange={(e) => set('longDescription', e.target.value)}
          />
        </div>
        <div>
          <label className={labelCls}>Примечание о ценах</label>
          <input className={inputCls} value={club.priceNote} onChange={(e) => set('priceNote', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Цитата из отзыва</label>
          <input className={inputCls} value={club.quote} onChange={(e) => set('quote', e.target.value)} />
        </div>
      </section>

      {/* Таблицы цен */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-extrabold uppercase tracking-[0.04em]">Таблицы цен</div>
          <button type="button" onClick={addPriceTable} className="text-sm font-bold text-accent hover:underline">
            + Добавить таблицу
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {club.priceTables.map((table, ti) => (
            <div key={ti} className="border-2 border-ink/40 p-3">
              <div className="mb-2 flex items-center gap-2">
                <input
                  className={inputCls}
                  placeholder="Название таблицы, напр. «Боулинг, 1 дорожка / час»"
                  value={table.title}
                  onChange={(e) => updatePriceTable(ti, { title: e.target.value })}
                />
                <button type="button" onClick={() => removePriceTable(ti)} className="text-sm font-bold text-red-600">
                  Удалить
                </button>
              </div>
              <div className="flex flex-col gap-1.5">
                {table.rows.map((row, ri) => (
                  <div key={ri} className="flex items-center gap-2">
                    <input
                      className="flex-1 border border-ink/40 px-2 py-1 text-sm"
                      placeholder="Пн–Чт, до 16:00"
                      value={row.label}
                      onChange={(e) => updatePriceRow(ti, ri, { label: e.target.value })}
                    />
                    <input
                      className="w-32 border border-ink/40 px-2 py-1 text-sm"
                      placeholder="900 ₽"
                      value={row.price}
                      onChange={(e) => updatePriceRow(ti, ri, { price: e.target.value })}
                    />
                    <button type="button" onClick={() => removePriceRow(ti, ri)} className="text-xs text-red-600">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => addPriceRow(ti)}
                className="mt-2 text-xs font-bold text-accent hover:underline"
              >
                + Строка
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Фото */}
      <section>
        <div className="mb-2 flex items-center justify-between">
          <div className="text-sm font-extrabold uppercase tracking-[0.04em]">Фото</div>
          <button type="button" onClick={addImage} className="text-sm font-bold text-accent hover:underline">
            + Добавить фото
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {club.images.map((im, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="flex-1 border border-ink/40 px-2 py-1 text-sm"
                placeholder="/images/clubs/my-photo.jpg"
                value={im.url}
                onChange={(e) => updateImage(i, { url: e.target.value })}
              />
              <input
                className="flex-1 border border-ink/40 px-2 py-1 text-sm"
                placeholder="Описание фото (alt)"
                value={im.alt}
                onChange={(e) => updateImage(i, { alt: e.target.value })}
              />
              <button type="button" onClick={() => removeImage(i)} className="text-xs text-red-600">
                ✕
              </button>
            </div>
          ))}
          {club.images.length === 0 && <p className="text-sm text-muted2">Фото нет — покажется иконка-заглушка.</p>}
        </div>
      </section>

      <div className="flex items-center gap-3 border-t-2 border-ink/40 pt-5">
        <button type="submit" disabled={saving} className="btn-accent disabled:opacity-50">
          {saving ? 'Сохраняю…' : isEdit ? 'Сохранить изменения' : 'Создать клуб'}
        </button>
        <button type="button" onClick={() => router.push('/admin/clubs')} className="btn-outline">
          Отмена
        </button>
      </div>
    </form>
  )
}
