import type { Metadata } from 'next'
import { ContactForm } from '../../components/ContactForm'

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с нами, если заметили неточность в карточке клуба или хотите добавить свой боулинг-центр.',
  alternates: { canonical: '/contact' }
}

export default function ContactPage() {
  return (
    <section className="grid grid-cols-1 gap-8 px-6 py-11 sm:grid-cols-2">
      <div>
        <div className="eyebrow mb-3">Контакты</div>
        <h1 className="mb-5 text-5xl font-extrabold leading-none tracking-tight">Напишите нам</h1>
        <p className="mb-6 max-w-[46ch] text-[17px] leading-relaxed">
          Нашли неточность, знаете клуб, которого нет в каталоге, или хотите обновить прайс — сообщите, и мы внесём
          правку.
        </p>
      </div>
      <ContactForm />
    </section>
  )
}
