'use server'

import { signInWithPassword, isBanned } from '@/lib/gotrue'
import { setSessionCookie, clearSessionCookie } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/access'

export type LoginResult = { ok: true; owner: boolean } | { ok: false; error: string }

export async function login(email: string, password: string): Promise<LoginResult> {
  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail || !password) return { ok: false, error: 'Email and password are required' }

  const result = await signInWithPassword(cleanEmail, password)
  if (!result.ok) return { ok: false, error: result.error }
  if (isBanned(result.user)) return { ok: false, error: 'This account has been suspended' }

  await setSessionCookie({ sub: result.user.id, email: result.user.email, role: result.user.role ?? 'member' })
  return { ok: true, owner: isSuperAdmin(result.user) }
}

export async function logout(): Promise<void> {
  await clearSessionCookie()
}
