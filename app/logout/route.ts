import { NextResponse } from 'next/server'
import { clearSessionCookie } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Clears the shared session cookie and returns to the public landing.
export async function GET(req: Request) {
  await clearSessionCookie()
  return NextResponse.redirect(new URL('/', req.url))
}
