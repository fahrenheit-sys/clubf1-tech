'use client'
import { useState, useTransition, type CSSProperties } from 'react'
import { useRouter } from 'next/navigation'
import type { TeamMember } from '@/lib/team'
import { logout } from '../auth-actions'
import { createMember, setToolRole, setOwner, suspendMember, reactivateMember, deleteMember } from '../team-actions'
import { UI } from '@/lib/theme'

const ACCENT = '#C15A35'

function fmtDate(s: string | null) {
  if (!s) return '—'
  const d = new Date(s)
  return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function AdminClient({ team, tools, currentUserId, userEmail }: {
  team: TeamMember[]
  tools: { key: string; name: string }[]
  currentUserId: string
  userEmail: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [form, setForm] = useState({ email: '', password: '' })

  const run = (id: string | null, fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null); setBusyId(id)
    startTransition(async () => {
      const res = await fn()
      setBusyId(null)
      if (!res.ok) { setError(res.error ?? 'Action failed'); return }
      router.refresh()
    })
  }

  const addMember = () => run(null, async () => {
    const res = await createMember(form.email, form.password)
    if (res.ok) setForm({ email: '', password: '' })
    return res
  })

  const doLogout = async () => { await logout(); router.replace('/login'); router.refresh() }

  const input: CSSProperties = {
    width: '100%', background: UI.surface, border: `1px solid ${UI.borderStrong}`,
    borderRadius: UI.radiusSm, padding: '9px 12px', color: UI.text, fontSize: 13, outline: 'none',
  }
  const card: CSSProperties = { background: UI.surface, border: `1px solid ${UI.border}`, borderRadius: UI.radius, boxShadow: UI.shadow, padding: 24 }
  const btn = (variant: 'ghost' | 'danger' | 'solid'): CSSProperties => ({
    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: pending ? 'default' : 'pointer',
    border: `1px solid ${variant === 'danger' ? '#E5B4AD' : UI.borderStrong}`,
    background: variant === 'solid' ? UI.text : UI.surface,
    color: variant === 'solid' ? '#fff' : variant === 'danger' ? '#8B3A2E' : UI.text,
  })
  const roleSelect: CSSProperties = { ...input, padding: '5px 8px', fontSize: 12, width: 'auto' }

  return (
    <div style={{ minHeight: '100vh', background: UI.bg }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 32px', background: UI.surface, borderBottom: `1px solid ${UI.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/fahrenheit-one-logo.png" alt="Fahrenheit One" style={{ height: 26, width: 'auto' }} />
          <div style={{ fontSize: 16, fontWeight: 600, color: UI.text }}>Team Access</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a href="/" style={{ fontSize: 13, color: UI.textMuted, textDecoration: 'none' }}>← Hub</a>
          <div style={{ fontSize: 13, color: UI.text }}>{userEmail}</div>
          <button onClick={doLogout} style={{ padding: '7px 12px', background: UI.surface, border: `1px solid ${UI.borderStrong}`, borderRadius: 9, color: UI.textMuted, cursor: 'pointer', fontSize: 12.5 }}>Sign out</button>
        </div>
      </header>

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '32px' }}>
        {/* Invite */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: UI.textFaint, marginBottom: 14 }}>Add a team member</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 11, color: UI.textMuted, display: 'block', marginBottom: 5 }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="name@fahrenheitone.com" style={input} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: UI.textMuted, display: 'block', marginBottom: 5 }}>Temporary password</label>
              <input type="text" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} placeholder="min. 6 characters" style={input} />
            </div>
            <button onClick={addMember} disabled={pending} style={{ ...btn('solid'), padding: '10px 18px', fontSize: 13, fontWeight: 600, opacity: pending && busyId === null ? 0.6 : 1 }}>
              {pending && busyId === null ? 'Adding…' : 'Create account'}
            </button>
          </div>
          <div style={{ marginTop: 10, fontSize: 12, color: UI.textFaint }}>Accounts start with no tool access — grant tools in the grid below.</div>
          {error && (
            <div style={{ marginTop: 14, padding: '10px 12px', background: '#FFF1EF', border: `1px solid ${ACCENT}`, borderRadius: UI.radiusSm, fontSize: 12.5, color: '#8B3A2E' }}>{error}</div>
          )}
        </div>

        {/* Grid */}
        <div style={{ ...card, overflowX: 'auto' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: UI.textFaint, marginBottom: 14 }}>Members · {team.length}</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ textAlign: 'left' }}>
                <th style={th}>Email</th>
                {tools.map(t => <th key={t.key} style={{ ...th, textAlign: 'center' }}>{t.name}</th>)}
                <th style={{ ...th, textAlign: 'center' }}>Owner</th>
                <th style={th}>Status</th>
                <th style={th}>Last sign in</th>
                <th style={{ ...th, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {team.map(m => {
                const isSelf = m.id === currentUserId
                const rowBusy = pending && busyId === m.id
                return (
                  <tr key={m.id} style={{ borderTop: `1px solid ${UI.border}` }}>
                    <td style={{ ...td, fontWeight: 500 }}>
                      {m.email}{isSelf && <span style={{ fontSize: 10, color: UI.textFaint, marginLeft: 6 }}>(you)</span>}
                    </td>
                    {tools.map(t => (
                      <td key={t.key} style={{ ...td, textAlign: 'center' }}>
                        {m.isOwner ? (
                          <span style={{ fontSize: 11, color: UI.textFaint }}>All</span>
                        ) : (
                          <select value={m.grants[t.key] ?? 'none'} disabled={pending}
                            onChange={e => run(m.id, () => setToolRole(m.id, t.key, e.target.value))}
                            style={roleSelect}>
                            <option value="none">No access</option>
                            <option value="member">Member</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                    ))}
                    <td style={{ ...td, textAlign: 'center' }}>
                      {m.isOwner
                        ? <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 999, background: 'rgba(232,160,32,0.16)', color: '#9A6A0F', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Owner</span>
                        : null}
                      {!isSelf && (
                        <button onClick={() => run(m.id, () => setOwner(m.id, !m.isOwner))} disabled={pending}
                          style={{ display: 'block', margin: '6px auto 0', background: 'none', border: 'none', color: UI.textFaint, fontSize: 10, cursor: 'pointer', textDecoration: 'underline' }}>
                          {m.isOwner ? 'revoke' : 'make owner'}
                        </button>
                      )}
                    </td>
                    <td style={td}>
                      <span style={{ display: 'inline-flex', padding: '2px 9px', borderRadius: 999, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase',
                        background: m.status === 'active' ? 'rgba(74,107,80,0.12)' : 'rgba(139,58,46,0.12)',
                        color: m.status === 'active' ? '#3A5A40' : '#8B3A2E' }}>
                        {m.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td style={{ ...td, fontVariantNumeric: 'tabular-nums', color: UI.textMuted }}>{fmtDate(m.last_sign_in_at)}</td>
                    <td style={{ ...td, textAlign: 'right' }}>
                      {!isSelf && (
                        <div style={{ display: 'inline-flex', gap: 8 }}>
                          {m.status === 'active'
                            ? <button onClick={() => run(m.id, () => suspendMember(m.id))} disabled={pending} style={btn('ghost')}>{rowBusy ? '…' : 'Suspend'}</button>
                            : <button onClick={() => run(m.id, () => reactivateMember(m.id))} disabled={pending} style={btn('ghost')}>{rowBusy ? '…' : 'Reactivate'}</button>}
                          <button onClick={() => { if (confirm(`Delete access for ${m.email}? This cannot be undone.`)) run(m.id, () => deleteMember(m.id)) }}
                            disabled={pending} style={btn('danger')}>Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const th: CSSProperties = { fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: UI.textFaint, padding: '8px 12px', fontWeight: 500 }
const td: CSSProperties = { padding: '12px', fontSize: 13, color: UI.text }
