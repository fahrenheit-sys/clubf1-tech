import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Club F1 — Fahrenheit One Technology',
  description: 'The Fahrenheit One technology suite — operational tools built in-house.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
