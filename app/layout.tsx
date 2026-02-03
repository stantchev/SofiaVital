import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin", "cyrillic"] });
const _poppins = Poppins({ 
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"] 
});

export const metadata: Metadata = {
  title: 'SofiaVital - Къде е по-добре да живея в София?',
  description: 'Сравни всички 24 района на София по чист въздух, жега, зеленина, транспорт, училища и бъдещо застрояване. Интерактивна карта за качеството на живот в София.',
  generator: 'v0.app',
  authors: [{ name: 'Stanchev Digital', url: 'https://stanchev.bg' }],
  creator: 'Stanchev Digital',
  publisher: 'Stanchev Digital',
  keywords: ['София', 'квартали', 'райони', 'качество на живот', 'карта', 'въздух', 'транспорт', 'зелени площи', 'SofiaVital'],
  openGraph: {
    title: 'SofiaVital - Къде е по-добре да живея в София?',
    description: 'Интерактивна карта за сравнение на всички 24 района на София по 7 ключови показателя за качеството на живот.',
    type: 'website',
    locale: 'bg_BG',
    siteName: 'SofiaVital',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SofiaVital - Къде е по-добре да живея в София?',
    description: 'Сравни всички 24 района на София по качество на живот.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#2d6a4f',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bg">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
