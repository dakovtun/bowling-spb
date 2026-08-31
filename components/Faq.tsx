import type { FaqItem } from '../lib/faq'

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <section className="border-b-2 border-ink/40 px-6 py-11">
      <h2 className="mb-5 text-[32px] font-extrabold tracking-tight">Частые вопросы</h2>
      <div className="max-w-[760px] divide-y divide-ink/20 border-t-2 border-ink/40">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex list-none cursor-pointer items-center justify-between gap-4 text-base font-extrabold">
              {item.question}
              <span className="shrink-0 text-xl leading-none text-accent transition-transform duration-150 group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 max-w-[64ch] text-[15px] leading-relaxed text-muted2">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
