import { redirect } from 'next/navigation'
import { getLiveSessionUser } from '@/lib/auth'
import { isSuperAdmin } from '@/lib/access'
import { listTeam } from '@/lib/team'
import { TOOLS } from '@/lib/tools'
import AdminClient from './admin-client'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const user = await getLiveSessionUser()
  if (!user) redirect('/login?next=/admin')
  if (!isSuperAdmin(user)) redirect('/') // only owners manage the suite

  const team = await listTeam()
  const tools = TOOLS.map(t => ({ key: t.key, name: t.name }))
  return <AdminClient team={team} tools={tools} currentUserId={user.sub} userEmail={user.email} />
}
