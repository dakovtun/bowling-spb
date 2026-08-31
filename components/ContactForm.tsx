'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [topic, setTopic] = useState('Неточность в карточке')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [website, setWebsite] = useState('') // honeypot — скрытое поле, боты его заполняют, люди нет

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!message.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, email, message, website })
      })
      if (!res.ok) throw new Error('request failed')
      setStatus('sent')
      setEmail('')
      setMessage('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col gap-2 border-2 border-ink bg-paper2 p-6">
        <div className="text-xl font-extrabold">Спасибо, сообщение отправлено ✓</div>
        <p className="text-sm text-muted2">Мы разбираем обращения по очереди и постараемся ответить как можно скорее.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 border-2 border-ink bg-paper2 p-6">
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.06em]">Тема</span>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full border border-ink/40 bg-paper px-3 py-2.5 text-sm"
        >
          <option>Неточность в карточке</option>
          <option>Добавить клуб</option>
          <option>Я представляю клуб</option>
          <option>Другое</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.06em]">Почта для ответа</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@mail.ru"
          className="w-full border border-ink/40 bg-paper px-3 py-2.5 text-sm"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-extrabold uppercase tracking-[0.06em]">Сообщение</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Что поправить?"
          className="w-full resize-y border border-ink/40 bg-paper px-3 py-2.5 text-sm"
        />
      </label>
      <input
        type="text"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <button type="submit" disabled={status === 'sending'} className="btn-accent justify-start disabled:opacity-60">
        {status === 'sending' ? 'Отправляем…' : 'Отправить сообщение'}
      </button>
      {status === 'error' && <p className="text-sm text-accent">Не получилось отправить. Попробуйте ещё раз чуть позже.</p>}
    </form>
  )
}
