'use client'

import { useState } from 'react'

export function ContactForm() {
  const [sent, setSent] = useState(false)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
      className="flex flex-col gap-3.5 border-2 border-ink bg-paper2 p-6"
    >
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.06em]">Тема</span>
        <select className="w-full border border-ink/40 bg-paper px-3 py-2.5 text-sm">
          <option>Неточность в карточке</option>
          <option>Добавить клуб</option>
          <option>Я представляю клуб</option>
          <option>Другое</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.06em]">Почта для ответа</span>
        <input type="email" placeholder="you@mail.ru" className="w-full border border-ink/40 bg-paper px-3 py-2.5 text-sm" />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.06em]">Сообщение</span>
        <textarea rows={5} placeholder="Что поправить?" className="w-full resize-y border border-ink/40 bg-paper px-3 py-2.5 text-sm" />
      </label>
      <button type="submit" className="btn-accent justify-start">
        {sent ? 'Отправлено ✓' : 'Отправить сообщение'}
      </button>
    </form>
  )
}
