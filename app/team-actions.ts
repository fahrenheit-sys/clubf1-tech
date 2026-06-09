'use server'

import { revalidatePath } from 'next/cache'
import { requireOwner } from '@/lib/auth'
import { adminCreateUser, adminGetUser, adminUpdateUser, adminDeleteUser } from '@/lib/gotrue'
import { TOOLS } from '@/lib/tools'

export type ActionResult = { ok: true } | { ok: false; error: string }

const SUSPEND_DURATION = '876000h' // ~100 years
const isToolKey = (k: string) => TOOLS.some(t => t.key === k)

export async function createMember(email: string, password: string): Promise<ActionResult> {
  await requireOwner()
  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail) return { ok: false, error: 'Email is required' }
  if (!password || password.length < 6) return { ok: false, error: 'Password must be at least 6 characters' }
  // Create with no grants; the owner assigns tools in the grid afterwards.
  const res = await adminCreateUser(cleanEmail, password, { apps: {} })
  if (!res.ok) return res
  revalidatePath('/admin')
  return { ok: true }
}

// value: 'admin' | 'member' grants the tool; 'none' removes access.
export async function setToolRole(id: string, tool: string, value: string): Promise<ActionResult> {
  await requireOwner()
  if (!isToolKey(tool)) return { ok: false, error: 'Unknown tool' }
  if (!['admin', 'member', 'none'].includes(value)) return { ok: false, error: 'Invalid role' }

  const target = await adminGetUser(id)
  if (!target) return { ok: false, error: 'User not found' }
  if (target.role === 'owner' || target.role === 'admin') {
    return { ok: false, error: 'Owners already have access to every tool' }
  }
  const apps = { ...target.apps }
  if (value === 'none') delete apps[tool]
  else apps[tool] = value
  const res = await adminUpdateUser(id, { app_metadata: { apps } })
  if (!res.ok) return res
  revalidatePath('/admin')
  return { ok: true }
}

export async function setOwner(id: string, makeOwner: boolean): Promise<ActionResult> {
  const admin = await requireOwner()
  if (id === admin.sub) return { ok: false, error: 'You cannot change your own owner status' }
  const res = await adminUpdateUser(id, { app_metadata: { role: makeOwner ? 'owner' : null } })
  if (!res.ok) return res
  revalidatePath('/admin')
  return { ok: true }
}

export async function suspendMember(id: string): Promise<ActionResult> {
  const admin = await requireOwner()
  if (id === admin.sub) return { ok: false, error: 'You cannot suspend your own account' }
  const res = await adminUpdateUser(id, { ban_duration: SUSPEND_DURATION })
  if (!res.ok) return res
  revalidatePath('/admin')
  return { ok: true }
}

export async function reactivateMember(id: string): Promise<ActionResult> {
  await requireOwner()
  const res = await adminUpdateUser(id, { ban_duration: 'none' })
  if (!res.ok) return res
  revalidatePath('/admin')
  return { ok: true }
}

export async function deleteMember(id: string): Promise<ActionResult> {
  const admin = await requireOwner()
  if (id === admin.sub) return { ok: false, error: 'You cannot delete your own account' }
  const res = await adminDeleteUser(id)
  if (!res.ok) return res
  revalidatePath('/admin')
  return { ok: true }
}
