import type { Metadata } from 'next'
import { Archivo } from 'next/font/google'
import './globals.css'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { YandexMetrika } from '../components/YandexMetrika'
import { GoogleAnalytics } from '../components/GoogleAnalytics'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/constants'

const archivo = Archivo({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '600', '800'],
  variable: '--font-archivo',
  display: 'swap'
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — гид по боулинг-клубам Санкт-Петербурга`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: '/',
    siteName: SITE_NAME
  },
  verification: {
    yandex: '78638f6a53611fb9'
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={archivo.variable}>
      <body className="flex min-h-screen flex-col items-center bg-bg font-sans">
        <YandexMetrika />
        <GoogleAnalytics />
        <div className="w-full max-w-[1320px] overflow-hidden border-2 border-ink bg-paper">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
