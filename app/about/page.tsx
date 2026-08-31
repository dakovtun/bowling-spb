import type { Metadata } from 'next'
import Link from 'next/link'
import { CLUBS, getAllDistricts } from '../../lib/clubs'

export const metadata: Metadata = {
  title: 'О проекте',
  description: 'Независимый гид по боулинг-клубам Санкт-Петербурга: как мы собираем и проверяем информацию.',
  alternates: { canonical: '/about' }
}

const METHOD_STEPS = [
  {
    num: '01',
    title: 'Сверяем с первоисточником',
    text: 'Часы и цены берём с официальных сайтов клубов, а не с агрегаторов.'
  },
  {
    num: '02',
    title: 'Читаем отзывы',
    text: 'Из отзывов на картах вытаскиваем то, чего нет в описаниях: горка для детей, шум, парковка.'
  },
  {
    num: '03',
    title: 'Помечаем неизвестное',
    text: 'Если прайса нет в открытом доступе — так и пишем, а не подставляем чужие цифры.'
  }
]

export default function AboutPage() {
  const facts = [
    { value: String(CLUBS.length), label: 'клубов в каталоге' },
    { value: String(getAllDistricts().length), label: 'районов города' },
    { value: '0 ₽', label: 'платных размещений' },
    { value: '2026', label: 'последняя сверка данных' }
  ]

  return (
    <div>
      <section className="grid grid-cols-1 gap-8 border-b-2 border-ink/40 px-6 py-11 sm:grid-cols-2">
        <div>
          <div className="eyebrow mb-3">О проекте</div>
          <h1 className="mb-5 text-5xl font-extrabold leading-none tracking-tight">Справочник, а не агрегатор</h1>
          <p className="mb-3.5 mb-[14px] text-[17px] leading-relaxed">
            «Боулинг СПб» — независимый гид по боулинг-клубам Петербурга. Мы собираем адреса, часы работы, прайсы и
            живые впечатления гостей в одном месте и не берём деньги с клубов за место в каталоге.
          </p>
          <p className="text-[17px] leading-relaxed">
            Данные проверяем по официальным сайтам клубов и картам. Если что-то устарело — напишите, поправим в тот же
            день.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-0.5 border-2 border-ink/40 bg-ink/40 sm:grid-cols-2">
          {facts.map((f) => (
            <div key={f.label} className="bg-paper p-[18px]">
              <div className="text-4xl font-extrabold leading-none text-accent">{f.value}</div>
              <div className="mt-1 text-[13px] text-muted2">{f.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b-2 border-ink/40 px-6 py-11">
        <h2 className="mb-5 text-[32px] font-extrabold tracking-tight">Как мы собираем данные</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {METHOD_STEPS.map((s) => (
            <div key={s.num} className="border-t-2 border-ink pt-3.5">
              <div className="mb-1.5 text-xs font-extrabold text-accent">{s.num}</div>
              <div className="mb-1.5 text-lg font-extrabold">{s.title}</div>
              <p className="text-[15px] leading-relaxed text-muted2">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-wrap items-end justify-between gap-6 bg-accent px-6 py-12 text-paper">
        <h2 className="max-w-[22ch] text-4xl font-extrabold leading-tight tracking-tight">
          Вы клуб и хотите обновить карточку или прайс?
        </h2>
        <Link href="/contact" className="bg-paper px-[22px] py-4 text-[15px] font-extrabold text-ink no-underline hover:bg-paper2">
          Связаться →
        </Link>
      </section>
    </div>
  )
}
