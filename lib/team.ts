import { adminListUsers, isBanned } from './gotrue'
import { accessFor, isSuperAdmin } from './access'
import { TOOLS } from './tools'

export type ToolRole = 'admin' | 'member' | 'none'

export type TeamMember = {
  id: string
  email: string
  isOwner: boolean
  status: 'active' | 'suspended'
  created_at: string
  last_sign_in_at: string | null
  grants: Record<string, ToolRole> // keyed by tool.key
}

// All suite users with their per-tool grants — powers the Team Access grid.
export async function listTeam(): Promise<TeamMember[]> {
  const users = await adminListUsers()
  return users
    .map(u => {
      const grants: Record<string, ToolRole> = {}
      for (const t of TOOLS) grants[t.key] = (accessFor(u, t.key) ?? 'none')
      return {
        id: u.id,
        email: u.email,
        isOwner: isSuperAdmin(u),
        status: (isBanned(u) ? 'suspended' : 'active') as 'active' | 'suspended',
        created_at: u.created_at,
        last_sign_in_at: u.last_sign_in_at,
        grants,
      }
    })
    .sort((a, b) => a.email.localeCompare(b.email))
}
