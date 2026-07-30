import type { Metadata } from 'next'
import { Newsreader, Hanken_Grotesk, DM_Mono } from 'next/font/google'
import './globals.css'

// Self-hosted via next/font. A plain @import in globals.css is dropped by
// Turbopack — no @font-face reaches the browser and the app silently falls back
// to Georgia/Times. Don't go back to @import.
const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
})
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-hanken',
})
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'Club F1 — Fahrenheit One Technology',
  description: 'The Fahrenheit One technology suite — operational tools built in-house.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${hanken.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
