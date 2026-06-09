import { cookies } from 'next/headers'
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession, type SessionUser } from './session'
import { adminGetUser, isBanned } from './gotrue'
import { isSuperAdmin } from './access'

export type { SessionUser } from './session'

export type LiveUser = {
  sub: string
  email: string
  role: string | null
  apps: Record<string, string>
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies()
  return verifySession(store.get(SESSION_COOKIE)?.value)
}

// Resolve the session against live Supabase state (suspended/deleted/changed
// grants reflected immediately, not after the cookie expires).
export async function getLiveSessionUser(): Promise<LiveUser | null> {
  const session = await getSessionUser()
  if (!session) return null
  const live = await adminGetUser(session.sub)
  if (!live || isBanned(live)) return null
  return { sub: live.id, email: live.email, role: live.role, apps: live.apps }
}

export async function setSessionCookie(user: SessionUser): Promise<void> {
  const token = await signSession(user)
  const store = await cookies()
  // SESSION_COOKIE_DOMAIN (".clubf1.tech") shares the session across all suite
  // subdomains for SSO. Unset locally → host-only cookie.
  const domain = process.env.SESSION_COOKIE_DOMAIN
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
    ...(domain ? { domain } : {}),
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  const domain = process.env.SESSION_COOKIE_DOMAIN
  store.delete({ name: SESSION_COOKIE, path: '/', ...(domain ? { domain } : {}) })
}

// The hub's admin area (Team Access) is restricted to suite owners.
export async function requireOwner(): Promise<LiveUser> {
  const user = await getLiveSessionUser()
  if (!user) throw new Error('Not authenticated')
  if (!isSuperAdmin(user)) throw new Error('Owner access required')
  return user
}
